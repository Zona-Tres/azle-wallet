import { Opt, Principal } from "azle";

export interface LedgerIterface {
    getBalance: (subaccount: Principal) => Promise<bigint>;
}

export interface MinterInterface {
    getAddress: (subaccount: Principal) => Promise<string>;
}
