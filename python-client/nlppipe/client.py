import json
import logging
from kombu import Connection, Queue, Consumer, Producer, uuid

logger = logging.getLogger(__name__)


class NlpPipe:
    def __init__(self, conn_str='amqp://guest:guest@localhost/'):
        self.conn_str = conn_str
        self.conn = Connection(conn_str)
        self.callback_queue = Queue(str(uuid()), exclusive=True, auto_delete=True)

    def on_response(self, message):
        if message.properties['correlation_id'] == self.correlation_id:
            res = message.payload
            if isinstance(res, str):
                res = json.loads(res)
            self.response = res

    def process(self, data, steps):
        self.response = None
        self.correlation_id = uuid()
        logger.info('publish queue={} next={} reply_to={}'.format(steps[0], steps[1:] or None, self.callback_queue.name))
        with Producer(self.conn) as producer:
            producer.publish(
                data,
                exchange='',
                routing_key=steps[0],
                # headers={'next': json.loads(json.dumps(steps[1:]))},
                # headers={'next': ('aa', 'bbb')},
                # headers={'next': json.dumps(['aa', 'bbb'])},
                headers={'next': '|'.join(steps[1:])},
                declare=[self.callback_queue],
                reply_to=self.callback_queue.name,
                correlation_id=self.correlation_id,
            )
        with Consumer(self.conn,
                      on_message=self.on_response,
                      queues=[self.callback_queue], no_ack=True):
            while self.response is None:
                self.conn.drain_events()
        logger.info("Response {}".format(self.response))
        return self.response


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s : %(name)s : %(levelname)s : %(message)s', level=logging.DEBUG)

    p = NlpPipe()

    logger.info(p.process({'text': 'test test'}, ['morphology', 'ner', 'parser']))
