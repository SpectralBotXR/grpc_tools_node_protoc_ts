# Protoc Gen Typescript -- SpectralBot fork

## Where to edit things?

`src > lib > template > partial > message.hbs` contains the template for the message class. This is where we adapted the `*List` suffix to be removed.
The plan is to extend this functionality to support the `Database Doc`

`src > lib > template > partial > enum.hbs` will be adapted to contain Translation properties for the enum values too.

## Building

Use `npm run build` to build the project. The build artifacts will be stored in the `build/` directory.

The binary file will end up in `bin/protoc-gen-ts`. This is the file you'll be using as your plugin for protoc.

```
protoc \
--plugin=protoc-gen-custom_ts=/protoc-plugins/protoc-gen-ts-sb/bin/protoc-gen-ts \
--custom_ts_out=grpc_js:${OUT_DIR} \
```

This assumes you mapped the `protoc-gen-ts-sb` folder inside the `protoc-plugins` directory.
