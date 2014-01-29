#/bin/sh
mkdir -p src/github.com/couchbaselabs/sync_gateway_admin_ui/ && cat assets/index.html | go-bindata -func Admin_bundle_html -pkg sync_gateway_admin_ui | gofmt > src/github.com/couchbaselabs/sync_gateway_admin_ui/admin_bundle.go
