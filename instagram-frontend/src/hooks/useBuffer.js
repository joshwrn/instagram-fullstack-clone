import React, { useState, useEffect } from 'react';
import convertSrc from '../functions/convertSrc';

const useBuffer = (data) => {
  const [buffer, setBuffer] = useState();
  useEffect(() => {
    if (!data) return;
    const convert = convertSrc(data.image, data.contentType);
    setBuffer(convert);
  }, [data]);
  return [buffer, setBuffer];
};

export default useBuffer;
