import { neo4jgraphql } from 'neo4j-graphql-js';
import { applyDeepAuth } from 'neo4j-deepauth';

export const resolvers = {
  Query: {
    Dog(object, params, ctx, resolveInfo) {
      // No deepauth
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    Cat(object, params, ctx, resolveInfo) {
      // Uses deepauth
      try {
        const { authParams, authResolveInfo } = applyDeepAuth(params, ctx, resolveInfo);
        return neo4jgraphql(object, authParams, ctx, authResolveInfo);
      } catch (e) {
        console.warn(e);
        return neo4jgraphql(object, params, ctx, resolveInfo);
      }
    },
  },
};
