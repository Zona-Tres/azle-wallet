import { ICRC } from "azle/canisters/icrc";
import { Minter } from "../ckbtc-minter";
import { Opt, Principal, ic } from "azle";
import { LedgerIterface, MinterInterface } from "./icrc.interface";

export class CkbtcLedger implements LedgerIterface {
    private ledger: typeof ICRC;

    constructor(private readonly canisterId: Principal) {
        this.ledger = ICRC(this.canisterId);
    }


    public async getBalance(owner: Principal, subaccount: Opt<Uint8Array>): Promise<bigint> {
        const balance = await ic.call(this.ledger.icrc1_balance_of, {
            args: [
                {
                    owner,
                    subaccount
                }
            ]
        });

        return balance;
    }
}

export class CkbtcMinter implements MinterInterface {
    private minter: typeof Minter;

    constructor(private readonly canisterId: Principal) {
        this.minter = Minter(this.canisterId);
    }

    public async getAddress(owner: Opt<Principal>, subaccount: Opt<Uint8Array>): Promise<string> {
        const address = await ic.call(this.minter.get_btc_address, {
            args: [
                {
                    owner,
                    subaccount
                }
            ]
        });

        return address;
    }
}
