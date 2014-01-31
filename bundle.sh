#/bin/sh
cat assets/index.html | go-bindata -func Admin_bundle_html -pkg sync_gateway_admin_ui | gofmt > admin_bundle.go
