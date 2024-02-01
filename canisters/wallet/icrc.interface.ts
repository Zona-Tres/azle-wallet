import { Opt, Principal } from "azle";

export interface LedgerIterface {
    getBalance: (owner: Principal, subaccount: Opt<Uint8Array>) => Promise<bigint>;
}

export interface MinterInterface {
    getAddress: (owner: Opt<Principal>, subaccount: Opt<Uint8Array>) => Promise<string>;
}
