import firebase from 'firebase'

import store from './store'

export * from './firestore'

const Reactbase = {
  initialize: (app: firebase.app.App) => {
    store.app = app;
    store.firestore = app.firestore();
  }
}

export default Reactbase;