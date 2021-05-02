var web3 = new Web3(Web3.givenProvider);
var contractInstance;

// jQuery function enables communication between JavaScript, Metamask and the blockchain.
$(document).ready(function() {
  window.ethereum.enable().then(function(accounts) {
    contractInstance = new web3.eth.Contract(abi, "Contract address", {from: accounts[0]});
    console.log(contractInstance);
  });
  $("#placeBet_button").click(betInputData);
  $("#play_button").click(flipTheCoin);
});

function betInputData() {
  var playerBet = $("#bet_input").val();
  var playerChoice = $("#choice_input").val();
  // Creates a variable to store data from the bet_input and choice_input forms.
  var config = {
    value: web3.utils.toWei(playerBet, "ether")
  }

  contractInstance.methods.placeBet(playerBet, playerChoice).send(config)
  // Calls the function .placeBet in the smartcontract.
  .on("transactionHash", function(hash) {
    console.log(hash);
  })
  .on("confirmation", function(confirmationNr) {
    console.log(confirmationNr);
  })
  .on("receipt", function(receipt) {
    console.log(receipt);
    alert("Your bets are now recorded on the blockchain!");
  })
  // .on creates a event listner to get responds from the blockchain.

}

function flipTheCoin() {
  // Calls the function .checkResult in the smartcontract.
  contractInstance.methods.checkResult().call().then(function(res) {

    if(res == true) {
      alert("WINNER");
    } else {
      alert("Sorry, you lost this time!");
    }
    alert(res);
    console.log(res);
  })

}
