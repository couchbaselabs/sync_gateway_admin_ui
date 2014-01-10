# Developer Consoler for Couchbase Sync Gateway

To use this interface visit [http://localhost:4985/_utils/](http://localhost:4985/_utils/) in your browser. This port is bound to localhost only by default, so if you want to connect to it from a remote device you may need to create a tunnel.

## What can it do?

The main goal of this developer console is to support Sync Function debug and development. So you can edit your Sync Function code and see what it will do *before* you deploy it.

## Known Issues

Currently it tries to load the last 1000 changes into the brower's memory. If you have more than 1000 documents in your database it will only look at the 1000 most recent. In the future we will make this configurable.

## Developing / Contributing

Before you can work on this code, you need nodejs installed locally. Once you have that, run these commands.

	cd utils/
	npm install -g grunt-cli
	npm install
	grunt

You'll need to run `grunt` every time you change code file. You can also run it continuously with `grunt watch`.
