# Installation

In a terminal, run the following commands:

```
npm install
npm run btc:start
```

In another terminal run:

```
npm run icp:start
```

Open another terminal and run:

```
npm run icp:deploy
```

# How to mint ckBTC

```bash
npm run btc:mint --address=$ADDRESS
# Sometimes you have to wait a few seconds
dfx canister call wallet updateBalance
```

# Troubleshoting

## Running bitcoind on macOS

When running Bitcoin scripts on macOS, you may experience an error due to the fact that it is not a signed application. To fix this issue, you can run the following commands:

```bash
codesign -s - .bitcoin/bin/bitcoind
codesign -s - .bitcoin/bin/bitcoin-cli
```
