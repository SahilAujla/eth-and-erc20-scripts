# ETH & ERC20 send scripts

`sendERC20.js` - script for ERC20 token transfers using ethers.js and estimating `gasLimit` ahead of time.

`sendMaxETH.js` - script for sending the maximum ETH that the user has in the account, it calculates the gasFees ahead of time and subtracts that from the total balance to get the max transferrable ETH value and transfers it to another account. 

It shows how to calculate `gasFee` for a transaction before executing the transaction and how to programatically send ETH using ethers.js.