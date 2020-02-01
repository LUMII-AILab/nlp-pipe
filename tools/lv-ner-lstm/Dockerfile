FROM registry.gitlab.com/ailab/lv-ner-lstm:1.0

RUN pip install nlppipe==0.1.0

COPY *.py /app/src/

ENV MODEL /model

CMD python worker.py
