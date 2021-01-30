import { useEffect, useRef } from 'react';

// Credits to usehooks.com
export const useMemoCompare = <T>(next: T, compare : (prev: T | undefined, next: T | undefined) => boolean) : T | undefined => {
  const previousRef = useRef<T>();
  const previous = previousRef.current;
  const isEqual = compare(previous, next);

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });

  return isEqual ? previous : next;
};
