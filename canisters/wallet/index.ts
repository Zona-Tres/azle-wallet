import { blob, Canister, Err, ic, None, Ok, Principal, query, Record, Result, Some, StableBTreeMap, text, update, Void } from 'azle';
import { managementCanister, Satoshi } from 'azle/canisters/management';

// import { ICRC } from 'azle/canisters/icrc';
import { Minter } from '../ckbtc-minter';

// let ckBTC: typeof ICRC = ICRC(
//     Principal.fromText("g4xu7-jiaaa-aaaan-aaaaq-cai")
// );

let minter: typeof Minter = Minter(
    Principal.fromText("be2us-64aaa-aaaaa-qaabq-cai")
);

const Wallet = Record({
    owner: Principal,
    btcAddress: text,
});

type Wallet = typeof Wallet.tsType;

const wallets = StableBTreeMap<Principal, Wallet>(0);

const GetWalletBitcoinResponse = Record({
    address: text,
    balance: Satoshi,
});

const GetWalletResponse = Record({
    btc: GetWalletBitcoinResponse
});

const GetWalletErrors = Record({
    WalletNotFound: Principal
});

const GetWalletResult = Result(GetWalletResponse, GetWalletErrors);

const BITCOIN_API_CYCLE_COST = 100_000_000n;

export default Canister({
    create: update([], text, async () => {
        const owner = ic.caller();
        try {
            const btcAddress = await ic.call(minter.get_btc_address, {
                args: [
                    {
                        owner: Some(ic.id()),
                        subaccount: Some(
                            padPrincipalWithZeros(owner.toUint8Array())
                        )
                    }
                ]
            });

            const wallet: Wallet = {
                owner,
                btcAddress
            }

            wallets.insert(owner, wallet);

            return wallet.btcAddress;
        } catch (error) {
            throw error;
        }
    }),
    get: query([], GetWalletResult, async () => {
        const owner = ic.caller();
        const wallet = wallets.get(owner).Some;

        if (!wallet) {
            return Err({ WalletNotFound: owner });
        }

        const satoshi = await ic.call(managementCanister.bitcoin_get_balance, {
            args: [
                {
                    address: wallet.btcAddress,
                    min_confirmations: None,
                    network: { Regtest: null }
                }
            ],
            cycles: BITCOIN_API_CYCLE_COST
        });

        const response = {
            btc: {
                address: wallet.btcAddress,
                balance: satoshi
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
