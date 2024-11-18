const Web3 = require("web3").default;
const csm_abi = require("./CSModuleABI.json");
const log = require("electron-log");

const w3 = new Web3("http://127.0.0.1:8545");

async function isConnected() {
  try {
    await w3.eth.getBlockNumber();
    return true; // Connection successful
  } catch (error) {
    log.error("Error connecting to Ethereum network:", error);
    return false; // Connection failed
  }
}

async function getChainId() {
  try {
    return await w3.eth.getChainId();
  } catch (error) {
    log.error("Error retrieving chain ID:", error);
    return null;
  }
}

async function getContractAddress() {
  if (await isConnected()) {
    const chainId = await getChainId();
    if (chainId !== null) {
      switch (Number(chainId)) {
        case 1:
          log.info("Connected to Mainnet. ID =", chainId.toString());
          return "0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F";

        case 17000:
          log.info("Connected to Holesky. ID =", chainId.toString());
          return "0x4562c3e63c2e586cD1651B958C22F88135aCAd4f";

        default:
          log.info("Connected to unsupported network. ID =", chainId.toString());
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
      log.info("Node is in sync ... ");
      return true; // Node is in sync
    } else {
      log.info("Node is currently syncing ... ");
      return false; // Node is syncing
    }
  } catch (error) {
    log.error("Error checking sync status:", error);
    return null;
  }
}

async function getContract() {
  try {
    const contractAddress = await getContractAddress();
    if (!csm_abi || !contractAddress) {
      throw new Error("Missing ABI or contract address.");
    }
    return new w3.eth.Contract(csm_abi, contractAddress);
  } catch (error) {
    log.error("Error initializing contract:", error);
    return null;
  }
}

async function isNodeOperatorActive(contract, nodeOperatorId) {
  try {
    if (!contract) {
      throw new Error("Contract is not initialized.");
    }
    const isActive = await contract.methods.getNodeOperatorIsActive(nodeOperatorId).call();
    log.info("Node Operator is active:", isActive);
    return isActive;
  } catch (error) {
    log.error("Error calling getNodeOperatorIsActive:", error);
    return null;
  }
}

async function getNodeOperatorInfo(contract, nodeOperatorId) {
  try {
    if (!contract) {
      throw new Error("Contract is not initialized.");
    }

    const nodeOperator = await contract.methods.getNodeOperator(nodeOperatorId).call();
    const enqueuedCount = nodeOperator.enqueuedCount;

    //log.info("Enqueued Count:", enqueuedCount);
    return enqueuedCount;
  } catch (error) {
    log.error("Error calling getNodeOperator:", error);
    return null;
  }
}

async function getNoneWithdrawnKeys(contract, nodeOperatorId) {
  try {
    if (!contract) {
      throw new Error("Contract is not initialized.");
    }
    const noneWithdrawnKeys = await contract.methods.getNodeOperatorNonWithdrawnKeys(nodeOperatorId).call();
    return noneWithdrawnKeys;
  } catch (error) {
    log.error("Error calling getNodeOperatorNonWithdrawnKeys: ", error);
    return null;
  }
}

async function getSigningKeys(contract, nodeOperatorId, startIndex, keysCount) {
  try {
    if (!contract) {
      throw new Error("Contract is not initialized.");
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

    //log.info("Signing Keys Array:", keysArray);
    return keysArray;
  } catch (error) {
    log.error("Error calling getSigningKeys:", error);
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
 *   log.info("No matching keys found.");
 * } else if (matches === null) {
 *   log.error("An error occurred during the signing keys check.");
 * } else {
 *   log.info("Matching keys:", matches);
 * }
 *
 * @throws {Error} Logs and returns `null` if:
 * - The RPC tunnel could not be opened.
 * - The contract or other necessary data could not be retrieved.
 * - Any other unexpected error occurs.
 */
async function checkSigningKeys(keysArray, monitoring) {
  try {
    log.info("Opening RPC tunnel...");
    await monitoring.openRpcTunnel();

    log.info("Get Node Operator ID from LCOM");
    const lcomServices = await monitoring.getServiceInfos("LCOMService");
    if (lcomServices.length < 1) {
      throw new Error("LCOM service not found");
    }
    const nodeOperatorId = lcomServices.find((s) => s.config.env.NO_ID).config.env.NO_ID;
    if (!nodeOperatorId) {
      throw new Error("Node Operator ID not found in LCOM Config");
    }
    log.info("Node Operator ID:", nodeOperatorId);

    // Initialize the contract
    const contract = await getContract();
    if (!contract) {
      log.error("Failed to initialize contract.");
      return null;
    }

    // Check if the node is in sync
    const isSynced = await getSyncStatus();
    if (!isSynced) {
      log.info("Node is currently syncing...");
      return null;
    }

    // Check if the Node Operator is active
    const isActive = await isNodeOperatorActive(contract, nodeOperatorId);
    if (!isActive) {
      log.info("Node Operator is not active.");
      return false;
    }

    // Retrieve enqueuedCount and ensure it's above 0
    const enqueuedCount = await getNodeOperatorInfo(contract, nodeOperatorId);
    if (enqueuedCount === null || enqueuedCount <= 0) {
      log.info("No enqueued validators for this Node Operator.");
      return false;
    }

    // Get the number of non-withdrawn keys for this node operator
    const numberOfNoneWithdrawnKeys = await getNoneWithdrawnKeys(contract, nodeOperatorId);
    if (numberOfNoneWithdrawnKeys === null || numberOfNoneWithdrawnKeys <= 0) {
      log.info("No non-withdrawn keys available.");
      return false;
    }

    // Retrieve the signing keys from the contract
    const signingKeys = await getSigningKeys(contract, nodeOperatorId, 0, numberOfNoneWithdrawnKeys);
    if (signingKeys === null) {
      return null;
    }

    // Check for matches with the provided keys array
    const matchingKeys = signingKeys.filter((key) => keysArray.includes(key));

    if (matchingKeys.length > 0) {
      //log.info("Matching keys found:", matchingKeys);
      return matchingKeys;
    } else {
      log.info("No matching keys found.");
      return false;
    }
  } catch (error) {
    log.error("Error in checkSigningKeys:", error);
    return null;
  } finally {
    log.info("Closing RPC tunnel...");
    await monitoring.closeRpcTunnel();
  }
}

export default checkSigningKeys;
