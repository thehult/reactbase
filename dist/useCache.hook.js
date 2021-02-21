"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCache = void 0;
const react_1 = require("react");
const store_1 = __importDefault(require("./store"));
const cache = {};
const useCache = (bin) => {
    var _a;
    const [cacheBin, setCacheBin] = react_1.useState((_a = cache[bin]) !== null && _a !== void 0 ? _a : {});
    const add = (key, item) => {
        var _a;
        if ((_a = store_1.default.options.firestore) === null || _a === void 0 ? void 0 : _a.cacheDocuments) {
            if (!cache[bin])
                cache[bin] = {};
            cache[bin][key] = {
                timestamp: Date.now(),
                item: item
            };
            /*setCacheBin(bin => ({
              ...bin,
              [key]: {
                timestamp: Date.now(),
                item: item
              }
            }));*/
        }
    };
    const get = (key) => {
        var _a, _b;
        if (!cache[bin])
            return undefined;
        const item = cache[bin][key];
        if (!item)
            return undefined;
        if (typeof ((_a = store_1.default.options.firestore) === null || _a === void 0 ? void 0 : _a.cacheDocuments) === "number") {
            if (Date.now() - item.timestamp > ((_b = store_1.default.options.firestore) === null || _b === void 0 ? void 0 : _b.cacheDocuments)) {
                return undefined;
            }
        }
        return item.item;
    };
    return { get, add };
};
exports.useCache = useCache;
