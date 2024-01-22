/**
 * Un contrat d'interface est un ensemble de fonctions.
 */
export type ContractInterface = {
  [key: string]: (...args: unknown[]) => unknown;
}

/**
 * Un contrat spécifie l'interface exposée par chaque partie.
 */
export type UnknownContract = {
  metaplayer: ContractInterface;
  application: ContractInterface;
}

import type { Contract as BasicContract } from './basic';

type ContractMap = {
  '/': UnknownContract;
  '/basic(string)': BasicContract<string>;
}

export type ContractId = keyof ContractMap;

type Identify<ID extends string, C extends UnknownContract> = C & { id: ID; };
export type Contract = {
  [C in ContractId]: Identify<C, ContractMap[C]>;
}
