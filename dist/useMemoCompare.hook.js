"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemoCompare = void 0;
const react_1 = require("react");
// Credits to usehooks.com
const useMemoCompare = (next, compare) => {
    const previousRef = react_1.useRef();
    const previous = previousRef.current;
    const isEqual = compare(previous, next);
    react_1.useEffect(() => {
        if (!isEqual) {
            previousRef.current = next;
        }
    });
    return isEqual ? previous : next;
};
exports.useMemoCompare = useMemoCompare;
