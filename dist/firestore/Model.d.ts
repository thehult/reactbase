import firebase from 'firebase';
export interface IModel {
    id: string | null;
    ref: firebase.firestore.DocumentReference | null;
    parents: string[];
    update(data: firebase.firestore.DocumentReference): Promise<void> | undefined;
    save(): Promise<void> | undefined;
    pureFirestore(): {};
    load(...ids: string[]): Promise<void> | undefined;
}
/**
 * Use for collection "threads": ```class Thread extends Model("threads") { ... } ```
 * Use for subcollection "replies": ```class Reply extends Model("threads", "replies") { ... } ```
 * @param collection Array of collection names
 */
export declare const Model: (...collection: string[]) => {
    new (): {
        id: string | null;
        ref: firebase.firestore.DocumentReference | null;
        parents: string[];
        update(data: firebase.firestore.UpdateData): Promise<void> | undefined;
        save(): Promise<void> | undefined;
        pureFirestore(): Pick<any, "update" | "save" | "pureFirestore" | "load">;
        load(...ids: string[]): Promise<void>;
    };
    useDocument<T extends {
        id: string | null;
        ref: firebase.firestore.DocumentReference | null;
        parents: string[];
        update(data: firebase.firestore.UpdateData): Promise<void> | undefined;
        save(): Promise<void> | undefined;
        pureFirestore(): Pick<any, "update" | "save" | "pureFirestore" | "load">;
        load(...ids: string[]): Promise<void>;
    }>(this: new () => T, ...ids: (string | undefined)[]): [T | null, boolean, Error | undefined];
};
