#!/bin/bash
echo "Installing Prerequistes"
apt-get install -y libtool automake


echo "Compiling Binaries"
cd src/canutils/
./autogen.sh
./configure
make
make install
