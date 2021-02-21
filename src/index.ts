import firebase from 'firebase'

import store, { Options } from './store'

export * from './auth'
export * from './firestore'
export * from './functions'
export type {Options};


const Reactbase = {
  initialize: (app: firebase.app.App, options?: Options) => {
    store.app = app;
    store.auth = app.auth();
    store.firestore = app.firestore();
    store.functions = app.functions(options?.functions?.region ?? undefined);
    if(options)
      Object.assign(store.options, options);
  }
}

export default Reactbase;