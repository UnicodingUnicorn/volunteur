# events

Events API for accessing, creating and modifying events. Depends on redis for its database.

The default port for this service is ```10203```.

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

### Get an event by name

```
GET /event/:name
```

Get an event based on name.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | String | Event's username.|

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |
| event | Object | Event object |

### Get all the events

```
GET /events
```

Get all the events available.

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |
| events | Array | Array containing event objects |

### Get events (by count)

```
GET /events/:count
```

Get x number of recent events, where x is the count.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | String | Number of events to retrieve |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |
| events | Array | Array containing event objects |

### Get events (by count and with offset)

```
GET /events/:count/:offset
```

Get x number of recent events offset by y, where x is the count and y is the offset.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | String | Number of events to retrieve |
| offset | String | Number of events by which to offset the count |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |
| events | Array | Array containing event objects |

### Add a new event

```
POST /event/new
```

Add a new user. Do note that **no** verification for the validity of latlng or the like is done on the backend.

#### Body

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | String | JWT representing the user adding the event |
| name | String | Event's name |
| starttime | String | Event's start time, formatted as a JS date-time string. |
| endtime | String | Event's end time, formatted as a JS date-time string. |
| lat | String | Latitude of place at which event is occurring (OPTIONAL) |
| lng | String | Longitude of place at which event is occurring (OPTIONAL) |
| organisation | String | Organisation organising the event |
| organiser | String | Organiser of the event, usually the user who added it |
| description | String | Description of the event |

#### Success 200

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Success |

#### Error 404

One of the fields specified in the body is missing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | ```foo``` not found, where ```foo``` is the missing field. |

#### Error 400

The event already exists.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Event with name already exists |

#### Error 403

The token is invalid.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Invalid token |

### Update an event's information

```
POST /event/update/:name
```

Update an event's information. Do note that **no** verification for the validity of latlng or the like is done on the backend.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | String | Name of the event being updated. |

#### Body

All of these fields save the token are optional. If one is not present, it is simply not updated.

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | String | JWT representing the user updating the event, has to be the same as the one who created the event |
| starttime | String | Event's start time, formatted as a JS date-time string. |
| endtime | String | Event's end time, formatted as a JS date-time string. |
| lat | String | Latitude of place at which event is occurring |
| lng | String | Longitude of place at which event is occurring |
| organisation | String | Organisation organising the event |
| organiser | String | Organiser of the event, usually the user who added it |
| description | String | Description of the event |

#### Error 404

The event the name specifies cannot be found.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Event not found |

#### Error 403

The token is invalid.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Invalid token |

### Add a user to an event

```
POST /event/adduser
```

Add a user to an event.

#### Body

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | String | JWT representing the user being added |
| name | String | Name of the event |

#### Error 404

The event the name specifies cannot be found.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Event not found |

#### Error 403

The token is invalid.

| Name | Type | Description |
| ---- | ---- | ----------- |
| message | String | Invalid token |
