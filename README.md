##Sync Gateway Admin UI

Currently the project is in an early development mode.

###Requirements for dev
1. Node.js (https://nodejs.org)
2. Sync Gateway
3. Chrome with the following extensions:
	- Allow-Control-Allow-Origin : for enabling CORS on Sync Gateway admin port.
	- React Development Tools : for debugging React

###How to run
1. Clone the repo
2. Run `npm install` for the first time.
3. Run `npm start` to build and start the server. This will start a webpack server that will watch the files and rebuild the project automatically.
4. Configure the remote() function in `src/js/Config.js` pointing to your Sync Gateway admin port url. The default one now is `http://localhost:4985`. In the future, this will go away and could be configured from `webpack.config.js` for dev mode.
5. Configure `Allow-Control-Allow-Origin` chrome extension by intercepting only your Sync Gateway Admin port url. For example, `http://localhost:4985/*`.
