# organisers

Accounts API for accessing and modifying organiser accounts. Depends on redis as its database.

The default port for this service is ```10205```.

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
| message | String | Received at Accounts API |

---

### Get a user

```
GET /user
```

Get a user based on either username or JWT.

#### Parameters

Only one of these parameters are needed. If both are present, the token takes priority.

| Name | Type | Description |
| ---- | ---- | ----------- |
| username | String | User's username. |
| token | String | JWT representing the user. |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |
| user | Object | User object |

#### Error 403

The token is invalid. Only happens when using a JWT.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Invalid token |

#### Error 404

The user the username or token specifies cannot be found.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | User not found |

#### Error 400

The required parameters are missing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Username not specified |

---

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

---

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
| bio | String | User's bio |
| organisation | String | User's organisation |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |

#### Error 404

Either the username, name or password fields in the body is missing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | ```foo``` not found, where ```foo``` is a missing field described in ```Body```. |

#### Error 400

The user already exists.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | User already exists |

---

### Update a user's information

```
POST /user/update
```

Update a user's information. Do note that **no** verification for strong passwords or the like is done on the backend.

#### Body

All of these fields save the token are optional. If one is not present, it is simply not updated.

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | String | JWT from login of the user whose information is being updated |
| name | String | User's name |
| password | String | User's password |
| organisation | String | User's organisation |
| bio | String | User's bio |

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
