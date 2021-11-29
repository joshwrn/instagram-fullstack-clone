import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

// separate token so i can use ueh
const token = localStorage.getItem('instagram-clone-auth');

const authLink = setContext((_, { headers, ...context }) => {
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `bearer ${token}` } : {}),
    },
    ...context,
  };
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      ...(token ? { authorization: `bearer ${token}` } : {}),
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        findFeed: {
          keyArgs: false,
          merge(existing = { hasMore: true, posts: [] }, incoming) {
            return {
              hasMore: incoming.hasMore,
              posts: [...existing.posts, ...incoming.posts],
            };
          },
        },
        findProfileFeed: {
          keyArgs: ['id'],
          merge(existing = { hasMore: true, posts: [] }, incoming) {
            console.log('exisiting', existing, 'incoming', incoming.posts);
            return {
              hasMore: incoming.hasMore,
              posts: [...existing.posts, ...incoming.posts],
            };
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  cache: cache,
  link: splitLink,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
