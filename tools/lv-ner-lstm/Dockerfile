FROM registry.gitlab.com/artursz/aznlp:0.1-lv_ner_sembank0.4

RUN pip install nlppipe==0.1.0

COPY *.py /app/src/

ENV MODEL /model

CMD python worker.py
