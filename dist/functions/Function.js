"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Function = void 0;
const store_1 = __importDefault(require("../store"));
const useLoadingValue_hook_1 = require("../useLoadingValue.hook");
const react_1 = require("react");
const Function = (functionName) => {
    const call = (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const func = (_a = store_1.default.functions) === null || _a === void 0 ? void 0 : _a.httpsCallable(functionName);
        if (!func)
            return Promise.reject("Function is not set");
        return func(data)
            .then((result) => {
            return Promise.resolve(result.data);
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    });
    const useResult = (data) => {
        const [state, init, setValue, setError] = useLoadingValue_hook_1.useLoadingValue();
        react_1.useEffect(() => {
            let mounted = true;
            init();
            call(data)
                .then((value) => {
                if (mounted)
                    setValue(value);
            })
                .catch((error) => {
                if (mounted)
                    setError(new Error(`${error.code}: ${error.message}\n\n${error.details}`));
            });
            return () => { mounted = false; };
        }, [data]);
        return state;
    };
    return {
        call,
        useResult
    };
};
exports.Function = Function;
