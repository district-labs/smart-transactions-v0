# Setup Local Environment
forge script script/deploy/SafeDeploy.s.sol:SafeDeploy --fork-url http://localhost:8545 --broadcast
forge script script/deploy/CoreDeploy.s.sol:CoreDeploy --rpc-url http://localhost:8545 --broadcast

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

forge script script/intents/TokenRouterReleaseIntentDeploy.s.sol:TokenRouterReleaseIntentDeploy --fork-url http://localhost:8545 --broadcast 

forge script script/intents/TokenRouterReleaseIntentDeploy.s.sol:TokenRouterReleaseIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify
