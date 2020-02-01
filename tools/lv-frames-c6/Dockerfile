FROM registry.gitlab.com/ailab/lv-frames-c6:1.0

RUN pip install nlppipe==0.1.0

COPY *.py /app/src/

CMD python worker.py
