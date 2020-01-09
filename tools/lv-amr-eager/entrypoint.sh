#!/usr/bin/env bash

java -Xmx4g -cp "stanford-corenlp-full-2015-12-09/*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -serverProperties /opt/amr-eager/corenlp.properties -port 9000 -timeout 15000 &
sleep 1

python3 amr_parser.py
