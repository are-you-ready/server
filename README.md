# Are You Ready - Web Server

Web Server located at http://ayr.pf-n.co

## Installation

- Make sure you have Node, npm, and Git installed on your machine. (Git is automatically installed when you install XCode)

```bash
node --version  # v7.7.3
npm --version   # 4.1.2
git --version   # git version 2.11.0 (Apple Git-81)
```

- Optional: Install Node (and npm) via NVM

```bash
# Install NVM
apt-get update
apt-get install build-essential libssl-dev
curl -sL https://raw.githubusercontent.com/creationix/nvm/master/install.sh -o nvm.sh
bash nvm.sh

# optional append to .bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

source ~/.nvm/nvm.sh

# optional append to .profile
source ~/.bashrc

# Install Node
nvm ls-remote
nvm install <version>
```

- Clone this repository with git to a folder named `/ayr-server`

```bash
git clone git@github.com:are-you-ready/server.git ayr-server
```

- Install MongoDB (See [Install MongoDB Community Edition on OS X](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/))

```bash
curl -O https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.4.4.tgz
tar -zxvf mongodb-osx-x86_64-3.4.4.tgz
mkdir -p mongodb
cp -R -n mongodb-osx-x86_64-3.4.4/ mongodb

# ~/.bashrc
export PATH=<mongodb-install-directory>/bin:$PATH
```

- Run MongoDB (See [Install MongoDB Community Edition on OS X](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/))

```bash
mkdir -p /data/db
#sudo chmod 777 /data/db
mongod
```

- Install all dependencies with npm

```bash
cd ayr-server   # Move to the /ayr-server directory you created
npm install     # Install dependencies listed in package.json to /node_modules
```

- Populate the database with some data

```bash
npm run reset-db
```

- Run the server locally (on port 3000)

```bash
npm start       # "Server started on port 3000."
```

- Test the server by visiting http://localhost:3000
