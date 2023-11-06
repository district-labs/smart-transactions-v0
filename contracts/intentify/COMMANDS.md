# Local Setup
forge script script/deploy/SafeDeploy.s.sol:SafeDeploy --rpc-url http://localhost:8545 --broadcast
forge script script/deploy/testnet/CoreDeploy.s.sol:CoreDeploy 0x000000000000000000000000000000000000dEaD 0x000000000000000000000000000000000000dEaD 0x000000000000000000000000000000000000dEaD 0x000000000000000000000000000000000000dEaD 0x000000000000000000000000000000000000dEaD--sig "run(address,address)" --rpc-url http://localhost:8545 --broadcast
forge script script/deploy/testnet/PeripheryDeploy.s.sol:PeripheryDeploy --rpc-url http://localhost:8545 --broadcast

# Testnet Setup
forge script script/deploy/testnet/PeripheryDeploy.s.sol:PeripheryDeploy 0x8018fe32fCFd3d166E8b4c4E37105318A84BA11b --sig "run(address)" --rpc-url $GOERLI_RPC_URL --broadcast

forge script script/deploy/testnet/GoerliCoreDeploy.s.sol:GoerliCoreDeploy 0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761 0x3316EEA891fFdE66773E0937F48658677f342e2A --sig "run(address,address)" --rpc-url $GOERLI_RPC_URL --broadcast


# E2E Testing
forge script script/e2e/TestnetDeploy.s.sol:TestnetDeploy --rpc-url http://localhost:8545 --broadcast
forge script script/e2e/SmartWalletSetup.s.sol:SmartWalletSetup --rpc-url http://localhost:8545 --broadcast
forge script script/e2e/SaveIntent.s.sol:SaveIntent --rpc-url http://localhost:8545 --broadcast --ffi

forge script script/e2e/ExecuteIntent.s.sol:ExecuteIntent --rpc-url http://localhost:8545 --broadcast

# Deploying
forge script script/deploy/SafeDeploy.s.sol:SafeDeploy --fork-url http://localhost:8545 --broadcast

forge script script/deploy/WalletFactoryDeploy.s.sol:WalletFactoryDeploy --fork-url http://localhost:8545 --broadcast
forge script script/deploy/WalletFactoryDeploy.s.sol:WalletFactoryDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify

forge script script/deploy/UniswapV3PoolDeploy.s.sol:UniswapV3PoolDeploy --fork-url http://localhost:8545 --broadcast 
forge script script/deploy/UniswapV3PoolDeploy.s.sol:UniswapV3PoolDeploy --rpc-url $GOERLI_RPC_URL --broadcast -vvv

forge script script/IntentifySafeModuleDeploy.s.sol:IntentifySafeModuleDeploy --fork-url http://localhost:8545 --broadcast 
forge script script/deploy/IntentifySafeModuleDeploy.s.sol:IntentifySafeModuleDeploy --rpc-url $GOERLI_RPC_URL --broadcast -vvv

forge script script/intents/TwapIntentDeploy.s.sol:TwapIntentDeploy --fork-url http://localhost:8545 --broadcast 
forge script script/intents/TwapIntentDeploy.s.sol:TwapIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify

forge script script/intents/LimitOrderIntentDeploy.s.sol:LimitOrderIntentDeploy --fork-url http://localhost:8545 --broadcast 
forge script script/intents/LimitOrderIntentDeploy.s.sol:LimitOrderIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify

forge script script/intents/TimestampIntentDeploy.s.sol:TimestampIntentDeploy --fork-url http://localhost:8545 --broadcast forge script script/intents/TimestampIntentDeploy.s.sol:TimestampIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify
