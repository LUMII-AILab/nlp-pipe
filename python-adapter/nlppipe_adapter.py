import json
import logging
import socket
import time
import os
from functools import lru_cache
from kombu import Connection, Queue

logger = logging.getLogger(__name__)


class WorkerProps:
    def __init__(self, conn_str=None, queue_name=None, prefetch_count=50):
        self.conn_str = conn_str or os.getenv('MQ_URL')
        self.prefetch_count = prefetch_count or int(os.getenv('PREFETCH_COUNT',  '10'))
        self.queue_name = queue_name or os.getenv('QUEUE')


class Worker:
    def __init__(self, props: WorkerProps):
        # def __init__(self, props):
        self.props = props

        self.in_queue = Queue(self.props.queue_name)
        with Connection(self.props.conn_str) as conn:
            self.in_queue(conn).declare()

        self.producer = conn.Producer()

        self.cache = {}

    @lru_cache(maxsize=32)
    def get_queue(self, queue_name, declare=True):
        q = Queue(queue_name)
        if declare:
            with Connection(self.props.conn_str) as conn:
                q(conn).declare()
        return q

    def _process(self, body, message):
        logger.info('process headers={}, body={}/{}, msg={}, '.format(message.headers, type(body), body, message))
        try:
            if type(body) == str: body = json.loads(body)
            res = self.process(body)
            res = merge(res, body)
            res = json.dumps(res)
            logger.info('process result {}'.format(res))

            steps = message.headers.get('next')
            next_step = None
            if steps:
                steps = steps.split('|', 2)
                next_step = steps[0]
                message.headers['next'] = steps[1] if len(steps) > 1 else None
            next_headers = message.headers

            if next_step:
                logger.info("Forward {}".format(next_step))
                self.get_queue(next_step)
                self.producer.publish(res, routing_key=next_step, headers=next_headers,
                                      reply_to=message.properties.get('reply_to'),
                                      correlation_id=message.properties.get('correlation_id'),)
            elif message.properties.get('reply_to'):
                logger.info("Reply to {}".format(message.properties.get('reply_to')))
                self.producer.publish(
                    res,
                    exchange='', routing_key=message.properties.get('reply_to'),
                    correlation_id=message.properties.get('correlation_id'),
                    # serializer='json',
                    retry=True,
                )

        except Exception as e:
            logger.exception("Error while processing body={}".format(body))


            if message.properties.get('reply_to'):
                logger.info("Reply to {}".format(message.properties.get('reply_to')))
                headers = message.headers
                headers['']
                self.producer.publish(
                    body,
                    headers=message.headers,
                    exchange='', routing_key=message.properties.get('reply_to'),
                    correlation_id=message.properties.get('correlation_id'),
                    # serializer='json',
                    retry=True,
                )

        message.ack()

    def process(self, body):
        return body

    def run(self):
        with Connection(self.props.conn_str) as conn:
            with conn.Consumer(self.in_queue, callbacks=[self._process], prefetch_count=self.props.prefetch_count):
                while True:
                    try:
                        conn.drain_events(timeout=1)
                    except socket.timeout:
                        time.sleep(1)
                logger.info('Worker exit')


def merge(source, target):
    if not target:
        return source
    if not source:
        return target
    if isinstance(source, (list,)):
        return [merge(s, t) for s, t in zip(source, target)]
    if isinstance(source, dict):
        target.update({k: merge(v, target.get((k))) for k, v in source.items()})
        return target
    return source


if __name__ == '__main__':
    s1 = json.loads("""
    {
        "text": "a b c",
        "sentences": [
            {"tokens": [{"text": "a"}, {"text": "b"}]}
        ]
    }
    """)

    s2 = json.loads("""
    {
        "sentences": [
            {"tokens": [{"c": 1}, {"c": 2}]}
        ]
    }
    """)

    print(json.dumps(merge(s2, s1)))
    print(json.dumps(merge(s1, s2)))
