import { blob, Canister, Err, ic, Ok, Principal, query, Record, Result, Some, StableBTreeMap, text, update, Void } from 'azle';

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

const GetWalletByOwnerErrors = Record({
    WalletNotFound: Principal
});

export default Canister({
    create: update([Principal], Void, async (owner) => {
        const btcAddress = await ic.call(minter.get_btc_address, {
            args: [
                {
                    owner: Some(ic.id()),
                    subaccount: Some(
                        padPrincipalWithZeros(ic.caller().toUint8Array())
                    )
                }
            ]
        });

        const wallet: Wallet = {
            owner,
            btcAddress
        }

        wallets.insert(owner, wallet);
    }),
    getByOwner: query([Principal], Result(Wallet, GetWalletByOwnerErrors), async (owner) => {
        const wallet = wallets.get(owner);

        if ('None' in wallet) {
            return Err({ WalletNotFound: owner });
        }

        return Ok(wallet.Some);
    }),
    transfer: update([Principal, Principal], Void, async (from, to) => {
        // TODO: hacer que funcione
    }),
});

function padPrincipalWithZeros(blob: blob): blob {
    let newUin8Array = new Uint8Array(32);
    newUin8Array.set(blob);
    return newUin8Array;
}
