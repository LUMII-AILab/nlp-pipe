import json
import logging
import os
import tempfile
import subprocess
import requests
from nlppipe import Worker, WorkerProps

logger = logging.getLogger(__name__)


LV_EN_GEN = 'smt-707fe5ce-98f4-46ae-b01a-03070a0db25c'
EN_LV_GEN = 'smt-16d2a887-317f-4ef4-976b-90bd8c5e1a46'

CLIENT_ID = os.getenv('CLIENT_ID', 'u-9ab0841f-1bbf-4cc4-9323-bd5bbddb4f3a')
SYSTEM_ID = os.getenv('SYSTEM_ID', LV_EN_GEN)


def translate(text, system_id=SYSTEM_ID):
    headers = {'client-id': CLIENT_ID}
    data = {
        'appID': 'hugo.lv',
        'text': text,
        'systemID': system_id,
        'options': 'widget=text,alignment,markSentences'
    }
    url = 'https://hugo.lv/ws/Service.svc/json/TranslateEx'
    r = requests.post(url, headers=headers, data=json.dumps(data))
    r = r.json()
    return r


CORENLP_URL=os.getenv('CORENLP_URL', 'http://localhost:9000')


def parse(text):
    with tempfile.TemporaryDirectory() as tmp_dir:
        text_path = os.path.join(tmp_dir, 'text')
        with open(text_path, 'w') as f:
            f.write(text)

        if CORENLP_URL:
            r = requests.post(CORENLP_URL + """/?properties={"annotators":"tokenize,ssplit,pos,lemma,ner,parse","outputFormat":"text"}""", text.encode('utf-8'))
            with open(text_path + '.out', 'w') as f:
                f.write(r.text)
        else:
            subprocess.run(['./preprocessing.sh', '-s', text_path], check=True)

        subprocess.run(['python', 'preprocessing.py', '-f', text_path], check=True)
        subprocess.run(['python', 'parser.py', '-f', text_path], check=True)

        amr = open(text_path + '.parsed').read()
        return amr


class AMREagerWorker(Worker):
    def __init__(self, props: WorkerProps):
        super().__init__(props)

    def process(self, body):
        logger.debug('process', body)
        for sentence in body['sentences']:
            sentence_text = sentence['text'] if 'text' in sentence else ' '.join(t.get('form') or t.get('text') for t in sentence['tokens'])
            sentence['text_en'] = translate(sentence_text)['translation']
            sentence['amr'] = parse(sentence['text_en'])
        return body


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s : %(name)s : %(levelname)s : %(message)s', level=logging.DEBUG)

    # AMREagerWorker(WorkerProps()).run()
    # print(AMREagerWorker(WorkerProps()).process({'sentences': [{'text': 'Zēns negribēja doties mājās.'}]}))

    print(parse('Boy does not want to go.'))
