#!/bin/bash
SCRIPTS_DIR=$PWD/scripts

. $SCRIPTS_DIR/utils/ic.sh

export CKBTC_LEDGER_CANISTER_ID=$(get_canister_id ckbtc-ledger)
export CKBTC_MINTER_CANISTER_ID=$(get_canister_id ckbtc-minter)
export ICP_LEDGER_CANISTER_ID=$(get_canister_id icp-ledger)

dfx generate wallet
dfx deploy wallet
