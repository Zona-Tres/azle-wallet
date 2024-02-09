import {
    bool,
    Canister,
    Err,
    ic,
    init,
    nat,
    nat64,
    Ok,
    postUpgrade,
    Principal,
    query,
    Record,
    Result,
    StableBTreeMap,
    text,
    update,
    Vec,
    Void
} from 'azle';

import { CkbtcLedger, CkbtcMinter } from './ckbtc';
import { IcpLedger, IcpMinter } from './icp';

let ckbtcLedger: CkbtcLedger;
let ckbtcMinter: CkbtcMinter;
let icpLedger: IcpLedger;
let icpMinter: IcpMinter;

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
            const ckbtcAddress = await ckbtcMinter.getAddress(user);

            const icpAddress = icpMinter.getAddress(user, 0);

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

        const btcBalance = await ckbtcLedger.getBalance(user);
        const icpBalance = await icpLedger.getBalance(user);

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
    transferCkbtc: update([Principal, nat], bool, async (to, amount) => {
        try {
            await ckbtcLedger.transfer(ic.caller(), to, amount);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }),
    updateBalance: update([], Void, async () => {
        await ckbtcMinter.updateBalance(ic.caller());
    })
});

function setupCanisters(): void {
    const CKBTC_LEDGER_CANISTER_ID = Principal.fromText(
        process.env.CKBTC_LEDGER_CANISTER_ID ??
        ic.trap('process.env.CKBTC_LEDGER_CANISTER_ID is undefined')
    );

    const CKBTC_MINTER_CANISTER_ID = Principal.fromText(
        process.env.CKBTC_MINTER_CANISTER_ID ??
        ic.trap('process.env.CKBTC_MINTER_CANISTER_ID is undefined')
    );

    const ICP_LEDGER_CANISTER_ID = Principal.fromText(
        process.env.ICP_LEDGER_CANISTER_ID ??
        ic.trap('process.env.ICP_LEDGER_CANISTER_ID is undefined')
    )

    ckbtcLedger = new CkbtcLedger(CKBTC_LEDGER_CANISTER_ID);
    ckbtcMinter = new CkbtcMinter(CKBTC_MINTER_CANISTER_ID);
    icpLedger = new IcpLedger(ICP_LEDGER_CANISTER_ID);
    icpMinter = new IcpMinter();
}
