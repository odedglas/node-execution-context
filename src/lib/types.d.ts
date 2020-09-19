interface ExecutionMapUsageBaseEntry {
    asyncId: number;
    created: number;
    duration: number;
}

interface ExecutionMapUsageChildEntry extends ExecutionMapUsageBaseEntry {
    type: string;
}

interface ExecutionMapUsageEntry extends ExecutionMapUsageBaseEntry {
    asyncId: number;
    children: ExecutionMapUsageChildEntry[];
}

interface ExecutionMapUsage {
    size: number;
    entries: ExecutionMapUsageEntry[];
}

export {
    ExecutionMapUsage,
    ExecutionMapUsageEntry
}