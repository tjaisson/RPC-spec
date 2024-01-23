type V1 = {
    version: 1;
    contract: {
        ping(): 'pong';
    }
}

type V2 = {
    version: 2;
    contract: {
        hello(): 'world';
    }
}

type V3 = {
    version: 3;
    contract: {
        goodbye(): 'world';
    }
}

type Contracts = [V1, V2, V3];

type Name<N extends string, L extends { version: number }[]> = {
    [K in keyof L]: { name: N, id: `${N}:${L[K]['version']}` } & L[K];
}

type Union<L extends { id: string }[]> = {
    [I in keyof L]: [L[I]['id'], L[I]]
}[number]

type Build<L extends [string, unknown]> = {
    [I in L[0]]: Extract<L, [I, any]>[1];
}

export type ContractMap<N extends string, L extends { version: number }[]> = Build<Union<Name<N, L>>>;

export type Contract = ContractMap<'basic', Contracts>;

type aaa = Contract['basic:1']['contract'];