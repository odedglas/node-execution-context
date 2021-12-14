interface ExecutionContextNode {
    asyncId: number;
    monitor: boolean;
    ref? :number;
    children?: number[];
    context?: object;
    created?: number;
}

type ExecutionContextMap = Map<number, ExecutionContextNode>;

interface ExecutionContextConfig {
    monitor: boolean;
}

export {
    ExecutionContextNode,
    ExecutionContextMap,
    ExecutionContextConfig
}
