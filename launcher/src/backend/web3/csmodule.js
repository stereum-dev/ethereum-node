const fs = require('fs');
const Web3 = require('web3').default;

// Check if promiseIpc is globally available in the window scope
let promiseIpc;
if (typeof window !== "undefined" && window.promiseIpc) {
  promiseIpc = window.promiseIpc;
} else {
  console.error("promiseIpc is not available globally. Ensure it is imported correctly.");
}

let csm_abi;
try {
  csm_abi = JSON.parse(fs.readFileSync('CSModuleABI.json', 'utf8'));
  console.log("Loaded csm_abi successfully");
} catch (error) {
  console.error('Error loading the contract ABI:', error);
}

const w3 = new Web3('http://127.0.0.1:8545');
let csm_contract_address;

async function isConnected() {
  try {
    await w3.eth.getBlockNumber();
    return true; // Connection successful
  } catch (error) {
    console.error('Error connecting to Ethereum network:', error);
    return false; // Connection failed
  }
}

async function getChainId() {
  try {
    return await w3.eth.getChainId();
  } catch (error) {
    console.error('Error retrieving chain ID:', error);
    return null;
  }
}

async function getContractAddress() {
  if (await isConnected()) {
    const chainId = await getChainId();
    if (chainId !== null) {
      switch (Number(chainId)) {
        case 1:
          console.log("Connected to Mainnet. ID =", chainId.toString());
          return "0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F";

        case 17000:
          console.log("Connected to Holesky. ID =", chainId.toString());
          return "0x4562c3e63c2e586cD1651B958C22F88135aCAd4f";

        default:
          console.log("Connected to unsupported network. ID =", chainId.toString());
          return null;
      }
    }
  }
  return null;
}

async function getSyncStatus() {
  try {
    const syncStatus = await w3.eth.isSyncing();
    if (syncStatus === false) {
    	console.log("Node is in sync ... ");
      return true; // Node is in sync
    } else {
    	console.log("Node is currently syncing ... ");
      return false; // Node is syncing
    }
  } catch (error) {
    console.error('Error checking sync status:', error);
    return null;
  }
}

async function getContract() {
  try {
    const contractAddress = await getContractAddress();
    if (!csm_abi || !contractAddress) {
      throw new Error('Missing ABI or contract address.');
    }
    return new w3.eth.Contract(csm_abi, contractAddress);
  } catch (error) {
    console.error('Error initializing contract:', error);
    return null;
  }
}

async function isNodeOperatorActive(contract, nodeOperatorId) {
  try {
    if (!contract) {
      throw new Error('Contract is not initialized.');
    }
    const isActive = await contract.methods.getNodeOperatorIsActive(nodeOperatorId).call();
    console.log("Node Operator is active:", isActive);
    return isActive;
  } catch (error) {
    console.error('Error calling getNodeOperatorIsActive:', error);
    return null;
  }
}

async function getNodeOperatorInfo(contract, nodeOperatorId) {
  try {
    if (!contract) {
      throw new Error('Contract is not initialized.');
    }

    const nodeOperator = await contract.methods.getNodeOperator(nodeOperatorId).call();
    const enqueuedCount = nodeOperator.enqueuedCount;

    //console.log("Enqueued Count:", enqueuedCount);
    return enqueuedCount;
  } catch (error) {
    console.error('Error calling getNodeOperator:', error);
    return null;
  }
}

async function getNoneWithdrawnKeys(contract, nodeOperatorId) {
	try {
		if(!contract) {
			throw new Error('Contract is not initialized.');
			}
	const noneWithdrawnKeys = await contract.methods.getNodeOperatorNonWithdrawnKeys(nodeOperatorId).call();
	return noneWithdrawnKeys;
	} catch (error) {
		console.error('Error calling getNodeOperatorNonWithdrawnKeys: ', error);
		return null;
		}
}

async function getSigningKeys(contract, nodeOperatorId, startIndex, keysCount) {
  try {
    if (!contract) {
      throw new Error('Contract is not initialized.');
    }

    // Call getSigningKeys on the contract
    const signingKeys = await contract.methods.getSigningKeys(nodeOperatorId, startIndex, keysCount).call();

    // Convert to hex and split into an array of 48-byte keys
    const signingKeysHex = signingKeys.startsWith("0x") ? signingKeys.slice(2) : signingKeys; // Remove "0x" if present
    const KEY_LENGTH = 48 * 2; // 48 bytes, 96 hex characters

    const keysArray = [];
    for (let i = 0; i < signingKeysHex.length; i += KEY_LENGTH) {
      keysArray.push("0x" + signingKeysHex.slice(i, i + KEY_LENGTH));
    }

    //console.log("Signing Keys Array:", keysArray);
    return keysArray;
  } catch (error) {
    console.error('Error calling getSigningKeys:', error);
    return null;
  }
}

/**
 * Checks for matching signing keys of a specified Node Operator.
 * 
 * This function opens an RPC tunnel, verifies that the Ethereum node is in sync,
 * checks the activity status of the given Node Operator, retrieves their non-withdrawn signing keys, 
 * and compares them to an array of provided keys. If matches are found, an array of matching keys 
 * is returned. If no matches are found, it returns `false`. In case of an error, it returns `null`.
 * 
 * @async
 * @function checkSigningKeys
 * @param {number} nodeOperatorId - The ID of the Node Operator whose signing keys are to be checked.
 * @param {string[]} keysArray - An array of signing keys in hexadecimal format to be matched against the Node Operator's keys.
 * @returns {Promise<string[]|boolean|null>} A promise that resolves to:
 * - An array of matching signing keys (in hexadecimal format) if any matches are found.
 * - `false` if no matches are found.
 * - `null` if an error occurs during the process.
 * 
 * @example
 * const nodeOperatorId = 43;
 * const keysArray = ["0xabc123...", "0xdef456...", "0x789xyz..."];
 * const matches = await checkSigningKeys(nodeOperatorId, keysArray);
 * if (matches === false) {
 *   console.log("No matching keys found.");
 * } else if (matches === null) {
 *   console.error("An error occurred during the signing keys check.");
 * } else {
 *   console.log("Matching keys:", matches);
 * }
 * 
 * @throws {Error} Logs and returns `null` if:
 * - The RPC tunnel could not be opened.
 * - The contract or other necessary data could not be retrieved.
 * - Any other unexpected error occurs.
 */
async function checkSigningKeys(nodeOperatorId, keysArray) {

  if (!promiseIpc) {
    console.error("promiseIpc is not initialized. Cannot open RPC tunnel.");
    return null;
  }

  try {
    console.log("Opening RPC tunnel...");
    await promiseIpc.send("openRpcTunnel");
    // Initialize the contract
    const contract = await getContract();
    if (!contract) {
      console.error("Failed to initialize contract.");
      return null;
    }

    // Check if the node is in sync
    const isSynced = await getSyncStatus();
    if (!isSynced) {
      console.log("Node is currently syncing...");
      return null;
    }

    // Check if the Node Operator is active
    const isActive = await isNodeOperatorActive(contract, nodeOperatorId);
    if (!isActive) {
      console.log("Node Operator is not active.");
      return false;
    }

    // Retrieve enqueuedCount and ensure it's above 0
    const enqueuedCount = await getNodeOperatorInfo(contract, nodeOperatorId);
    if (enqueuedCount === null || enqueuedCount <= 0) {
      console.log("No enqueued validators for this Node Operator.");
      return false;
    }

    // Get the number of non-withdrawn keys for this node operator
    const numberOfNoneWithdrawnKeys = await getNoneWithdrawnKeys(contract, nodeOperatorId);
    if (numberOfNoneWithdrawnKeys === null || numberOfNoneWithdrawnKeys <= 0) {
      console.log("No non-withdrawn keys available.");
      return false;
    }

    // Retrieve the signing keys from the contract
    const signingKeys = await getSigningKeys(contract, nodeOperatorId, 0, numberOfNoneWithdrawnKeys);
    if (signingKeys === null) {
      return null;
    }

    // Check for matches with the provided keys array
    const matchingKeys = signingKeys.filter(key => keysArray.includes(key));

    if (matchingKeys.length > 0) {
      //console.log("Matching keys found:", matchingKeys);
      return matchingKeys;
    } else {
      console.log("No matching keys found.");
      return false;
    }
  } catch (error) {
    console.error("Error in checkSigningKeys:", error);
    return null;
  }
  finally {
    console.log("Closing RPC tunnel...");
    await promiseIpc.send("closeRpcTunnel");
  }
}

module.exports = {
  checkSigningKeys
};
