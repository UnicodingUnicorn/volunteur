# volunteers

Accounts API for accessing and modifying user accounts, specifically those pertaining to volunteers. Depends on redis as its database.

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
| message | String | Received at Volunteers API |

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

### Get the leaderboard

```
GET /scores
```

Get an array of users ordered on score, with the highest having the lowest index in the array.

#### Query parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | Number | Amount of records to retrieve. Optional, if not present, all the records will be retrieved |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |
| user | Array | Array of: ```{ "user" : <Username>, "score" : <Score>, "place" : <Index + 1> }``` |

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

### Add/Edit a user

```
POST /user
```

Add or edit a user, depending on the presence of ```token``` in the body. Do note that **no** verification for strong passwords or the like is done on the backend.

#### Body

If token is present, the rest of the body is optional; if a field is not present, is simply is not updated.

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | String | Token representing user to be edited |
| username | String | User's username |
| name | String | User's name |
| password | String | User's password |
| bio | String | User's bio |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |

#### Error 404

##### Adding user

One of the fields specified in the body is missing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | ```foo``` not found, where ```foo``` is a missing field described in ```Body```. |

##### Editing user

The user the token specifies cannot be found.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | User not found |

#### Error 400

The user already exists.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | User already exists |

#### Error 403

The token is invalid, only appears if the ```token``` field is present.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Invalid token |

---

### Update a user's location

```
POST /position
```

Update a user's position (latitude and longitude).

#### Body

All of these fields save the token are optional. If one is not present, it is simply not updated.

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | String | JWT from login of the user whose information is being updated |
| lat | String | The user's new latitude |
| lng | String | The user's new longitude |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |

#### Error 404

The user the token specifies cannot be found. Alternatively, one of the coordinate fields is missing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | 'User', 'Lat' or 'Lng' not found |

#### Error 403

The token is invalid.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Invalid token |
