import firebase from 'firebase'
import { useEffect, useRef, useState } from 'react';
import store from '../store';
import { useMemoCompare } from '../useMemoCompare.hook';
import assert from 'assert'
import { useLoadingValue } from '../useLoadingValue.hook';
import { useCache } from '../useCache.hook';


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
      const cache = useCache<T>(collection.join("/"));

      const [state, init, setValue, setError] = useLoadingValue<T, Error>();

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
    
        init();
    
        if(idCached && idCached.length === collection.length) {
          // Load from db or cache
          var cached = cache.get(idCached.join("/"));
          if(cached) {
            console.log("Using cache");
            setValue(cached);
          } else {
            console.log("Fetching");
            var doc = new this();
            doc.load(...idCached as string[])
            .then(() => {
              if(mounted) {
                cache.add(idCached.join("/"), doc);
                setValue(doc);
              }
            })
            .catch((err) => {
              if(mounted) setError(new Error(err))
            })
          }
          
        } else {
          // Create new 
          var doc = new this();
          doc.load()
            .then(() => {
              if(mounted) setValue(doc);
            })
            .catch((err) => {
              if(mounted) setError(new Error(err));
            })
        }
        
    
        return () => { mounted = false };
      }, [idCached]);
      
      return state;
    } 

    // End of extended model
  }
} 
