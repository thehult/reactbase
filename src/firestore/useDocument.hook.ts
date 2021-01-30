import { useEffect, useState } from "react";
import { useMemoCompare } from "../useMemoCompare.hook";
import { Model } from "./Model";


require('react-dom');
// @ts-ignore: Unreachable code error
window.React2 = require('react');
// @ts-ignore: Unreachable code error
console.log(window.React1 === window.React2);

export const useDocument = <M extends Model>(DataModel: new () => M, ...ids: string[]) => {
  const [value, setValue] = useState<M | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  const idCached = useMemoCompare<string[]>(ids, (prev: string[] | undefined) => {
    if (!ids || !prev) return false;
    let res = true;
    for (let i = 0; i < ids.length; i++) {
      if (ids?.[i] !== prev?.[i]) res = false;
    }
    return res;
  });

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setValue(null);
    setError(undefined);

    var doc = new DataModel();
    doc.load(...ids)
      .then(() => {
        if(mounted) {
          setValue(doc);
          setError(undefined);
          setLoading(false);
        }
      })
      .catch((err) => {
        setValue(null);
        setError(new Error(err));
        setLoading(false);
      })

    return () => { mounted = false };
  }, [idCached]);
  
  return [value, loading, error];
} 