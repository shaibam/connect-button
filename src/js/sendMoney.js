import {createAlchemyWeb3}  from "@alch/alchemy-web3";
import contract from "../artifacts/contracts/MyNFT.sol/MyNFT.json";
const API_URL = "https://eth-rinkeby.alchemyapi.io/v2/iGZ9mxR715CGKzyJMTT-QVQGC_cl86Az";
const contractAddress = "0x3e0F95890337499C4d5d2d427Ee78581418eFcf2";
const web3 = createAlchemyWeb3(API_URL);

export const sendMoney = async (buyerId, mintURI) => {
    const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
    const nonce = await web3.eth.getTransactionCount(buyerId, 'latest'); //get latest nonce
    const tx = {
        'from': buyerId,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas': 2999999987,
        'data': nftContract.methods.mintNFT(buyerId, mintURI).encodeABI(),
        'value': 10000000000000000
    };

    const signedTx = await web3.eth.sendTransaction(tx);
    // const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction); //todo!!!
    console.log({ signedTx })
    return signedTx
};