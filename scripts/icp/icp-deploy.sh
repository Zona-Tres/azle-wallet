#!/bin/bash

SCRIPTS_DIR=$PWD/scripts

dfx identity new minter
dfx identity use minter
export ICP_MINTER_ACCOUNT_ID=$(dfx ledger account-id)

export ICP_DEFAULT_ACCOUNT_ID=$(dfx ledger account-id --of-principal "2vxsx-fae")

ICP_SCRIPTS_DIR=$SCRIPTS_DIR/icp

sh $ICP_SCRIPTS_DIR/icp-ledger.sh
