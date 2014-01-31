# Developer Consoler for Couchbase Sync Gateway

To use this interface visit [http://localhost:4985/_admin/](http://localhost:4985/_admin/) in your browser. This port is bound to localhost only by default, so if you want to connect to it from a remote device you may need to create a tunnel.

## What can it do?

The main goal of this developer console is to support Sync Function debug and development. So you can edit your Sync Function code and see what it will do *before* you deploy it.

## Known Issues

Currently it tries to load the last 1000 changes into the brower's memory. If you have more than 1000 documents in your database it will only look at the 1000 most recent. In the future we will make this configurable.

## Developing / Contributing

Before you can work on this code, you need nodejs installed locally. Once you have that, run these commands.

	cd utils/
	npm install -g grunt-cli
	npm install -g tap
	npm install
	grunt

You'll need to run `grunt` every time you change code files. You can also run it continuously with `grunt watch`.

To point Sync Gateway at the development bundle created by `grunt`, add this line to your config file in the top level config:

	"adminUI" : "./utils/assets/index.html",

## Building for Release

To release this code for consumption by Sync Gateway's build process, it needs to be packaged as Go code:

    go get github.com/jteeuwen/go-bindata
    grunt
    ./bundle.sh
