declare type Data = {
    [x: string]: any;
};
declare type ReturnData = {
    [x: string]: any;
};
export declare const Function: <D extends Data, R extends ReturnData>(functionName: string) => {
    call: (data?: D | undefined) => Promise<R>;
    useResult: (data?: D | undefined) => [R | null, boolean, Error | undefined];
};
export {};
