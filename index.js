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
    // change "maticmum" to "matic" on the polygon mainnet.
    provider = new ethers.providers.AlchemyProvider("maticmum", ALCHEMY_API_KEY_URL);

        console.log("Provider created");

    sendingWallet = new ethers.Wallet(
        PRIVATE_KEY,
        provider,
    )

    console.log("Wallet created");

    console.log("Transaction sent...");

    erc20Contract = new ethers.Contract(
        ERC20_CONTRACT_ADDRESS,
        abi,
        sendingWallet,
    );

    const gasLimitForTx = await erc20Contract.estimateGas.transfer(toAddress, 10000);
       console.log("gasLimit:", ethers.BigNumber.from(gasLimitForTx).toNumber());

    erc20Contract.transfer(toAddress, 10000).then(() => {
        console.log("ERC20 tokens sent...Done!");
    }).catch(err => {
        console.log(err);
    })
}

init().then(() => {
    console.log("Done");
})