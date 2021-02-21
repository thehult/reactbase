import store from "../store"
import firebase from "firebase"
import { useLoadingValue } from "../useLoadingValue.hook"
import { useEffect } from "react"

type Data = {
  [x: string]: any
}

type ReturnData = {
  [x: string]: any
}

export const Function = <D extends Data, R extends ReturnData>(functionName: string) => {
  

  const call = async (data?: D) : Promise<R> => {
    const func = store.functions?.httpsCallable(functionName);
    if(!func) return Promise.reject("Function is not set");
    return func(data)
      .then((result: firebase.functions.HttpsCallableResult) => {
        return Promise.resolve(result.data as R);
      })
      .catch((error: {code: string, message: string, details: string}) => {
        return Promise.reject(error);
      });
  };

  const useResult = (data?: D) : [R | null, boolean, Error | undefined] =>{
    const [state, init, setValue, setError] = useLoadingValue<R, Error>();

    useEffect(() => {
      let mounted = true;
      init();

      call(data)
        .then((value) => {
          if(mounted) setValue(value);
        })
        .catch((error) => {
          if(mounted) setError(new Error(`${error.code}: ${error.message}\n\n${error.details}`));
        })

      return () => {mounted = false};
    }, [data]);

    return state;
  }


  return {
    call,
    useResult
  }
}
