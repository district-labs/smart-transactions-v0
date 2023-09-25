# E2E Testing
forge script script/e2e/TestnetDeploy.s.sol:TestnetDeploy --rpc-url http://localhost:8545 --broadcast
forge script script/e2e/SmartWalletSetup.s.sol:SmartWalletSetup --rpc-url http://localhost:8545 --broadcast
forge script script/e2e/SaveIntent.s.sol:SaveIntent --rpc-url http://localhost:8545 --broadcast --ffi

forge script script/e2e/ExecuteIntent.s.sol:ExecuteIntent --rpc-url http://localhost:8545 --broadcast

# Deploying

forge script script/WalletFactoryDeploy.s.sol:WalletFactoryDeploy --fork-url http://localhost:8545 --broadcast forge script
script/WalletFactoryDeploy.s.sol:WalletFactoryDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify

forge script script/IntentifySafeModuleDeploy.s.sol:IntentifySafeModuleDeploy --fork-url http://localhost:8545 --broadcast forge script
script/IntentifySafeModuleDeploy.s.sol:IntentifySafeModuleDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify -vvvv

forge script script/intents/TwapIntentDeploy.s.sol:TwapIntentDeploy --fork-url http://localhost:8545 --broadcast forge script
script/intents/TwapIntentDeploy.s.sol:TwapIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify

forge script script/intents/LimitOrderIntentDeploy.s.sol:LimitOrderIntentDeploy --fork-url http://localhost:8545 --broadcast forge script
script/intents/LimitOrderIntentDeploy.s.sol:LimitOrderIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify

forge script script/intents/TimestampBeforeIntentDeploy.s.sol:TimestampBeforeIntentDeploy --fork-url http://localhost:8545 --broadcast forge script
script/intents/TimestampBeforeIntentDeploy.s.sol:TimestampBeforeIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify

forge script script/intents/TokenRouterReleaseIntentDeploy.s.sol:TokenRouterReleaseIntentDeploy --fork-url http://localhost:8545 --broadcast forge script
script/intents/TokenRouterReleaseIntentDeploy.s.sol:TokenRouterReleaseIntentDeploy --rpc-url $GOERLI_RPC_URL --broadcast --verify
