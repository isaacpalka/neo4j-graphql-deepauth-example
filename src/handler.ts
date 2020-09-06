import { ApolloServer, gql } from 'apollo-server-lambda';
import neo4j from 'neo4j-driver';

import { makeAugmentedSchema } from 'neo4j-graphql-js';

import gqlschema = require('./schema.graphql');
import { resolvers } from './resolvers';

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
  context: ({ event, context }) => {
    return {
      driver,
      headers: event.headers,
      functionName: context.functionName,
      event,
      // Pass schema so in some resolvers, we have the ability
      // to call other queries/mutations internally
      schema: schema,
      context,
      deepAuthParams: {
        $user_id: 'Isaac', // Dummy user ID
      },
    };
  },
  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // the `playground` and `introspection` options must be set explicitly to `true`.
  introspection: true,
  tracing: true,
  playground: {
    // FIXME: Hide in prod?
    endpoint: '/dev/graphql',
  },
});

export const graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type', 'Origin', 'Accept'],
  },
});
