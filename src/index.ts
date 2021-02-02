import firebase from 'firebase'

import store, { Options } from './store'

export * from './auth'
export * from './firestore'
export type {Options};


const Reactbase = {
  initialize: (app: firebase.app.App, options?: Options) => {
    store.app = app;
    store.auth = app.auth();
    store.firestore = app.firestore();
    if(options)
      Object.assign(store.options, options);
  }
}

export default Reactbase;