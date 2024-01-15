import { blob, Canister, ic, Opt, Principal, query, Record, Some, text, update, Void } from 'azle';

// import { ICRC } from 'azle/canisters/icrc';
import { Minter } from '../ckbtc-minter';

// let ckBTC: typeof ICRC = ICRC(
//     Principal.fromText("g4xu7-jiaaa-aaaan-aaaaq-cai")
// );

let minter: typeof Minter = Minter(
    Principal.fromText("be2us-64aaa-aaaaa-qaabq-cai")
);

export default Canister({
    getAddress: update([], text, async () => {
        return await ic.call(minter.get_btc_address, {
            args: [
                {
                    owner: Some(ic.id()),
                    subaccount: Some(
                        padPrincipalWithZeros(ic.caller().toUint8Array())
                    )
                }
            ]
        });
    })
});

function padPrincipalWithZeros(blob: blob): blob {
    let newUin8Array = new Uint8Array(32);
    newUin8Array.set(blob);
    return newUin8Array;
}
