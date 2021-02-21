"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoadingValue = void 0;
const react_1 = require("react");
const createReducer = () => {
    return (state, action) => {
        var _a, _b;
        switch (action.type) {
            case "init":
                return [null, true, undefined]; //{ value: null, loading: true, error: undefined }
            case "value":
                return [(_a = action.value) !== null && _a !== void 0 ? _a : null, false, undefined]; //{ value: action.value ?? null, loading: false, error: undefined }
            case "error":
                return [null, false, (_b = action.error) !== null && _b !== void 0 ? _b : undefined]; //{ value: null, loading: false, error: action.error ?? undefined }
        }
    };
};
const useLoadingValue = () => {
    const [state, dispatch] = react_1.useReducer(createReducer(), [null, true, undefined]);
    const init = react_1.useCallback(() => {
        dispatch({ type: "init" });
    }, [dispatch]);
    const setValue = react_1.useCallback((value) => {
        dispatch({ type: "value", value: value });
    }, [dispatch]);
    const setError = react_1.useCallback((error) => {
        dispatch({ type: "error", error: error });
    }, [dispatch]);
    return [state, init, setValue, setError];
};
exports.useLoadingValue = useLoadingValue;
