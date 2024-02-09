import { None, Principal, Some, ic, nat, nat64, text } from "azle";
import { ICRC } from "azle/canisters/icrc";

import { Minter } from "../../tokens/ckbtc-minter";
import { LedgerIterface, MinterInterface } from "./icrc.interface";
import { padPrincipalWithZeros } from "./utils";

export class CkbtcLedger implements LedgerIterface {
    private ledger: typeof ICRC;

    constructor(private readonly canisterId: Principal) {
        this.ledger = ICRC(this.canisterId);
    }


    public async getBalance(subaccount: Principal): Promise<bigint> {
        const balance = await ic.call(this.ledger.icrc1_balance_of, {
            args: [
                {
                    owner: ic.id(),
                    subaccount: Some(
                        padPrincipalWithZeros(subaccount.toUint8Array())
                    )
                }
            ]
        });

        return balance;
    }

    public async transfer(
        from: Principal,
        to: Principal,
        amount: nat
    ) {
        const result = await ic.call(this.ledger.icrc1_transfer, {
            args: [
                {
                    from_subaccount: Some(
                        padPrincipalWithZeros(from.toUint8Array())
                    ),
                    to: {
                        owner: ic.id(),
                        subaccount: Some(
                            padPrincipalWithZeros(
                                to.toUint8Array()
                            )
                        )
                    },
                    amount,
                    fee: None,
                    memo: None,
                    created_at_time: None
                }
            ]
        });

        return result;
    }
}

export class CkbtcMinter implements MinterInterface {
    private minter: typeof Minter;

    constructor(private readonly canisterId: Principal) {
        this.minter = Minter(this.canisterId);
    }

    public async getAddress(subaccount: Principal): Promise<string> {
        const address = await ic.call(this.minter.get_btc_address, {
            args: [
                {
                    owner: ic.id(),
                    subaccount: Some(
                        padPrincipalWithZeros(subaccount.toUint8Array())
                    )
                }
            ]
        });

        return address;
    }

    public async updateBalance(subaccount: Principal) {
        const result = await ic.call(this.minter.update_balance, {
            args: [
                {
                    owner: ic.id(),
                    subaccount: Some(
                        padPrincipalWithZeros(subaccount.toUint8Array())
                    )
                }
            ]
        });

        return result;
    }

    public async toBtc(address: text, amount: nat64) {
        const result = await ic.call(this.minter.retrieve_btc, {
            args: [
                {
                    address,
                    amount
                }
            ]
        });

        return result;
    }

    public async toBtcStatus(blockIndex: nat64) {
        const result = await ic.call(this.minter.retrieve_btc_status, {
            args: [
                { block_index: blockIndex }
            ]
        });

        return result;
    }
}
