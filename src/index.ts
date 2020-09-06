import { ApolloServer, gql } from 'apollo-server';
import neo4j from 'neo4j-driver';

import { makeAugmentedSchema } from 'neo4j-graphql-js';

import { gqlschema } from './schema';
import { resolvers } from './resolvers';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const typeDefs = gql`
  ${gqlschema}
`;

/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */

const neo4jUri = process.env.NEO4J_URI || '';
const neo4jUser = process.env.NEO4J_USER || '';
const neo4jPassword = process.env.NEO4J_PASSWORD || '';

const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));

const schema = makeAugmentedSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return {
      ...req,
      driver,
      headers: req.headers,
      // Pass schema so in some resolvers, we have the ability
      // to call other queries/mutations internally
      schema,
      deepAuthParams: {
        $uuid: 'Isaac', // Dummy user ID
      },
    };
  },
});

server.listen(process.env.GRAPHQL_LISTEN_PORT || 4001, '0.0.0.0').then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`);
});
