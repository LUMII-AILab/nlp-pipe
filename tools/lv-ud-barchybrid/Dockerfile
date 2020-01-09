FROM registry.gitlab.com/artursz/barchybrid-parser:lvtb2.3_spos_v3

RUN pip install nlppipe==0.1.0

COPY *.py /app/

ENV PYTHONIOENCODING=utf-8
ENV MODEL=models/model/barchybrid.model

CMD python3 worker.py
