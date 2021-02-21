"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const react_1 = require("react");
const store_1 = __importDefault(require("../store"));
const useMemoCompare_hook_1 = require("../useMemoCompare.hook");
const assert_1 = __importDefault(require("assert"));
const useLoadingValue_hook_1 = require("../useLoadingValue.hook");
const useCache_hook_1 = require("../useCache.hook");
/**
 * Use for collection "threads": ```class Thread extends Model("threads") { ... } ```
 * Use for subcollection "replies": ```class Reply extends Model("threads", "replies") { ... } ```
 * @param collection Array of collection names
 */
const Model = (...collection) => {
    assert_1.default(collection.length > 0, "Collection parameter must be at least 1.");
    return class DataModel {
        constructor() {
            // Start of extended model
            this.id = null;
            this.ref = null;
            this.parents = [];
            // End of extended model
        }
        update(data) {
            Object.assign(this, data);
            return this.save();
        }
        save() {
            var _a;
            return (_a = this.ref) === null || _a === void 0 ? void 0 : _a.update(this.pureFirestore());
        }
        pureFirestore() {
            const _a = this, { id, ref, parents } = _a, data = __rest(_a, ["id", "ref", "parents"]);
            return data;
        }
        load(...ids) {
            const promise = new Promise((resolve, reject) => {
                if (!store_1.default.firestore)
                    return reject("Reactbase not initialized");
                if (ids.length > collection.length)
                    return reject("Id array too long.");
                if (ids.length < collection.length - 1)
                    return reject("Id array too small.");
                var ref = store_1.default.firestore;
                for (var i = 0; i < collection.length; i++) {
                    if (i > ids.length - 1)
                        ref = ref.collection(collection[i]).doc();
                    else
                        ref = ref.collection(collection[i]).doc(ids[i]);
                }
                console.log("Getting " + ref.path);
                this.ref = ref;
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
        static useDocument(...ids) {
            const cache = useCache_hook_1.useCache(collection.join("/"));
            const [state, init, setValue, setError] = useLoadingValue_hook_1.useLoadingValue();
            const idCached = useMemoCompare_hook_1.useMemoCompare(ids, (prev) => {
                if (!ids || !prev)
                    return false;
                let res = true;
                for (let i = 0; i < ids.length; i++) {
                    if ((ids === null || ids === void 0 ? void 0 : ids[i]) !== (prev === null || prev === void 0 ? void 0 : prev[i]))
                        res = false;
                }
                return res;
            });
            react_1.useEffect(() => {
                let mounted = true;
                init();
                if (idCached && idCached.length === collection.length) {
                    // Load from db or cache
                    var cached = cache.get(idCached.join("/"));
                    if (cached) {
                        console.log("Using cache");
                        setValue(cached);
                    }
                    else {
                        console.log("Fetching");
                        var doc = new this();
                        doc.load(...idCached)
                            .then(() => {
                            if (mounted) {
                                cache.add(idCached.join("/"), doc);
                                setValue(doc);
                            }
                        })
                            .catch((err) => {
                            if (mounted)
                                setError(new Error(err));
                        });
                    }
                }
                else {
                    // Create new 
                    var doc = new this();
                    doc.load()
                        .then(() => {
                        if (mounted)
                            setValue(doc);
                    })
                        .catch((err) => {
                        if (mounted)
                            setError(new Error(err));
                    });
                }
                return () => { mounted = false; };
            }, [idCached]);
            return state;
        }
    };
};
exports.Model = Model;
