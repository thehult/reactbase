import { useState } from "react";
import store from "./store";

type CacheItem<T> = {
  timestamp: number;
  item: T;
}
type CacheBin<T> = {
  [key: string]: CacheItem<T>;
}
type Cache = {
  [bin: string]: CacheBin<any>;
}
const cache: Cache = {};

export const useCache = <T>(bin: string) => {
  const [cacheBin, setCacheBin] = useState<CacheBin<T>>(cache[bin] ?? {})

  const add = (key: string, item: T) => {
    if(store.options.firestore?.cacheDocuments) {
      if(!cache[bin]) cache[bin] = {};
      cache[bin][key] = {
        timestamp: Date.now(),
        item: item
      };
      /*setCacheBin(bin => ({
        ...bin,
        [key]: {
          timestamp: Date.now(),
          item: item
        }
      }));*/
    }
  }

  const get = (key: string) => {
    if(!cache[bin]) return undefined;
    const item = cache[bin][key] as CacheItem<T>;
    if(!item) return undefined;
    if(typeof store.options.firestore?.cacheDocuments === "number") {
      if(Date.now() - item.timestamp > store.options.firestore?.cacheDocuments) {
        return undefined;
      }
    }
    return item.item;
  }

  return {get, add};
}
