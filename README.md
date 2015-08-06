# marginalia

## April Arcus & Nicole Watamaniuk

Boilerplate web app

Current thoughts on our stack:

- PostgreSQL: Schema & NoSQL persistence
- iojs: server-site runtime
	- koa: coroutines based http server
		- api.marginalia.com: RESTful API endpoints
		- www.marginalia.com: pre-rendered single page app
	- ???: cache & invalidate pre-renders for signed out users
	- db-migrate: database-agnostic migrations tool
	- knex: database-agnostic SQL query builder
	- bookshelf: lightweight knex-based ORM
	- react: declarative view layer
	- react router: nested routes
	- radium: inline styling library for React
	- redux: front-end model layer
	- babel: es6 language features
	- webpack: module loader (front-end)
	- mocha: minimalist test-runner
	- chai, chai-as-promised, sinon: assertions libraries
	- flow: static analysis for JavaScript

Setting up your dev environment:
		`brew install node flow atom`
		`apm install editorconfig language-babel linter linter-eslint nuclide-flow`
		`git clone git@github.com:AprilArcus/marginalia.git`
		`cd marginalia`
		`npm install`

Connecting to Pearl (Amazon RDS Postgres server)

```
> psql -h pearl.csbmlfu7yw1u.us-west-2.rds.amazonaws.com -U marginalia
< Password for user marginalia:
> [Consult 1Password Vault under 'RDS / Pearl']
```

Status as of Thu Aug 6 03:27:41 UTC 2015:

- AWS postgres server provisioned
- Small Koa server with basic support for auth via
	- koa-pg-session
  - koa-passport
  - passport-local
- POC'ed migrations with node-db-migrate
  - used migration to create sessions table

- TODO: dev database (local postgres instance?)
- TODO: deprecate Handlebars (render to JSON only)
- TODO: wrap all this in tests
