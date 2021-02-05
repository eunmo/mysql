# @eunmo/mysql
An async wrapper for MySQL connection pool. This package tries to hide away the boilerplates for the MySQL library to minimize setup.

# Usage

```js
const { dml, query, queryOne } = require('@eunmo/mysql');
awiat dml('CREATE TABLE some_table (C1 int)');
const added1 = await dml('INSERT INTO some_table VALUES (1);');
const added2 = await dml('INSERT INTO some_table VALUES (?);', 2);
const added3 = await dml('INSERT INTO some_table VALUES ?;', [[[3], [4]]]);
const rows = await query('SELECT * FROM some_table;');
const row1 = await queryOne('SELECT * FROM some_table WHERE C1 = ?;', 1);
const row1 = await queryOne('SELECT * FROM some_table WHERE C1 = ?;', [1]);
```

The return type of `dml`/`query` is identical to that of [`mysql`](https://www.npmjs.com/package/mysql) package's `connection.query`.
The return type of `queryOne` is a single row of [`mysql`](https://www.npmjs.com/package/mysql) package's `connection.query` or `null` if no row can be fetched.

# Database connection configuration

This package uses the config [`config`](https://www.npmjs.com/package/config) package for setup. For starters, put the following in `config/default.json`.

```json
{
  "dbConfig": {
    "host": "localhost",
    "user": "dummy_user",
    "password": "dummy_password",
    "database": "dummy"
  }
}
```

If you also want to change the connection pool size, you can also specify it. The default value is 10.

```json
{
  "dbConfig": {
    "host": "localhost",
    "user": "dummy_user",
    "password": "dummy_password",
    "database": "dummy",
    "connectionLimit": 100
  }
}
```

# Jest setup

To use a different config when running `jest` tests, the following three steps are required.

## 1. Write the new setup file.

Contents of `NODE_CONFIG` will be merged with the base config, so only the diff that needs to be changed can be designated. I put this code as `server/setup-tests.js`.

```js
process.env.NODE_CONFIG = '{"dbConfig":{"database":"dummy_test"}}'
```

## 2. Create a jest config file.

This file will point to the setup file from step 1. I put this code as `server/jest-config.json`.

```json
{
  "setupFiles": ["<rootDir>/setup-tests.js"]
}
```

## 3. Run jest with the config file from step 2.

```sh
jest server --config server/jest-config.json
```

Or as part of npm script, run `npm run jest` with the following in `package.json`.

```json
{
  "scripts": {
    "jest": "jest server --config server/jest-config.json"
  }
}
```

Note that if the root directory for jest changes, the path in step 2 should also be updated.

## Cleanup per test file

When running tests with `jest`, the connection pool gets created for every test file. So the connection pool needs to be manually closed. Example:

```js
const { cleanup } = require('@eunmo/mysql');

afterAll(async () => {
  await cleanup();
});
```
