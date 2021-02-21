"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
const react_1 = require("react");
const store_1 = __importDefault(require("../store"));
const useAuth = () => {
    const [auth, setAuth] = react_1.useState(null);
    const [loading, setLoading] = react_1.useState(true);
    const [error, setError] = react_1.useState(undefined);
    react_1.useEffect(() => {
        if (store_1.default.auth) {
            const listener = store_1.default.auth.onAuthStateChanged((user) => {
                setAuth(user);
                setLoading(false);
                setError(undefined);
            }, (err) => {
                setAuth(null);
                setLoading(false);
                setError(err);
            });
            return () => { listener(); };
        }
        else {
            setAuth(null);
            setLoading(true);
            setError(undefined);
        }
    }, [store_1.default.auth]);
    return [auth, loading, error];
};
exports.useAuth = useAuth;
