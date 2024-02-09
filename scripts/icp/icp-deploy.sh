#!/bin/bash

SCRIPTS_DIR=$PWD/scripts

dfx identity new minter
dfx identity use minter
export ICP_MINTER_ACCOUNT_ID=$(dfx ledger account-id)

dfx identity use default
ICP_DEFAULT_PRINCIPAL=$(dfx identity get-principal)

export ICP_DEFAULT_ACCOUNT_ID=$(dfx ledger account-id --of-principal "$ICP_DEFAULT_PRINCIPAL")

ICP_SCRIPTS_DIR=$SCRIPTS_DIR/icp

sh $ICP_SCRIPTS_DIR/icp-ledger.sh
