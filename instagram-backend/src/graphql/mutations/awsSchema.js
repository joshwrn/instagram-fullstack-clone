const { gql } = require('apollo-server-express');
const s3 = require('../../utils/config');
const { promisify } = require('util');
const { extname } = require('path');
const { getUrl } = require('../../utils/object');
require('dotenv').config();

//$ mutations
class MutationResolver {
  constructor() {
    this.s3 = s3;
  }

  //create a bucket.
  async createBucket(bucketName) {
    //create an object to hold the name of the bucket.
    const params = {
      Bucket: bucketName,
    };

    //promisify the createBucket() function so that we can use async/await syntax.
    let create_bucket = promisify(this.s3.createBucket.bind(this.s3));

    //call the function to create the bucket.
    await create_bucket(params).catch(console.log);

    //return response to client.
    return {
      success: true,
      message: 'Bucket created successfully.',
    };
  }

  //upload object.
  async uploadObject(file, bucketName) {
    // create an object to hold the name of the bucket, key, body, and acl of the object.
    const params = {
      Bucket: bucketName,
      Key: '',
      Body: '',
      ACL: 'public-read',
    };

    // obtain the read stream function and the filename from the file.
    let { createReadStream, filename } = await file;

    // read the data from the file.
    let fileStream = createReadStream();

    // in case of an error, log it.
    fileStream.on('error', (error) => console.error('error', error));

    // set the body of the object as data to read from the file.
    params.Body = fileStream;

    console.log('file:', params.Body);

    // get the current time stamp.
    let timestamp = new Date().getTime();

    // get the file extension.
    let file_extension = extname(filename);

    // set the key as a combination of the folder name, timestamp, and the file extension of the object.
    params.Key = `images/${timestamp}${file_extension}`;

    // promisify the upload() function so that we can use async/await syntax.
    let upload = promisify(this.s3.upload.bind(this.s3));

    // upload the object.
    let result = await upload(params).catch(console.log);

    // structure the response.
    let object = {
      key: params.Key,
      url: result.Location,
    };

    // return the response to the client.
    return object;
  }

  //upload objects.
  async uploadObjects(files, bucketName) {
    // create an object containing the name of the bucket, the key, body, and acl of the object.
    let params = {
      Bucket: bucketName,
      Key: '',
      Body: '',
      ACL: 'public-read',
    };

    // structure the return data.
    let objects = [];

    // loop through all the sent files.
    for (let i = 0; i < files.length; i++) {
      // Get that single file.
      let file = files[i];

      // From the file, get the read stream and the filename.
      let { createReadStream, filename } = await file;

      // read the data from the file.
      let stream = createReadStream();

      // in case of any error, log it.
      stream.on('error', (error) => console.error(error));

      // assign the body of the object to the data to read.
      params.Body = stream;

      // get the current timestamp.
      let timestamp = new Date().getTime();

      // get the file extension.
      let file_extension = extname(filename);

      // compose the key as the folder name, the timestamp, and the file extension of the object.
      params.Key = `images/${timestamp}${file_extension}`;

      // promisify the upload() function so that we can use async/await syntax.
      let upload = promisify(this.s3.upload.bind(this.s3));

      // upload the object.
      let result = await upload(params).catch(console.log);

      // push the structured response to the objects array.
      objects.push({
        key: params.Key,
        url: result.Location,
      });
    }

    // return the response to the client.
    return objects;
  }

  //delete object.
  async deleteObject(bucketName, key) {
    // create an object to hold the name of the bucket, and the key of an object.
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    // promisify the deleteObject() so that we can use the async/await syntax.
    let removeObject = promisify(this.s3.deleteObject.bind(this.s3));

    // remove the object.
    await removeObject(params).catch(console.log);

    // send back a response to the client.
    return {
      success: true,
      message: 'Object successfully deleted.',
    };
  }

  //delete objects.
  async deleteObjects(bucketName, objectKeys) {
    // create an object to hold the name of the bucket and the objects to be deleted.
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: [],
      },
    };

    // Loop through all the object keys sent pushing them to the params object.
    objectKeys.forEach((objectKey) =>
      params.Delete.Objects.push({
        Key: objectKey,
      })
    );

    // promisify the deleteObjects() function so that we can use the async/await syntax.
    let removeObjects = promisify(this.s3.deleteObjects.bind(this.s3));

    // remove the objects.
    await removeObjects(params).catch(console.log);

    // send back a response to the server.
    return {
      success: true,
      message: 'Successfully deleted objects',
    };
  }

  //delete bucket.
  async deleteBucket(bucketName) {
    // create an object to hold the name of the bucket.
    const params = {
      Bucket: bucketName,
    };

    // promisify the deleteBucket() so that we can use the async/await syntax.
    let removeBucket = promisify(this.s3.deleteBucket.bind(this.s3));

    // remove the bucket.
    await removeBucket(params).catch(console.log);

    // send back a response to the client.
    return {
      success: true,
      message: 'Successfully deleted bucket',
    };
  }
}

//$ queries
class QueryResolver {
  constructor() {
    this.s3 = s3;
  }

  //fetching buckets.
  async fetchBuckets() {
    //promisify the listBuckets() so that we can use the async/await syntax.
    const listBuckets = promisify(this.s3.listBuckets.bind(this.s3));

    //get the buckets.
    let result = await listBuckets().catch(console.log);

    //loop through the result extracting only the name of each bucket.
    result = result.Buckets.map((result) => result.Name);

    //return the bucket names as response to the client.
    return result;
  }

  //fetching objects.
  async fetchObjects(bucketName) {
    // create an object to hold the name of the bucket.
    const params = {
      Bucket: bucketName,
    };

    // promisify the listObjects() function so that we can use the async/await syntax.
    let getObjects = promisify(this.s3.listObjects.bind(this.s3));

    // get the objects.
    let result = await getObjects(params).catch(console.log);

    // come up with the array to be returned.
    let objects = [];

    // Loop through each object returned, structuring the data to be pushed to the objects array.
    result.Contents.forEach((content) => {
      return objects.push({
        key: content.Key,
        url: getUrl.bind(this, bucketName, content.Key),
      });
    });

    // return response to the client.
    return objects;
  }
}

const resolvers = {
  Query: {
    fetchBuckets: () => new QueryResolver().fetchBuckets(),

    fetchObjects: (_, { bucketName }) =>
      new QueryResolver().fetchObjects(bucketName),
  },
  Mutation: {
    uploadImage: async (_, { file }) => {
      const bucketName = process.env.BUCKETNAME;
      const params = {
        Bucket: bucketName,
        Key: '',
        Body: '',
        ACL: 'public-read',
      };

      // obtain the read stream function and the filename from the file.
      let { createReadStream, filename } = await file;

      // read the data from the file.
      let fileStream = createReadStream();

      // in case of an error, log it.
      fileStream.on('error', (error) => console.error('error', error));

      console.log(fileStream);

      // set the body of the object as data to read from the file.
      params.Body = fileStream;

      // get the current time stamp.
      let timestamp = new Date().getTime();

      // get the file extension.
      let file_extension = extname(filename);

      // set the key as a combination of the folder name, timestamp, and the file extension of the object.
      params.Key = `images/${timestamp}${file_extension}`;

      // promisify the upload() function so that we can use async/await syntax.
      //let upload = promisify(this.s3.upload.bind(this.s3));

      // upload the object.
      let result = await s3.upload(params).promise().catch(console.log);

      // structure the response.
      let object = {
        key: params.Key,
        url: result.Location,
      };

      // return the response to the client.
      return object;
    },
    createBucket: (_, { bucketName }) =>
      new MutationResolver().createBucket(bucketName),

    uploadObject: (_, { file, bucketName }) =>
      new MutationResolver().uploadObject(file, bucketName),

    uploadObjects: (_, { files, bucketName }) =>
      new MutationResolver().uploadObjects(files, bucketName),

    deleteObject: (_, { bucketName, key }) =>
      new MutationResolver().deleteObject(bucketName, key),

    deleteObjects: (_, { bucketName, objectKeys }) =>
      new MutationResolver().deleteObjects(bucketName, objectKeys),

    deleteBucket: (_, { bucketName }) =>
      new MutationResolver().deleteBucket(bucketName),
  },
};

const typeDefs = gql`
  type Query {
    fetchBuckets: [String!]!
    fetchObjects(bucketName: String): [Object!]!
  }
  type Mutation {
    createBucket(bucketName: String!): Response
    uploadImage(file: Upload!): Object
    uploadObject(file: Upload!, bucketName: String!): Object
    uploadObjects(files: [Upload!]!, bucketName: String!): [Object!]!
    deleteObject(bucketName: String!, key: String!): Response
    deleteObjects(bucketName: String!, objectKeys: [String!]!): Response
    deleteBucket(bucketName: String!): Response
  }
  # response
  type Response {
    success: Boolean!
    message: String!
  }
  # object
  type Object {
    url: String!
    key: String!
  }
`;

module.exports = { typeDefs, resolvers };
