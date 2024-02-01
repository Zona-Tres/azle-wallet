import { Opt, Principal, ic } from "azle";
import { Ledger, hexAddressFromPrincipal } from "azle/canisters/ledger";

export class IcpLedger {
    private ledger: typeof Ledger;

    constructor(private readonly canisterId: Principal) {
        this.ledger = Ledger(this.canisterId);
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

export class IcpMinter {
    public getAddress(owner: Principal, subaccount: number): string {
        const address = hexAddressFromPrincipal(owner, subaccount);

        return address;
    }
}
