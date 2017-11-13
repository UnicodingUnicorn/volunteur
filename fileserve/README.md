# fileserve

Simple file server to provide somewhere for pictures, avatars and the like to be uploaded to. Uses minio to store files.

The default port for this service is ```10204```.

## API

### Ping API

```
GET /
```

Just returns a simple received message. Helpful for finding if the service is up.

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Received at Fileserve service |

---

### Get file

```
GET /file/:filename
```

Retrieves the file specified by the filename.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| filename | String | The file's filename, attained when posting the file. |

#### Success 200

The file itself.

#### Error 404

The file the filename specifies cannot be found.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | No such file |

#### Error 500

The server encountered some form of error retrieving the file from minio.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Error retrieving file |

---

### Post a file

```
POST /file
```

Submits a file to be stored. This call require a client ID and secret to be submitted in the form of a basic auth header.

#### Body

| Name | Type | Description |
| ---- | ---- | ----------- |
| file | File | The file, up to 2GB. |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |
| filename | String | The name of the file as stored in the server. |

#### Error 404

The file cannot be found.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | File not found |

#### Error 500

The server encountered an error storing the file in minio.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Error storing file |
