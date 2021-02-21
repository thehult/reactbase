import firebase from 'firebase';
import { Options } from './store';
export * from './auth';
export * from './firestore';
export * from './functions';
export type { Options };
declare const Reactbase: {
    initialize: (app: firebase.app.App, options?: Options | undefined) => void;
};
export default Reactbase;
