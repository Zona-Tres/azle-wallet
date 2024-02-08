#!/bin/bash

SCRIPTS_DIR=$PWD/scripts

CURRENT_IDENTITY_NAME=$(dfx identity whoami)

dfx identity new minter
dfx identity use minter
export ICP_MINTER_ACCOUNT_ID=$(dfx ledger account-id)

dfx identity use $CURRENT_IDENTITY_NAME

export ICP_DEFAULT_ACCOUNT_ID=$(dfx ledger account-id --of-principal "2vxsx-fae")

ICP_SCRIPTS_DIR=$SCRIPTS_DIR/icp

sh $ICP_SCRIPTS_DIR/icp-ledger.sh
