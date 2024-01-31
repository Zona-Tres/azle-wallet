import { blob, Canister, Err, ic, init, nat64, None, Ok, postUpgrade, Principal, query, Record, Result, Some, StableBTreeMap, text, update, Vec, Void } from 'azle';
import { ICRC } from 'azle/canisters/icrc';
import { Ledger, hexAddressFromPrincipal } from 'azle/canisters/ledger';

import { Minter } from '../ckbtc-minter';

let ckbtcLedger: typeof ICRC;
let ckbtcMinter: typeof Minter;

let icpLedger: typeof Ledger;

const Wallet = Record({
    owner: Principal,
    ckbtcAddress: text,
    icpAddress: text
});

type Wallet = typeof Wallet.tsType;

const wallets = StableBTreeMap<Principal, Wallet>(0);

const GetWalletCkBtcResponse = Record({
    address: text,
    balance: nat64,
});

const GetWalletIcpResponse = Record({
    address: text,
    balance: nat64,
});

const GetWalletResponse = Record({
    ckbtc: GetWalletCkBtcResponse,
    icp: GetWalletIcpResponse
});

const GetWalletErrors = Record({
    WalletNotFound: Principal
});

const GetWalletResult = Result(GetWalletResponse, GetWalletErrors);

export default Canister({
    init: init([], setupCanisters),
    postUpgrade: postUpgrade([], setupCanisters),
    create: update([], Vec(text), async () => {
        const user = ic.caller();

        try {
            const ckbtcAddress = await ic.call(ckbtcMinter.get_btc_address, {
                args: [
                    {
                        owner: Some(user),
                        subaccount: None
                    }
                ]
            });

            const icpAddress = hexAddressFromPrincipal(ic.caller(), 0);

            const wallet: Wallet = {
                owner: user,
                ckbtcAddress,
                icpAddress
            }

            wallets.insert(user, wallet);

            return [wallet.ckbtcAddress, wallet.icpAddress];
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

        const btcBalance = await ic.call(ckbtcLedger.icrc1_balance_of, {
            args: [
                {
                    owner: user,
                    subaccount: None
                }
            ]
        });

        const icpBalance = await ic.call(icpLedger.icrc1_balance_of, {
            args: [
                {
                    owner: user,
                    subaccount: None
                }
            ]
        });

        const response = {
            ckbtc: {
                address: wallet.ckbtcAddress,
                balance: btcBalance
            },
            icp: {
                address: wallet.icpAddress,
                balance: icpBalance
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
    ckbtcLedger = ICRC(
        Principal.fromText(
            process.env.CKBTC_LEDGER_CANISTER_ID ??
            ic.trap('process.env.CKBTC_LEDGER_CANISTER_ID is undefined')
        )
    );

    ckbtcMinter = Minter(
        Principal.fromText(
            process.env.CKBTC_MINTER_CANISTER_ID ??
            ic.trap('process.env.CKBTC_MINTER_CANISTER_ID is undefined')
        )
    );

    icpLedger = Ledger(
        Principal.fromText(
            process.env.ICP_LEDGER_CANISTER_ID ??
            ic.trap('process.env.ICP_LEDGER_CANISTER_ID is undefined')
        )
    );
}
