const convertSrc = (src, contentType) => {
  return `data:${contentType};base64,${src}`;
};

export default convertSrc;
