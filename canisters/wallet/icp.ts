import { None, Opt, Principal, Some, ic, nat } from "azle";
import { Address, Ledger, binaryAddressFromAddress, hexAddressFromPrincipal } from "azle/canisters/ledger";
import { padPrincipalWithZeros } from "./utils";

export class IcpLedger {
    private ledger: typeof Ledger;

    constructor(private readonly canisterId: Principal) {
        this.ledger = Ledger(this.canisterId);
    }


    public async getBalance(subaccount: Principal): Promise<bigint> {
        const balance = await ic.call(this.ledger.icrc1_balance_of, {
            args: [
                {
                    owner: ic.id(),
                    subaccount: Some(padPrincipalWithZeros(subaccount.toUint8Array()))
                }
            ]
        });

        return balance;
    }

    public async transfer(from: Principal, to: Address, amount: nat, memo: Opt<Uint8Array>) {
        const fee = 0n;
        await ic.call(this.ledger.transfer, {
            args: [
                {
                    memo: 0n,
                    amount: {
                        e8s: amount
                    },
                    fee: {
                        e8s: fee
                    },
                    from_subaccount: Some(padPrincipalWithZeros(from.toUint8Array())),
                    to: binaryAddressFromAddress(to),
                    created_at_time: None
                }
            ]
        });
    }
}

export class IcpMinter {
    public getAddress(owner: Principal, subaccount: number): string {
        const address = hexAddressFromPrincipal(owner, subaccount);

        return address;
    }
}
