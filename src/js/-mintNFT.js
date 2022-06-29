//this should always be done in the server side of life
export const API_URL = "https://eth-rinkeby.alchemyapi.io/v2/iGZ9mxR715CGKzyJMTT-QVQGC_cl86Az";
const PRIVATE_KEY = "ea2c027b72e54e2d8d0e78f385fef9e948c1ce52c136f6f64e1e0e62fdeb8f93";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

export const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
export const contractAddress = "0x3e0F95890337499C4d5d2d427Ee78581418eFcf2";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const run = async (buyerId) => {
  const tokenURI = 'https://gateway.pinata.cloud/ipfs/QmdY28Zipw23T2DsNgLQxMmKKn2X4LkbtdBwRgd9tU3Hgc';
  const nonce = await web3.eth.getTransactionCount(buyerId, 'latest'); //get latest nonce
  const historicalBlocks = 4;
  const feeHistory = await web3.eth.getFeeHistory(historicalBlocks, "pending", [25, 50, 75])
  // console.log(feeHistory);
  console.log(feeHistory.baseFeePerGas.map((baseFeePerGas) => Number(baseFeePerGas)));

  // return;
  console.log({ nonce, buyerId });

  const tx = {
    'from': buyerId,
    'to': contractAddress,
    'nonce': nonce,
    'gas': 500000,
    'maxPriorityFeePerGas': 2999999987,
    'data': nftContract.methods.mintNFT(buyerId, tokenURI).encodeABI(),
    'value': 100000000000000
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
};

export { run };
