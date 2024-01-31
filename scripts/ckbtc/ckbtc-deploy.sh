#!/bin/bash

SCRIPTS_DIR=$PWD/scripts

source $SCRIPTS_DIR/utils/ic.sh

export CKBTC_DEFAULT_PRINCIPAL="2vxsx-fae"

# TODO: Regtest is only for local development
export CKBTC_LEDGER_CANISTER_ID=$(get_canister_id ckbtc-ledger)
export CKBTC_MINTER_CANISTER_ID=$(get_canister_id ckbtc-minter)
export CKBTC_KYT_CANISTER_ID=$(get_canister_id ckbtc-kyt)

CKBTC_SCRIPTS_DIR=$SCRIPTS_DIR/ckbtc

sh $CKBTC_SCRIPTS_DIR/ckbtc-kyt.sh
sh $CKBTC_SCRIPTS_DIR/ckbtc-ledger.sh
sh $CKBTC_SCRIPTS_DIR/ckbtc-minter.sh
