#!/bin/bash

CONFIGURE_SCRIPT="configure.py"

sudo apt-get -y install \
gcc-multilib \
g++-multilib \
rpm

yarn

python3 ./$CONFIGURE_SCRIPT