/**
 * Une proposition d'implémentaion du côté *Application* de la communication basée sur *comlink*
 * 
 * - fournit à l'*Application* une interface distante avec le *MetaPlayer*
 * - permet à l'*Application* d'exposer sa propre implémentaion au *MetaPlayer*
 */

import { windowEndpoint, expose, wrap } from 'comlink';
import type { Endpoint } from 'comlink';

import type { ContractId, Contract } from '../../contract';
import type { ApplicationSocket, Provider, Remote } from '..';



let endpoint: Endpoint | null = null;
function getEndpoint(): Endpoint | null {
    if (endpoint != null) return endpoint;
    // Sommes-nous dans un iframe ?
    if (window.parent === window) return null;
    endpoint = windowEndpoint(window.parent)
    return endpoint;
}

let plugged = false;
/**
 * Permet à l'*Application* d'exposer sa propre implémentaion au *MetaPlayer*.
 * Ne devrait être appelée qu'une seule fois.
 * 
 * @param provider L'implémentation de l'interface `Application` fournie par l'*Application*.
 */
function plugg<C extends UnknownContract>(provider: Application<C>): void {
    if (plugged) throw new Error('Application already plugged');
    const endpoint = getEndpoint();
    if (endpoint == null) throw new Error('Application is not in an iframe');
    expose(provider, endpoint);
    plugged = true;
}

const readyPromise = new Promise<ContractId>((resolve, reject) => {

});

function negotiate(implemented: ContractId[]): Promise<ContractId> {
    const endpoint = getEndpoint();
    if (endpoint == null) throw new Error('Application is not in an iframe');
    return new Promise<ContractId>((resolve, reject) => {

    });
}

/**
 * Socket de l'*Application*.
 */
function getSocket<ID extends ContractId>(implemented: ID[]): ApplicationSocket<ID> {
    type C = Contract[ID];
    const endpoint = getEndpoint();
    if (endpoint == null) throw new Error('Application is not in an iframe');
    const remoteHandle = wrap<{
        ping(stop: boolean): void;
        hello(implemented: ID[]): ID;
        get(): C['metaplayer'];
    }>(endpoint);

    let provider: null | (<I extends ID>(contractId: I, remote: Remote<Contract[I]['metaplayer']>) =>
        Provider<Contract[I]['application']>
    ) = null;

    const tasks = [];

    let id: ID | null = null;
    let metaplayer: null | Remote<C['metaplayer']> = null;

    async function get(): Promise<C['application']> {
        if (provider == null) throw new Error('Application must be plugged before invoking metaplayer methods');
        id = await remoteHandle.hello(implemented) as ID;
        metaplayer = await remoteHandle.get() as Remote<C['metaplayer']>;

        return provider(id, metaplayer);
    }

    expose({
        ping(stop?: boolean) {
            console.log('Application pinged');
            if (!stop) remoteHandle.ping(true);
        },
        get(): C['application'] {
            if (provider == null) throw new Error('Application must be plugged before invoking metaplayer methods');
            const id = await remoteHandle.hello(implemented);
            const metaplayer = await remoteHandle.get();
            if (metaplayer != null) return metaplayer;
            metaplayerPromise = remoteHandle.get(id);
        }
    }, endpoint);


    const negociatedPromise = negotiate(implemented);
    return {
        ping() { return Promise.resolve() },
        get contractId() { return negociatedPromise as Promise<ID>; },
        plug(provider) { plugg(provider); },
        get metaplayer() { return getRemoteHandle(); },
    }
};

export default getSocket;

