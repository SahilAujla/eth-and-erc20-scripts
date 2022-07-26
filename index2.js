const { abi } = require("./constants/index.js");
const { ethers, utils } =   require('ethers');
require("dotenv").config({ path: ".env" });

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ERC20_CONTRACT_ADDRESS = process.env.ERC20_CONTRACT_ADDRESS;


let provider;
let sendingWallet;
let toAddress = "0x0B53E89cFD388f54A3683AAfc5974db4593B6641";
let erc20Contract;


const init = async () => {
    provider = new ethers.providers.AlchemyProvider("rinkeby", ALCHEMY_API_KEY_URL);

        console.log("Provider created");

    sendingWallet = new ethers.Wallet(
        PRIVATE_KEY,
        provider,
    )

    console.log("Wallet created");


    // For sending the native currency of the blockchain.
    // const tx = {
    //     to: toAddress,
    //     value: ethers.utils.parseEther("0.1"),
    // }

    console.log("Transaction sent...");

    erc20Contract = new ethers.Contract(
        ERC20_CONTRACT_ADDRESS,
        abi,
        sendingWallet,
    );

    // options if needed, most of the time not needed. We can add, gasPrice and gasLimit
    // var options = {gasPrice: ethers.utils.parseUnits('30000', 'gwei')};

    // sending the native currency with sendTransaction.
    // (await sendingWallet.sendTransaction(tx)).wait;

    // console.log("Native currency sent...")

    // sending the ERC20 tokens

    const gasLimitForTx = await erc20Contract.estimateGas.transfer(toAddress, 10000);
       console.log("gasLimit:",ethers.BigNumber.from(gasLimitForTx).toNumber());

    erc20Contract.transfer(toAddress, 10000, /* options */).then(() => {
        console.log("ERC20 tokens sent...Done!");
    }).catch(err => {
        console.log(err);
    })

    // sendingWallet.sendTransaction(tx).then((txObj) => {
    //     erc20Contract.transferFrom("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
    //     "0xe5cB067E90D5Cd1F8052B83562Ae670bA4A211a8", 477, options).then((nft) => {
    //         console.log(nft);
    //         console.log("We fukin did it!");
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // })
}

init().then(() => {
    console.log("Done");
})