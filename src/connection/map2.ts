type V1 = {
    ping(): 'pong';
}

type V2 = V1 & {
    hello(): 'world';
}

type V3 = V2 & {
    goodbye(): 'world';
}

type ContractV = {
    '1': V1;
    '2': V2;
    '3': V3;
}

type VContractV = {
    [V in keyof ContractV]: ContractV[V] & { version: V };
}

type ContractIdsss = {
    [V in keyof VContractV]: `basic:${V}`;
}

type ContractIdddd = ContractIdsss[keyof ContractIdsss];

type ContractI = {
    [ID in ContractIdddd]: VContractV[ID extends `basic:${infer V}` ? V : never];
}

type Contractttt = {
    [ID in ContractIdddd]: ContractI[ID] & { id: ID } & { name: 'basic' };
}

// Générique
type AddVersionAndName<N, L> = {
    [V in keyof L]: L[V] & { version: V, name: N };
}

type aa = {
    '1': V1;
    '2': V2;
    '3': V3;
}

type ContractIdsMap<N extends string, L> = {
    [V in keyof L]: V extends string ? `${N}:${V}` : never;
}

type bb = ContractIdsMap<'basic', aa>;

type ContractId<N extends string, L> = ContractIdsMap<N, L>[keyof ContractIdsMap<N, L>];

type cc = ContractId<'basic', aa>;

type BuildContractMap<N extends string, L extends { [K: string]: any }> = {
    [ID in ContractId<N, L>]: L[ID extends `${N}:${infer V}` ? V : never];
}

type MapVersions<N extends string, L extends { [K: string]: any }> =
    BuildContractMap<N, AddVersionAndName<N, L>>;

export type Contract = MapVersions<'basic', {
    '1': V1;
    '2': V2;
    '3': V3;
}>;