// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { IFlashLoanRecipient } from "balancer-v2-interfaces/vault/IFlashLoanRecipient.sol";
import { IVault, IERC20 } from "balancer-v2-interfaces/vault/IVault.sol";
import { Ownable } from "solady/auth/Ownable.sol";
import { RevertMessageReasonHelper } from "../helpers/RevertMessageReasonHelper.sol";

/// @title Multi Call With Flash Loan
/// @notice A contract that can be used to execute either multiple calls in a single flash loan.
contract MultiCallWithFlashLoan is Ownable, IFlashLoanRecipient, RevertMessageReasonHelper {
    /*//////////////////////////////////////////////////////////////////////////
                                TYPE DECLARATIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice A call parameters to be executed.
    struct Call {
        address target;
        uint256 value;
        bytes callData;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                    STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice The address of the Balancer V2 vault.
    address public immutable vault;

    /*//////////////////////////////////////////////////////////////////////////
                                    EVENTS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Call parameters of a multi call.
    event MultiCallAction(address indexed target, uint256 value, bytes data, bytes result);

    /*//////////////////////////////////////////////////////////////////////////
                                    ERRORS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Only the vault can call this function.
    error OnlyVault();

    /// @dev One of the calls in the multi call array failed with no revert message.
    error MultiCallCallFailed();

    /// @dev The multi call array is empty.
    error MultiCallEmptyCalls();

    /// @dev The token array length does not match the amounts array length.
    error ReceiveFlashLoanWrongTokenArrayLength();

    /*//////////////////////////////////////////////////////////////////////////
                                    MODIFIERS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Only the vault can call this function.
    modifier onlyVault() {
        if (msg.sender != vault) revert OnlyVault();
        _;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Construct a new Balancer V2 Flash Loan Helper.
    /// @param _owner The owner of the contract.
    /// @param _vault The address of the Balancer V2 vault.
    constructor(address _owner, address _vault) {
        _initializeOwner(_owner);
        vault = _vault;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Execute a flash loan from the Balancer V2 vault.
    /// @dev This function must be called by the owner of the contract.
    /// @param tokens The tokens to borrow.
    /// @param amounts The amounts to borrow.
    /// @param userData The encoded multi call array.
    function flashLoan(IERC20[] memory tokens, uint256[] memory amounts, bytes memory userData) external onlyOwner {
        IVault(vault).flashLoan(IFlashLoanRecipient(address(this)), tokens, amounts, userData);
    }

    /// @notice Execute multiple calls in a single transaction.
    /// @dev This function must be called by the owner of the contract.
    /// @param calls The calls to execute.
    /// @return results The results of the calls.
    function multiCall(Call[] memory calls) external onlyOwner returns (bytes[] memory results) {
        results = _multiCall(calls);
    }

    /// @notice Flash loan callback from the Balancer V2 vault.
    /// @dev This function must be called by the Balancer V2 vault. It receives a multi call array encoded as bytes that
    /// will be used to execute the calls after the flash loan is received.
    /// @param tokens The tokens that were borrowed.
    /// @param amounts The amounts that were borrowed.
    /// @param feeAmounts The fee amounts that were borrowed.
    /// @param multiCallData The encoded multi call array.
    function receiveFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes calldata multiCallData
    )
        external
        override
        onlyVault
    {
        if (tokens.length != amounts.length) revert ReceiveFlashLoanWrongTokenArrayLength();
        for (uint256 i = 0; i < tokens.length; ++i) {
            IERC20 token = tokens[i];
            uint256 amount = amounts[i];
            uint256 feeAmount = feeAmounts[i];

            // Multi call
            Call[] memory calls = abi.decode(multiCallData, (Call[]));
            _multiCall(calls);

            // Return loan
            token.transfer(vault, amount + feeAmount);
        }
    }

    /*//////////////////////////////////////////////////////////////////////////
                                INTERNAL WRITE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Execute multiple calls in a single transaction.
    /// @param calls The calls to execute.
    /// @return results The results of the calls.
    function _multiCall(Call[] memory calls) internal returns (bytes[] memory results) {
        if (calls.length == 0) revert MultiCallEmptyCalls();

        results = new bytes[](calls.length);
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory result) = calls[i].target.call{ value: calls[i].value }(calls[i].callData);
            if (!success) {
                if (result.length > 0) {
                    _revertMessageReason(result);
                } else {
                    revert MultiCallCallFailed();
                }
            }
            results[i] = result;

            emit MultiCallAction(calls[i].target, calls[i].value, calls[i].callData, result);
        }
    }

    /*//////////////////////////////////////////////////////////////////////////
                                    FALLBACKS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Fallback function to receive ETH.
    receive() external payable { }
}
