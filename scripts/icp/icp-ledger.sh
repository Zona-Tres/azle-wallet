#!bin/bash

TRANSFER_FEE=0
PRE_MINTED_TOKENS=10_000_000_000

argument=$(cat <<CANDID
(variant {
    Init = record {
        minting_account = "$ICP_MINTER_ACCOUNT_ID";
        transfer_fee = opt record {
          e8s = $TRANSFER_FEE : nat64;
        };
        token_symbol = opt "LICP";
        token_name = opt "Local ICP";
        initial_values = vec {
            record {
                "$ICP_DEFAULT_ACCOUNT_ID";
                record {
                    e8s = $PRE_MINTED_TOKENS : nat64;
                };
            };
        };
        send_whitelist = vec {};
    }
})
CANDID
)

dfx deploy icp-ledger --argument "$argument"
