import { useState, useEffect, useCallback, useRef } from 'react';

const useCursor = (end, loading) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef();

  const cursorRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !end) {
          setIsFetching(true);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading]
  );

  return [isFetching, setIsFetching, cursorRef];
};

export default useCursor;
