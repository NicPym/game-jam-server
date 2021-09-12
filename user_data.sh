#!/bin/bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
source .bashrc
nvm install node
sudo yum update -y
sudo yum install git -y
git clone https://github.com/NicPym/game-jam-server.git
cd game-jam-server
npm install
npm start