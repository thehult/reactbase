import firebase from 'firebase'

export type Options = {
  firestore?: {
    /** How long (in milliseconds) will we cache it for? */
    cacheDocuments?: number | boolean;
  },
  functions?: {
    region?: string;
  }
}

type Store = {
  app?: firebase.app.App;
  auth?: firebase.auth.Auth;
  firestore?: firebase.firestore.Firestore;
  functions?: firebase.functions.Functions;
  options: Options
}

const store : Store = {
  options: {}
}

export default store;