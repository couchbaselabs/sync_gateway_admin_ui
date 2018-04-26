#/bin/sh
go-bindata -pkg sync_gateway_admin_ui -o admin_bundle.go assets/ && \
gofmt admin_bundle.go > gofmt_admin_bundle.go && \
mv gofmt_admin_bundle.go admin_bundle.go