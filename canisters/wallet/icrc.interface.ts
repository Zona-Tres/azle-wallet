import { Principal } from "azle";

export interface LedgerIterface {
    getBalance: (subaccount: Principal) => Promise<number>;
}

export interface MinterInterface {
    getAddress: (subaccount: Principal) => Promise<string>;
}
