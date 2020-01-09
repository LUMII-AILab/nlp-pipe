from dotenv import load_dotenv
import os


def getenv_int(key):
    return int(os.getenv(key)) if os.getenv(key) is not None else None


local_fpath = os.path.join(os.path.abspath(os.path.dirname(__file__)), "../local.env")
if os.path.isfile(local_fpath):
    print('loading environment from {}'.format(local_fpath))
    load_dotenv(local_fpath, override=False, verbose=True)

PORT = getenv_int('PORT')

SRC_ROOT = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.join(SRC_ROOT, '..')
TOOLS = [e.strip() for e in os.getenv('TOOLS', '').split('|') if e.strip()]
MQ_URL = os.getenv('MQ_URL', 'amqp://guest:guest@localhost/')
