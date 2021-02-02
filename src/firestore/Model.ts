import firebase from 'firebase'
import { useEffect, useState } from 'react';
import store from '../store';
import { useMemoCompare } from '../useMemoCompare.hook';
import assert from 'assert'


export interface IModel {
  id: string | null;
  ref: firebase.firestore.DocumentReference | null;
  parents: string[];

  update(data: firebase.firestore.DocumentReference): Promise<void> | undefined;
  save(): Promise<void> | undefined;
  pureFirestore(): {}
  load(...ids: string[]): Promise<void> | undefined;
}

/**
 * Use for collection "threads": ```class Thread extends Model("threads") { ... } ```
 * Use for subcollection "replies": ```class Reply extends Model("threads", "replies") { ... } ```
 * @param collection Array of collection names
 */
export const Model = (...collection: string[]) => {
  assert(collection.length > 0, "Collection parameter must be at least 1.")


  return class DataModel implements IModel {
    // Start of extended model
    id: string | null = null;
    ref: firebase.firestore.DocumentReference | null = null;
    parents: string[] = [];
    
    update(data: firebase.firestore.UpdateData) {
      Object.assign(this, data);
      return this.save();
    }
  
    save() {
      return this.ref?.update(this.pureFirestore());
    }
  
    pureFirestore() {
      const {id, ref, parents, ...data} = this;
      return data;
    }
  
  
    load(...ids: string[]) {
      const promise = new Promise<void>((resolve, reject) => {
        if(!store.firestore) return reject("Reactbase not initialized");
        if(ids.length > collection.length) return reject("Id array too long.");
        if(ids.length < collection.length - 1) return reject("Id array too small.");
        
        var ref: firebase.firestore.Firestore | firebase.firestore.DocumentReference = store.firestore as firebase.firestore.Firestore;
        for(var i = 0; i < collection.length; i++) {
          if(i > ids.length - 1) 
            ref = ref.collection(collection[i]).doc()
          else
            ref = ref.collection(collection[i]).doc(ids[i]);
        }
        
        console.log("Getting " + (ref as firebase.firestore.DocumentReference).path);

        this.ref = ref as firebase.firestore.DocumentReference;
        this.id = this.ref.id;
        this.parents = ids.filter((val, ind) => ind != collection.length - 1);
        this.ref.get()
          .then((snapshot) => {
            Object.assign(this, snapshot.data());
            resolve();
          })
          .catch((err) => reject(err));
      });
      return promise;
    }

    static useDocument<T extends DataModel>(this: new() => T , ...ids: (string | undefined)[]) : [T | null, boolean, Error | undefined] {
      const [value, setValue] = useState<T | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<Error | undefined>(undefined);
      
      const idCached = useMemoCompare<string[]>(ids as string[], (prev: string[] | undefined) => {
        if (!ids || !prev) return false;
        let res = true;
        for (let i = 0; i < ids.length; i++) {
          if (ids?.[i] !== prev?.[i]) res = false;
        }
        return res;
      });
    
      useEffect(() => {
        let mounted = true;
    
        setLoading(true);
        setValue(null);
        setError(undefined);
    
        if(ids) {
          var doc = new this();
          doc.load(...ids as string[])
            .then(() => {
              if(mounted) {
                setValue(doc);
                setError(undefined);
                setLoading(false);
              }
            })
            .catch((err) => {
              setValue(null);
              setError(new Error(err));
              setLoading(false);
            })
        }
    
        return () => { mounted = false };
      }, [idCached]);
      
      return [value, loading, error];
    } 

    // End of extended model
  }
} 
