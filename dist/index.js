"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("./store"));
__exportStar(require("./auth"), exports);
__exportStar(require("./firestore"), exports);
__exportStar(require("./functions"), exports);
const Reactbase = {
    initialize: (app, options) => {
        var _a, _b;
        store_1.default.app = app;
        store_1.default.auth = app.auth();
        store_1.default.firestore = app.firestore();
        store_1.default.functions = app.functions((_b = (_a = options === null || options === void 0 ? void 0 : options.functions) === null || _a === void 0 ? void 0 : _a.region) !== null && _b !== void 0 ? _b : undefined);
        if (options)
            Object.assign(store_1.default.options, options);
    }
};
exports.default = Reactbase;
