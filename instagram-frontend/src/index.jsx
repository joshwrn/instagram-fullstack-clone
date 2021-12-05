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
            const includedIn = (set, object) => {
              for (const item of set) {
                if (item['__ref'] === object['__ref']) {
                  return true;
                }
              }
            };
            const newPosts = incoming.posts.filter(
              (post) => !includedIn(existing.posts, post)
            );
            return {
              hasMore: incoming.hasMore,
              posts: [...existing.posts, ...newPosts],
            };
          },
        },
        findProfileFeed: {
          keyArgs: ['id'],
          merge(existing = { hasMore: true, posts: [] }, incoming) {
            return {
              hasMore: incoming.hasMore,
              posts: [...existing.posts, ...incoming.posts],
            };
          },
        },
        findPostComments: {
          keyArgs: ['id'],
          merge(existing = { hasMore: true, comments: [] }, incoming) {
            return {
              hasMore: incoming.hasMore,
              comments: [...existing.comments, ...incoming.comments],
            };
          },
        },
        readMessages: {
          keyArgs: ['threadId'],
          merge(existing = { hasMore: true, messages: [] }, incoming) {
            return {
              hasMore: incoming.hasMore,
              messages: [...existing.messages, ...incoming.messages],
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
