# demo_credit API

This is the API and backend server for the Demo Credit mobile application.

## Backend setup

-   Install dependencies `yarn`
-   Create `.env` with your values. Check `.env.example` for more information.
-   Run MySQL server.
-   Run Redis server locally. You can also configure it to use cloud. To use cloud, use `process.env.NODE_ENV === 'production'`.
-   Migrate the database `npm run migrate`.
-   Run seed files `npm run seed` (optional).
-   Server will be running on http://localhost:4000 or otherwise in your `.env` file.

### Error codes

1.  -   code: ACC_ERR_01
    -   alias: acc_not_found
    -   reason: account not found
    
2.  -   code: ACC_ERR_02
    -   alias: acc_not_verified
    -   reason: account not verified

3.  -   code: ACC_ERR_03
    -   alias: acc_not_admin
    -   reason: account not admin
