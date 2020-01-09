FROM registry.gitlab.com/artursz/frame-parser:0.1

RUN pip install nlppipe==0.1.0

COPY *.py /app/src/

CMD python worker.py
