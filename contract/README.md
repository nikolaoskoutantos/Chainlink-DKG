# FetchWeatherHardcoded Contract

This smart contract, `FetchWeatherHardcoded`, fetches weather data using the Chainlink decentralized oracle network. It is configured with a specific Chainlink Job ID and Oracle Address to retrieve weather data from OpenWeatherAPI using hardcoded geolocation parameters.

## Features

- Requests weather data using a Chainlink oracle.
- Stores the fetched weather data as a string.
- Provides functionality to withdraw unused LINK tokens.
- Information about the balance of the contract.

## Key Components

1. **Chainlink Integration**: 
   - Uses the ChainlinkClient library to make oracle requests.
   - Configured with a specific `LINK address`, `Job ID` and `Oracle Address`.

2. **Functions**:
   - `requestWeatherData()`: Sends a request to fetch weather data.
   - `fulfill()`: Handles the oracle's response and stores the weather data.
   - `withdrawLink()`: Allows the contract owner to withdraw unused LINK tokens.
   - `getLinkBalance()`: Displays the contract's LINK token balance.

## Configuration

- **Chainlink Token Address**: Replace the token address with the LINK token address for your blockchain network.
- **Oracle Address**: Replace the oracle address with the one hosting the desired job.
- **Job ID**: Replace the hardcoded job ID with the appropriate job specification.

## Usage

1. **Deploy the Contract**:
   - Deploy this contract on a blockchain supported by Chainlink.

2. **Fund the Contract**:
   - Transfer LINK tokens to the contract to cover oracle fees.

3. **Request Weather Data**:
   - Call `requestWeatherData()` to trigger a Chainlink oracle request.

4. **Fetch the Response**:
   - The weather data will be available in the `weatherData` variable after the oracle responds.

5. **Withdraw LINK Tokens**:
   - Use `withdrawLink()` to retrieve any unused LINK tokens.

## Dependencies

- Chainlink Contracts
- LINK token on the target blockchain network

## Notes

- Ensure the Oracle Address and Job ID match the API and data path you want to query.
- Test the contract on a testnet before deploying on the mainnet.

---

For more information about Chainlink, visit [Chainlink Documentation](https://docs.chain.link/).
