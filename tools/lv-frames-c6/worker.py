import logging
from nlppipe import Worker, WorkerProps
import frame_parser

logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)


class MainWorker(Worker):
    def process(self, body):
        logger.debug('process %s', body)
        for sentence in body['sentences']:
            frames = frame_parser.parse(sentence)
            if frames:
                sentence['frames'] = frames
        return body


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s : %(name)s : %(levelname)s : %(message)s', level=logging.DEBUG)

    w = MainWorker(WorkerProps())
    w.run()
