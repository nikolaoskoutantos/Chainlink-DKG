# Enrolling an Operator Contract with Your Chainlink Node

This guide provides step-by-step instructions to connect and register an Operator contract with your Chainlink Node. This process is crucial for enabling your Chainlink node to fulfill oracle requests on the blockchain and it is based on the official [documentation.](https://docs.chain.link/chainlink-nodes/v1/fulfilling-requests)

---

## Prerequisites

Before starting, ensure you have the following:

- A deployed [**Operator contract REMIX IDE**](https://remix.ethereum.org/#url=https://docs.chain.link/samples/ChainlinkNodes/Operator.sol&autoCompile=true) on your target blockchain network.
- Access to a running **Chainlink Node**.
- The **Node URL** and credentials for accessing the Chainlink Node UI or API.
- Wallet and funds for submitting on-chain transactions (e.g., ETH or other blockchain native tokens).
- The **Oracle Address** of your Chainlink Node (displayed in the Chainlink Node interface).

---

## Steps to Enroll the Operator Contract

### 1. Deploy or Obtain the Operator Contract

If you haven't already deployed an Operator contract, you can deploy one using the official Chainlink documentation or a verified example.

- **Address:** Take note of the deployed Operator contract address.
- **ABI:** Ensure you have the ABI of the Operator contract for interaction.

---

### 2. Add the Operator Contract to Your Chainlink Node

#### a. Log into the Chainlink Node
1. Access your Chainlink Node's UI (usually at `http://<NODE_IP>:6688`).
2. Enter your **login credentials**.

#### b. Authorize Your Node to Use the Operator Contract

To enable your Chainlink Node to fulfill requests from the Operator contract, you must authorize the node by adding its Oracle Address to the Operator contract's list of authorized senders.

1. Use a blockchain wallet or a development tool like **Remix**, **Hardhat**, or **ethers.js** to interact with the Operator contract.
2. Call the `setAuthorizedSenders` function of the Operator contract, passing in an array that includes your Chainlink Node's **Oracle Address**.
   - Example: `[<your_chainlink_node_oracle_address>]`
3. Confirm and broadcast the transaction.

This step ensures that your Chainlink Node is authorized to interact with the Operator contract and fulfill oracle requests.


---


## Additional Resources

### Base Sepolia Link Adress: `0xE4aB69C077896252FAFBD49EFD26B5D171A32410`