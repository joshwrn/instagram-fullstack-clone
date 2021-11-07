const { gql } = require('apollo-server-express');
const Post = require('../../models/post');
const User = require('../../models/user');
const mongoose = require('mongoose');
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';

import * as path from 'path';
import * as fs from 'fs';

// src/resolvers.js
import shortid from 'shortid';
import { createWriteStream, mkdir } from 'fs';
import File from '../../models/file';

const fileRenamer = (filename) => {
  const queHoraEs = Date.now();
  const regex = /[\s_-]/gi;
  const fileTemp = filename.replace(regex, '.');
  let arrTemp = [fileTemp.split('.')];
  return `${arrTemp[0]
    .slice(0, arrTemp[0].length - 1)
    .join('_')}${queHoraEs}.${arrTemp[0].pop()}`;
};
export const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    fileUpload: async (parent, { file }) => {
      let url = [];
      for (let i = 0; i < file.length; i++) {
        const { createReadStream, filename, mimetype } = await file[i];
        const stream = createReadStream();
        const assetUniqName = fileRenamer(filename);
        const pathName = path.join(__dirname, `./upload/${assetUniqName}`);
        await stream.pipe(fs.createWriteStream(pathName));
        const urlForArray = `http://localhost:4000/${assetUniqName}`;
        url.push({ url: urlForArray });
      }
      return url;
    },
  },
};
