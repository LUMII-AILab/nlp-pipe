import logging
import os
import pickle
from nlppipe import Worker, WorkerProps
from barchybrid.arc_hybrid import ArcHybridLSTM
from barchybrid import upostag

logger = logging.getLogger('nlppipe.tools.parser')


def get_parser(MODEL, PARAMS):
    with open(PARAMS, 'rb') as paramsfp:
        words, w2i, pos, rels, stored_opt = pickle.load(paramsfp)
    parser = ArcHybridLSTM(words, pos, rels, w2i, stored_opt)
    parser.Load(MODEL)
    return parser


def process_doc(parser, doc):
    for sentence in doc['sentences']:
        tokens = [{
            'form': t.get('text') or t.get('form'),
            'pos': t.get('tag'),
            'cpos': t.get('tag')
        } for t in sentence['tokens']]
        res_tokens = parser.predict_sentence(tokens)

        for t, rt in zip(sentence['tokens'], res_tokens):
            t['index'] = rt['index']
            t['parent'] = rt['parent']
            t['deprel'] = rt['deprel']
            t['upos'] = upostag.get_synt_upostag(t.get('lemma'), t.get('tag'), rt['deprel'])
            t['ufeats'] = upostag.feats_str(upostag.get_ufeats(t.get('lemma'), t.get('tag')))
    return doc


class MainWorker(Worker):
    def __init__(self, props, MODEL, PARAMS):
        super().__init__(props)
        self.model = get_parser(MODEL, PARAMS)

    def process(self, body):
        logger.debug('process %s', body)
        # parsed_sentences = self.model.predict_sentences(body['sentences'])
        return process_doc(self.model, body)


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s : %(name)s : %(levelname)s : %(message)s', level=logging.DEBUG)

    MODEL = os.getenv('MODEL', '/model/barchybrid.model')
    PARAMS = os.getenv('PARAMS', os.path.join(os.path.dirname(MODEL), 'params.pickle'))

    w = MainWorker(WorkerProps(), MODEL, PARAMS)
    w.run()
