import firebase from 'firebase';
export declare const useAuth: () => [firebase.User | null, boolean, firebase.auth.Error | undefined];
