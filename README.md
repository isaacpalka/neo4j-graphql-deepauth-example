# neo4j-graphql-deepauth-example

Example API using neo4j-graphql-deepauth to manage object-level permission in neo4j-graphql

### Install

`yarn`

### Edit .env or env.development for Neo4j creds

Set all variables to settings for your Neo4j instance

### Link local neo4j-graphql-deepauth

In the `neo4j-graphql-deepauth` directory, run `npm link`
In this project's directory, run `yarn link "neo4j-graphql-deepauth"`

### Start serverless offline

`yarn run start`

### Run GraphQL Playground

`http://localhost:4001/graphql`
