import { ContractInterface, Contract, ContractId } from '../contract';

/**
 * Le côté distant d'une interface est forcément asynchrone.
 */
export type Remote<I extends ContractInterface> = {
  [F in keyof I]: (...args: Parameters<I[F]>) => Promise<ReturnType<I[F]>>;
};

/**
 * Le côté fournisseur d'une interface peut être synchrone ou asynchrone.
 */
export type Provider<I extends ContractInterface> = {
  [F in keyof I]: (...args: Parameters<I[F]>) => ReturnType<I[F]> | Promise<ReturnType<I[F]>>;
};

type Oposite = {
  'metaplayer': 'application';
  'application': 'metaplayer';
}

type Side = keyof Oposite;

/**
 * Un socket permet à une partie de consommer l'interface de l'autre partie
 * et de lui exposer sa propre interface.
 */
type Socket<ID extends ContractId, S extends Side> = {
  /**
   * Permet de vérifier que le socket est connecté.
   * Log dans la console.
   */
  ping(): Promise<void>;

  /**
   * Une promesse qui se résoud avec l'identifiant du contrat qui a été négocié
   * lorsque le socket est connecté.
   */
  readonly contractId: Promise<ID>;

  /**
   * L'interface fournie par le côté distant.
   * Est `null` tant que le socket n'est pas connecté.
   * Immuable ensuite.
   */
  readonly remote: Remote<Contract[ID][Oposite[S]]>;

  /**
   * Permet à ce côté de fournir son implémentation.
   * 
   * @param provider une fonction qui fournit l'implémentation de ce coté.
   */
  plug(
    provider: <I extends ID>(contractId: I, remote: Remote<Contract[I][Oposite[S]]>) =>
      Provider<Contract[I][S]>
  ): void;

  /**
   * Permet à ce côté de consommer l'implémentation de l'autre côté.
   * 
   * @param task la fonction à executer.
   */
  execute<I extends ID>(task: (contractId: I, remote: Remote<Contract[I][Oposite[S]]>) => void): void;
}


/**
 * MetaPlayerSocket
 * Un socket permet à une partie de consommer l'interface de l'autre partie
 * et de lui exposer sa propre interface.
 */
export type MetaPlayerSocket<ID extends ContractId> = Socket<ID, 'metaplayer'>;

/**
 * ApplicationSocket
 * Un socket permet à une partie de consommer l'interface de l'autre partie
 * et de lui exposer sa propre interface.
 */
export type ApplicationSocket<ID extends ContractId> = Socket<ID, 'application'>;
