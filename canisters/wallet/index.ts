import { blob, Canister, Err, ic, init, nat64, Ok, postUpgrade, Principal, query, Record, Result, Some, StableBTreeMap, text, update, Void } from 'azle';
import { ICRC } from 'azle/canisters/icrc';

import { Minter } from '../ckbtc-minter';

let ledger: typeof ICRC;

let minter: typeof Minter;

const Wallet = Record({
    owner: Principal,
    ckbtcAddress: text,
});

type Wallet = typeof Wallet.tsType;

const wallets = StableBTreeMap<Principal, Wallet>(0);

const GetWalletBitcoinResponse = Record({
    address: text,
    balance: nat64,
});

const GetWalletResponse = Record({
    ckbtc: GetWalletBitcoinResponse
});

const GetWalletErrors = Record({
    WalletNotFound: Principal
});

const GetWalletResult = Result(GetWalletResponse, GetWalletErrors);

export default Canister({
    init: init([], setupCanisters),
    postUpgrade: postUpgrade([], setupCanisters),
    create: update([], text, async () => {
        const user = ic.caller();

        try {
            const ckbtcAddress = await ic.call(minter.get_btc_address, {
                args: [
                    {
                        owner: Some(ic.id()),
                        subaccount: Some(
                            padPrincipalWithZeros(user.toUint8Array())
                        )
                    }
                ]
            });

            const wallet: Wallet = {
                owner: user,
                ckbtcAddress
            }

            wallets.insert(user, wallet);

            return wallet.ckbtcAddress;
        } catch (error) {
            throw error;
        }
    }),
    get: query([], GetWalletResult, async () => {
        const user = ic.caller();
        const wallet = wallets.get(user).Some;

        if (!wallet) {
            return Err({ WalletNotFound: user });
        }

        const btcBalance = await ic.call(ledger.icrc1_balance_of, {
            args: [
                {
                    owner: ic.id(),
                    subaccount: Some(
                        padPrincipalWithZeros(user.toUint8Array())
                    )
                }
            ]
        });

        const response = {
            ckbtc: {
                address: wallet.ckbtcAddress,
                balance: btcBalance
            }
        }

        return Ok(response);
    }),
    transfer: update([text, text], Void, async (from, to) => {
        // TODO: hacer que funcione
    }),
});

function padPrincipalWithZeros(blob: blob): blob {
    let newUin8Array = new Uint8Array(32);
    newUin8Array.set(blob);
    return newUin8Array;
}

function setupCanisters() {
    ledger = ICRC(
        Principal.fromText(
            process.env.CKBTC_LEDGER_CANISTER_ID ??
            ic.trap('process.env.CKBTC_LEDGER_CANISTER_ID is undefined')
        )
    );

    minter = Minter(
        Principal.fromText(
            process.env.CKBTC_MINTER_CANISTER_ID ??
            ic.trap('process.env.CKBTC_MINTER_CANISTER_ID is undefined')
        )
    );
}
