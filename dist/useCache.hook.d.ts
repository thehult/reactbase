export declare const useCache: <T>(bin: string) => {
    get: (key: string) => T | undefined;
    add: (key: string, item: T) => void;
};
