import firebase from 'firebase'
import { useState } from 'react';
import store from '../store';

export class Model {
  static path: string | undefined = undefined;


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
      var path = (<typeof Model>this.constructor).path;
      if(!path) 
        reject("Path not set.");
      else {
        let tmpids = [...ids];
        var p = path.replace(/\:\w*/gm, (match) => {
          var id = tmpids.shift();
          if(!id) reject("Id array not long enough.");
          return id ?? "";
        });
        console.log("Path: " + p);
        if(tmpids.length > 0) 
          reject("Id array too long.");
        else {
          if(!store.firestore) 
            reject("Firestore not initialized.");
          else {
            console.log("Getting " + p);

            this.id = ids[ids.length - 1];
            this.ref = store.firestore.doc(p);
            this.parents = ids.filter((val, ind) => ind != ids.length - 1);
            this.ref.get()
              .then((snapshot) => {
                Object.assign(this, snapshot.data());
                resolve();
              })
              .catch((err) => reject(err));
          }
        }
      }
    });
    return promise;
  }

  static useTest() {
    const [test, setTest] = useState("");

    return [test, setTest];
  }
}

