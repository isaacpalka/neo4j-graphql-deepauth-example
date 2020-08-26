import { neo4jgraphql } from 'neo4j-graphql-js';
import { applyDeepAuth } from 'neo4j-graphql-deepauth';

export const resolvers = {
  Query: {
    Dog(object, params, ctx, resolveInfo) {
      // No deepauth
      return neo4jgraphql(object, params, ctx, resolveInfo);
      // const authResolveInfo = applyDeepAuth(params, ctx, resolveInfo);
      // return neo4jgraphql(object, params, ctx, authResolveInfo);
    },
    Cat(object, params, ctx, resolveInfo) {
      // Uses deepauth
      const authResolveInfo = applyDeepAuth(params, ctx, resolveInfo);
      return neo4jgraphql(object, params, ctx, authResolveInfo);
    },
  },
};
