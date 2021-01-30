import firebase from 'firebase'

type Store = {
  app?: firebase.app.App;
  firestore?: firebase.firestore.Firestore;
}

const store : Store = {
}

export default store;