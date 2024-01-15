#!/bin/bash

get_canister_id() {
  # TODO: local denends if NETWORK is local o maninnet
  local json_path=$PWD/.dfx/local/canister_ids.json
  local key=$1

  # Verifica si el archivo JSON existe
  if [ ! -f "$json_path" ]; then
    echo "El archivo JSON no existe: $json_path"
    exit 1
  fi

  # Lee el contenido del archivo JSON
  local json_content
  json_content=$(cat "$json_path")

  # Extrae el valor de la clave utilizando grep y awk
  local result
  result=$(echo "$json_content" | grep "\"$key\"" -A 2 | sed -n 's/.*"local": "\(.*\)".*/\1/p')

  # Imprime el resultado
  echo "$result"
}

# TODO: Regtest is only for local development
export CKBTC_LEDGER_CANISTER_ID=$(get_canister_id ckbtc-ledger)
export CKBTC_MINTER_CANISTER_ID=$(get_canister_id ckbtc-minter)
export CKBTC_KYT_CANISTER_ID=$(get_canister_id ckbtc-kyt)

CKBTC_SCRIPTS_DIR=$PWD/scripts/ckbtc

sh $CKBTC_SCRIPTS_DIR/ckbtc-kyt.sh
sh $CKBTC_SCRIPTS_DIR/ckbtc-ledger.sh
sh $CKBTC_SCRIPTS_DIR/ckbtc-minter.sh
