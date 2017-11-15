
<div align="center">
  <img src="assets/volunteur.png" width="256" />
</div>

<h1 align="center">
  Volunteur
</h1>

<p align="center">
  Bringing the fun back into volunteering
</p>

<br>

# What's in the name?

Meetup + volunteering. A portmanteau of 'volunteer' and 'connoisseur'.

## Services

More documentation can be found in each respective folder.

Default ports:
- admin: ```10201```
- accounts: ```10202```
- events: ```10203```
- fileserve: ```10204```

## Redis

There exists seperate dbs in redis for different scopes:
- 0: Volunteer accounts
- 1: Clients
- 2: Events
- 3: Organiser accounts

## Objects

### Volunteer

```
{
  "username" : String,
  "name" : String,
  "password" : String,
  "bio" : String,
  "score" : Number,
  "events" : Array
}
```

### Organiser

```
{
  "username" : String,
  "name" : String,
  "password" : String,
  "bio" : String,
  "score" : Number,
  "events" : Array,
  "organisation" : String
}
```

contact details?

### Event

```
{
  "name" : String,
  "description" : String,
  "organisation" : String,
  "organiser" : String,
  "starttime" : Number,
  "endtime" : Number,
  "lat" : Number, (OPTIONAL)
  "lng" : Number, (OPTIONAL)
  "size" : Number, (OPTIONAL)
  "max_participants" : Number, (OPTIONAL)  
  "picture" : String (OPTIONAL)
}
```

Start and end times stored as UNIX epoch time.
