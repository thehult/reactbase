import firebase from 'firebase'

type Store = {
  app?: firebase.app.App;
  auth?: firebase.auth.Auth;
  firestore?: firebase.firestore.Firestore;
}

const store : Store = {
}

export default store;