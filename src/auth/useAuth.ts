import firebase from 'firebase';
import React, { useEffect, useState } from 'react'
import store from '../store'

export const useAuth = () : [firebase.User | null, boolean, firebase.auth.Error | undefined] => {
  const [auth, setAuth] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<firebase.auth.Error | undefined>(undefined);
 
  useEffect(() => {
    if(store.auth) {
      const listener = store.auth.onAuthStateChanged(
        (user: firebase.User | null) => {
          setAuth(user);
          setLoading(false);
          setError(undefined);
        }, 
        (err?: firebase.auth.Error) => {
          setAuth(null);
          setLoading(false);
          setError(err);
        });
      return () => { listener() };
    } else {
      setAuth(null);
      setLoading(true);
      setError(undefined);
    }
  }, [store.auth])

  return [auth, loading, error];
}
