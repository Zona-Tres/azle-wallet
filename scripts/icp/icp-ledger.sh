#!bin/bash

argument=$(cat <<CANDID
(variant {
    Init = record {
        minting_account = "$ICP_MINTER_ACCOUNT_ID";
        transfer_fee = opt record {
          e8s = 10_000 : nat64;
        };
        token_symbol = opt "LICP";
        token_name = opt "Local ICP";
        initial_values = vec {
            record {
                "$ICP_DEFAULT_ACCOUNT_ID";
                record {
                    e8s = 10_000_000_000 : nat64;
                };
            };
        };
        send_whitelist = vec {};
    }
})
CANDID
)

dfx deploy icp-ledger --argument "$argument"
