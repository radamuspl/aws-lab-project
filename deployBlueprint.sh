#
# It's blueprint for script which should be paste in "User data" field in Lunch Configuration
#

#! /bin/bash

apt-get -y update
apt-get -y install nodejs npm git
ln -s /usr/bin/nodejs /usr/bin/node
npm install -g forever

cd /usr/bin
git clone https://github.com/<username>/<projectname>.git

# For private rep use:
# git clone https://<username>:<password>@github.com/<username>/<projectname>.git

cd /usr/bin/<projectname>/<aws-config path>/
cat <<EOF > ./aws-config.json
{ "accessKeyId": "<accessKeyId>", "secretAccessKey": "<secretAccessKey>", "region": "<region>" }
EOF

cd /usr/bin/<projectname>/<app.js path>/
npm install
forever app.js