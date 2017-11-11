# accounts

Accounts API for accessing and modifying user accounts. Depends on redis as its database.

The default port for this service is ```10202```.

## API

Every endpoint save the ping requires the client id and secret provided in the form of a basicauth header.

### Ping API

```
GET /
```

Just returns a simple received message. Helpful for finding if the API is up.

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Received at Accounts API|

### Get a user by username

```
GET /user/:username
```

Get a user based on username.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| username | String | User's username.|

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |
| user | Object | User object |

### Login

```
POST /login
```

Login a user.

#### Body

| Name | Type | Description |
| ---- | ---- | ----------- |
| username | String | User's username |
| password | String | User's password |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |
| token | String | JWT used on future requests requiring a logged-in user. |

#### Error 404

Either the username or password fields in the body is missing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | ```foo``` is missing, where ```foo``` is either 'Username' or 'Password'. |

#### Error 403

The login has failed due to an invalid password.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Invalid password |

### Add a new user

```
POST /user/new
```

Add a new user. Do note that **no** verification for strong passwords or the like is done on the backend.

#### Body

| Name | Type | Description |
| ---- | ---- | ----------- |
| username | String | User's username |
| name | String | User's name |
| password | String | User's password |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |

#### Error 404

Either the username, name or password fields in the body is missing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | ```foo``` not found, where ```foo``` is either 'Username', 'Name' or 'Password'. |

#### Error 400

The user already exists.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | User already exists |

### Update a user's information

```
POST /user/update/:token
```

Update a user's information. Do note that **no** verification for strong passwords or the like is done on the backend.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | String | JWT from login of the user whose information is being updated |

#### Body

All of these fields are optional. If one is not present, it is simply not updated.

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | String | User's name |
| password | String | User's password |
| organisation | String | User's organisation |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |

#### Error 404

The user the token specifies cannot be found.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | User not found |

#### Error 403

The token is invalid.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Invalid token |
