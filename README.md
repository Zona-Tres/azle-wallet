# Installation

In a terminal run:

```
npm install
npm run btc:start
```

In another terminal run:

```
npm run icp:start
npm run icp:canister:create
npm run icp:deploy
```

# Troubleshoting

## Running bitcoind on macOS

When running Bitcoind on macOS, you may experience an error due to the fact that it is not a signed application. To fix this issue, you can run the following command:

```bash
codesign -s - .bitcoin/bin/bitcoind
```
