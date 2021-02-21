import firebase from 'firebase';
export declare type Options = {
    firestore?: {
        /** How long (in milliseconds) will we cache it for? */
        cacheDocuments?: number | boolean;
    };
    functions?: {
        region?: string;
    };
};
declare type Store = {
    app?: firebase.app.App;
    auth?: firebase.auth.Auth;
    firestore?: firebase.firestore.Firestore;
    functions?: firebase.functions.Functions;
    options: Options;
};
declare const store: Store;
export default store;
