FROM openjdk:8-alpine

WORKDIR /app

COPY target/nlppipe-lvtagger*-jar-with-dependencies.jar /app/

ENV CLASSPATH /app/*

CMD java lv.ailab.nlppipe.tools.lvtagger.Morphology
