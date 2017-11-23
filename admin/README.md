# admin

Basic admin interface to aid in managing database records. It is extremely inadvisable to expose this on production.

The default port for this service is ```10201```.

## Environment variables

- ADMIN_ID: Admin ID, used for authentication
- ADMIN_PASSWORD: Admin Password, used for authentication
- JWT_SECRET: Secret for JWT which holds the session
- COOKIE_SECRET: Secret for cookie which stores session client-side
