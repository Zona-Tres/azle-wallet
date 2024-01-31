#!/bin/bash

SCRIPTS_DIR=$PWD/scripts

source $SCRIPTS_DIR/utils/ic.sh

export ICP_LEDGER_CANISTER_ID=$(get_canister_id icp-ledger)

dfx identity new minter
dfx identity use minter
export ICP_MINTER_ACCOUNT_ID=$(dfx ledger account-id)

dfx identity use default
export ICP_DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)

CKBTC_SCRIPTS_DIR=$SCRIPTS_DIR/icp

echo $ICP_LEDGER_CANISTER_ID
echo $ICP_MINTER_ACCOUNT_ID
echo $ICP_DEFAULT_ACCOUNT_ID

sh $CKBTC_SCRIPTS_DIR/icp-ledger.sh
