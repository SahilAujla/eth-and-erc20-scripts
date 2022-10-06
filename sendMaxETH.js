// sendmaxeth.js - sends all the amount in a wallet to another account.
// Calculates the gasFee ahead of time and subtracts that from the current total balance to get the max transferrable ETH
// Sends the max transferrable ETH to another account.

const { ethers } = require('ethers');
require("dotenv").config({ path: ".env" });

const axios = require('axios').default;

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

let provider;
let sendingWallet;
let maxAmountThatCanBeSent;


const init = async () => {
    provider = new ethers.providers.AlchemyProvider("rinkeby", ALCHEMY_API_KEY_URL);

        console.log("Provider created");

    sendingWallet = new ethers.Wallet(
        PRIVATE_KEY,
        provider,
    )

    console.log("Wallet created");

    async function getGasPrice() {
        try {
          const response = await axios.get(`https://gas-api.metaswap.codefi.network/networks/4/suggestedGasFees`);
          let gasPriceObject = {
            maxFeePerGas: response.data.high.suggestedMaxFeePerGas,
            maxPriorityFee: response.data.high.suggestedMaxPriorityFeePerGas
          }
          return gasPriceObject;
        } catch (error) {
          console.error(error);
        }
      }

    let gasPriceObject = await getGasPrice();

    let maxFeePerGas = gasPriceObject.maxFeePerGas;
    let maxPriorityFee = gasPriceObject.maxPriorityFee;

    let gasPriceInGweiString = maxFeePerGas;
    let gasPriceInGwei = Number(gasPriceInGweiString);
    const gasFeesInGwei = 21000 * gasPriceInGwei;
    const gasFeesInWei = ethers.utils.parseUnits(gasFeesInGwei.toString(), "gwei");
    const gasFeesInETH = ethers.utils.formatUnits(gasFeesInWei, "ether");

    const addressOfTheCurrentUser = "0x0B53E89cFD388f54A3683AAfc5974db4593B6641" // I am hardcoding this but you can get it programatically

    const balance = await provider.getBalance(addressOfTheCurrentUser)
    const balanceInEth = ethers.utils.formatEther(balance)
    maxAmountThatCanBeSent = Number(balanceInEth) - Number(gasFeesInETH);
    if (maxAmountThatCanBeSent <= 0) {
      console.log("Not enough balance");
      return;
    }
    console.log("Max Amount That can be sent:", maxAmountThatCanBeSent);

    let maxAmountThatCanBeSentString = maxAmountThatCanBeSent.toString();

    const tx = {
    to: "0xafaF84B9938b31B357DAdDe97e38772B63fcaE92", // To whichever address you want to send ETH
    value: ethers.utils.parseEther(maxAmountThatCanBeSentString),
    // gasPrice: ethers.utils.parseUnits((gasPriceInGwei.toString()), "gwei"), -- this is the wrong way, use maxFeePerGas and maxPriorityFeePerGas instead
    gasLimit: 21000,
    maxFeePerGas: ethers.utils.parseUnits((maxFeePerGas), "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits((maxPriorityFee), "gwei"),
    }

    sendingWallet.sendTransaction(tx).then((txObj) => {
        console.log("Transaction Sent!");
    })
}

init().then(() => {
    console.log("Done");
})