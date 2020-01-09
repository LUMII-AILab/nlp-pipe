import logging
import os
from nlppipe import Worker, WorkerProps

from tag.tagger import LstmTagger
from tag.tokenizer import ws_tokenize

logger = logging.getLogger('nlppipe.tools.ner')


class MainWorker(Worker):
    def __init__(self, props: WorkerProps, MODEL):
        super().__init__(props)
        self.tagger = LstmTagger.load(MODEL)

    def process(self, body):
        logger.debug('process', body)
        doc = body
        try:
            sentences = doc['sentences']
            sent_tokens = [dict(tokens=[t['text'] for t in s['tokens']]) for s in sentences]
            entities = self.tagger.predict_spans(sent_tokens)
            for sent in sentences:
                sent['ner'] = []
            for entity in entities:
                sentences[entity['sent_idx']]['ner'].append(dict(
                    text=entity['text'],
                    label=entity['label'],
                    start=entity['start_idx'],
                    end=entity['end_idx'],
                ))
        except Exception as e:
            logging.exception('Exception on {}... {}'.format(doc, e))
        return body


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s : %(name)s : %(levelname)s : %(message)s', level=logging.DEBUG)

    w = MainWorker(WorkerProps(), os.getenv('MODEL'))
    w.run()
