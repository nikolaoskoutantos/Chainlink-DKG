// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Chainlink, ChainlinkClient} from "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

contract FetchWeatherHardcoded is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    string public weatherData; 
    bytes32 private jobId;
    uint256 private fee;

    event RequestWeatherData(bytes32 indexed requestId, string data);

    constructor() ConfirmedOwner(msg.sender) {
        _setChainlinkToken(<TOKEN_ADDRESS>); 
        _setChainlinkOracle(<OPERATOR_ID>); 
        jobId = "JOB_ID";
        
    }

    /**
     * @notice Request weather data using the hardcoded API in the job spec.
     */
    function requestWeatherData() public returns (bytes32 requestId) {
        Chainlink.Request memory req = _buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        
        req._add("path", "");
        return _sendChainlinkRequest(req, fee);
    }

    /**
     * @notice Fulfill the Chainlink request with the fetched data.
     * @param _requestId The request ID.
     * @param _data The full response as a string.
     */
    function fulfill(bytes32 _requestId, string memory _data) public recordChainlinkFulfillment(_requestId) {
        emit RequestWeatherData(_requestId, _data);
        weatherData = _data;
    }

    /**
     * @notice Allow withdrawal of LINK tokens from the contract.
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    /**
     * @notice Returns the LINK token balance of the contract.
     * @return The LINK token balance of the contract.
     */
    function getLinkBalance() public view returns (uint256) {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        return link.balanceOf(address(this));
    }
}
