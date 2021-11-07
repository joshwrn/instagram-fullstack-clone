const { gql } = require('apollo-server-express');
import * as path from 'path';
import * as fs from 'fs';

const typeDefs = gql`
  scalar Upload
  type File {
    url: String!
  }
  type Query {
    otherFields: Boolean!
  }
  type Mutation {
    fileUpload(file: [Upload]!): [File]!
  }
`;

module.exports = { typeDefs };
