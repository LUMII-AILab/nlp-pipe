FROM ubuntu:16.04

RUN apt update  && apt install -y sudo git wget python python-pip python-dev openjdk-8-jre-headless python3-dev python3-pip locales

## setup torch and install required lua libraries
WORKDIR /opt/torch
RUN git clone https://github.com/torch/distro.git ./ --recursive && bash install-deps && ./install.sh -b
RUN . /opt/torch/install/bin/torch-activate && luarocks install nn && luarocks install dp && luarocks install nngraph && luarocks install optim

# install required python libraries
RUN pip install --upgrade numpy==1.16 nltk==3.4.5 parsimonious==0.8.1 six==1.13.0 torch

# setup pytorch
WORKDIR /opt/pytorch
RUN git clone https://github.com/hughperkins/pytorch.git ./ && . /opt/torch/install/bin/torch-activate && ./build.sh

# set locale and environment variables
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# copy source to container
WORKDIR /opt/amr-eager
RUN git clone https://github.com/mdtux89/amr-eager.git ./ && git checkout 2e89622a33c995da9bef549ed15c130c641e527a

# download pre-trained models
RUN ./download.sh

RUN pip3 install --upgrade requests==2.22.0 flask==1.0.2 flask_cors==3.0.1 gunicorn==19.9.0 nlppipe==0.1.0

COPY amr_parser.py entrypoint.sh ./

CMD ./entrypoint.sh
