const createBuffer = async (file) => {
  // function to convert stream to buffer
  function stream2buffer(stream) {
    return new Promise((resolve, reject) => {
      const _buf = [];

      stream.on('data', (chunk) => _buf.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(_buf)));
      stream.on('error', (err) => reject(err));
    });
  }

  const { createReadStream, filename, mimetype, encoding } = await file;
  const stream = createReadStream();

  const buffer = await stream2buffer(stream);
  const str = buffer.toString('base64');
  const obj = { image: str, contentType: mimetype };
  return obj;
};

module.exports = createBuffer;
