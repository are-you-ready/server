# Are You Ready - Web Server

Web Server located at http://ayr.pf-n.co

## Installation

- Make sure you have Node, npm, and Git installed on your machine. (Git is automatically installed when you install XCode)

```bash
node --version  # v7.7.3
npm --version   # 4.1.2
git --version   # git version 2.11.0 (Apple Git-81)
```

- Clone this repository with git to a folder named `/ayr-server`

```bash
git clone git@github.com:are-you-ready/server.git ayr-server
```

- Install all dependencies with npm

```bash
cd ayr-server   # Move to the /ayr-server directory you created
npm install     # Install dependencies listed in package.json to /node_modules
```

- Run the server locally (on port 3000)

```bash
npm start       # "Server started on port 3000."
```

- Test the server by visiting http://localhost:3000
