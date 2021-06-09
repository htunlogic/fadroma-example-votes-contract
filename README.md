# Example for using Fadroma and Felony

[Fadroma](https://github.com/hackbg/fadroma)

This is a simple example how to make a contract using the Fadroma framework (the latest version on Github).
Also, presented are unit tests testing the functionality of the contract using the out-of-the-box `cosmwasm_std` test api.

Node commands that will enable you to easily interact with the contract are build with Felony framework.

[Felony](https://github.com/barrage/felony)

# Usage

## Install

_Note: We will assume you already have the Rust installed and ready to use on your system. Also, we assume you have latest Nodejs installed._

Firstly, you'll have to install node dependencies with `npm install`.

Open new terminal window and start up the local chain in docker image:

```
docker run -it --rm \
 -p 26657:26657 -p 26656:26656 -p 1337:1337 -v $(pwd):/root/code \
 --name secretdev enigmampc/secret-network-sw-dev
```

Once the image starts, it will print out a set of keys similar to ones presented in `accounts.example.json`, you should copy those into new `accounts.json` file and make sure it is a valid json file!

## Build

Then you'll have to build the wasm binary with `cargo wasm`.

Then you'll have to optimize the built binary to be uploaded to your local testnet:

```
docker run --rm -v "$(pwd)":/contract \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  enigmampc/secret-contract-optimizer
```

By default, located in the `config/` directory are configurations so you can use the testnet blockchain without a need
for `.env` file. But if you wish to change the default settings, there is a `.env.example` provided, use it to create your `.env` file and override the settings.

MNEMONIC and ADDRESS will be automatically collected from your `accounts.json` if you don't provide them in your `.env`.

## Usage

There are some Felony commands prepared for you to use:

Commands are used by calling them through `node index.js`:

```
node index.js command=<COMMAND-SIGNATURE> [ARGUMENTS, ..]

```

### Command: get-mnemonic

This command is called from almost all the other commands and you'll probably not need to call it directly, but its usage is:

```
node index.js command=get-mnemonic account=<account name in accounts.json>

#or

node index.js command=get-mnemonic mnemonic='you mnemonic you wish to use'

#or

Node index.js command=get-mnemonic # this will use the default main mnemonic from .env if set
```

**Same set of arguments applies to all the other commands, so we won't repeat them.**

### Command: get-client

This command will return the client for interacting with the contract, you probably will never need to run this command directly it is called from within the others.

```
node index.js command=get-client
```

### Command: deploy

This command will deploy the contract to the chain

```
node index.js command=deploy options=option1,option2,...
```

### Command: get-status

This command will return the status of deployed contract

```
node index.js command=get-status
```

### Command: vote

This command will return the status of deployed contract

```
node index.js command=vote option=XY
```

### Command: get-address

This command will return the deployed contract address

```
node index.js command=get-address
```
