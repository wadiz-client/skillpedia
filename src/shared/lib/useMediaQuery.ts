'use client';

import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [isMatched, setIsMatched] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = () => {
      setIsMatched(mediaQueryList.matches);
    };

    handleChange();
    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return isMatched;
};
