#!/bin/bash

SCRIPTS_DIR=$PWD/scripts

dfx identity new minter
dfx identity use minter
export ICP_MINTER_ACCOUNT_ID=$(dfx ledger account-id)

export ICP_DEFAULT_ACCOUNT_ID="1c7a48ba6a562aa9eaa2481a9049cdf0433b9738c992d698c31d8abf89cadc79"

ICP_SCRIPTS_DIR=$SCRIPTS_DIR/icp

sh $ICP_SCRIPTS_DIR/icp-ledger.sh
