import os
import logging
from flask import Flask, jsonify, request, send_file, redirect, abort
from flask_cors import CORS

import nlppipe.config as config
from nlppipe.client import NlpPipe

logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder=None)
CORS(app)

UI_STATIC_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', 'ui', 'build'))

nlppipe = NlpPipe(config.MQ_URL)


@app.route('/api', methods=['GET', 'POST'])
def hello():
    return 'API is working'


def json_resp(data=None, error=None, exception=None):
    r = {'data': data}
    if error:
        r['error'] = error
    if exception:
        r['error'] = str(exception)
    try:
        resp = jsonify(r)
    except Exception as e:
        msg = 'Jsonify error {}'.format(e)
        logging.exception(msg)
        resp = jsonify({'error': msg})
    return resp


@app.route("/api/process/<steps>/<text>", methods=['GET'])
def process_text(steps: str, text: str):
    steps = steps.split(',')
    try:
        return json_resp(nlppipe.process({'text': text}, steps))
    except Exception as e:
        return json_resp(exception=e)


@app.route("/api/process", methods=['POST'])
def process_document():
    req = request.get_json(force=True, silent=True)
    logger.debug('/api/process {}'.format(req))
    steps = req.get('steps')
    doc = req.get('document')
    try:
        return json_resp(nlppipe.process(doc, steps))
    except Exception as e:
        return json_resp(exception=e)


if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s: %(levelname)s : %(name)s  : %(message)s', level=logging.DEBUG)

    PORT = os.getenv('PORT', '9010')
    HOST = os.getenv('HOST', '0.0.0.0')
    print('RUN API %r %r' % (HOST, PORT))
    app.run(host=HOST, port=int(PORT), debug=True, threaded=False)
