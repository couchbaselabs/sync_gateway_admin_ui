**NOTE:** development on this has stopped and moved to the [dev branch](https://github.com/couchbaselabs/sync_gateway_admin_ui/tree/dev) which is a re-write from scratch!

# Developer Console for Couchbase Sync Gateway

This is not a standalone project -- it's a submodule of the [Couchbase Sync Gateway][SG]. We are keeping it in a separate repository so that its Git commits and Github issues are separated from the main gateway's, for clarity. In addition, this project is currently in an early development and experimental phase. The resulting dashboard will change drastically in the near future.

This project contains the Web assets for the Sync Gateway's admin console. To use this interface, launch a Sync Gateway server and visit [http://localhost:4985/_admin/](http://localhost:4985/_admin/) in your browser. (This port is bound to localhost-only by default, so if you want to connect to it from a remote device you may need to create a tunnel or change your gateway config.)

## What can you do with it?

* View and edit your Sync Function code and see what it will do *before* you deploy it
* Browse through all databases and their documents
* View the JSON contents of any document, plus its channel assignments and any channel access it grants
* View the internal `_sync` metadata of any document (useful mostly for troubleshooting the Sync Gateway)

## Known Issues

Currently it tries to load the last 1000 changes into the brower's memory. If you have more than 1000 documents in your database it will only look at the 1000 most recent. In the future we will make this configurable.

## Developing / Contributing

**NOTE:** To use the existing admin UI you don't need to do anything with this repository; it's already built into the Sync Gateway. You only need to follow these instructions if you want to make changes to the admin UI.

Before you can work on this code, you need [node.js][NODEJS] installed locally. Once you have that, run these commands.

```bash
	cd src/github.com/couchbaselabs/sync_gateway_admin_ui
	npm install -g grunt-cli   # you might need to sudo this
	npm install -g tap         # ditto
	npm install
	grunt
```

You'll need to run `grunt` every time you change code files. You can also run it continuously with `grunt watch`.

To point Sync Gateway at the development bundle created by `grunt`, add this line to your Sync Gateway config file at the top level:

```
	"adminUI" : "src/github.com/couchbaselabs/sync_gateway_admin_ui/assets/index.html",
```

## Building for Release

To release this code for consumption by Sync Gateway's build process, it needs to be packaged as Go code:

```bash
    go get github.com/jteeuwen/go-bindata
    grunt
    ./bundle.sh
```

[SG]: https://github.com/couchbase/sync_gateway
[NODEJS]: http://nodejs.org
