import React, { useCallback, useReducer } from 'react'

type State<T, E> = [
  value: T | null,
  loading: boolean,
  error: E | undefined,
]

type Action<T, E> = {
  type: "init" | "value" | "error",
  value?: T | null,
  error?: E | undefined
}

const createReducer = <T, E>() => {
  return (state: State<T, E>, action : Action<T, E>) : State<T, E> => {
    switch(action.type) {
      case "init":
        return [null, true, undefined]; //{ value: null, loading: true, error: undefined }
      case "value": 
        return [action.value ?? null, false, undefined]; //{ value: action.value ?? null, loading: false, error: undefined }
      case "error":
        return [null, false, action.error ?? undefined]; //{ value: null, loading: false, error: action.error ?? undefined }
    }
  }
}


export const useLoadingValue = <T, E>() : [State<T, E>, () => void, (value: T | null) => void, (error: E) => void] => {
  const [state, dispatch] = useReducer(createReducer<T, E>(), [null, true, undefined]);

  const init = useCallback(
    () => {
      dispatch({ type: "init" });
    },
    [dispatch]
  )
  
  const setValue = useCallback(
    (value: T | null) => {
      dispatch({ type: "value", value: value });
    },
    [dispatch]
  )
  
  const setError = useCallback(
    (error: E) => {
      dispatch({ type: "error", error: error });
    },
    [dispatch]
  )

  return [state, init, setValue, setError];
}
