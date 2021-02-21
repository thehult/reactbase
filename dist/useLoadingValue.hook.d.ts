declare type State<T, E> = [
    value: T | null,
    loading: boolean,
    error: E | undefined
];
export declare const useLoadingValue: <T, E>() => [State<T, E>, () => void, (value: T | null) => void, (error: E) => void];
export {};
