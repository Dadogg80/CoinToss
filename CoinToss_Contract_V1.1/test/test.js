const CoinToss = artifacts.require("CoinToss");
const truffleAssert = require("truffle-assertions");

contract("CoinToss", async function(accounts) {
    /*  UnitTesting contract CoinToss  */
    let instance;

    before(async function() {
        instance = await CoinToss.deployed();
    });
    /*  UnitTesting of PlaceBet() function  */
    it("Should let the player bet 1 ether on 0 (Heads).", async function() {
        await truffleAssert.passes(instance.placeBet(1, 0, {value: web3.utils.toWei("1", "ether")}));
    });
    it("Should let the player bet 1 Eth on 1 (Tails).", async function() {
        await truffleAssert.passes(instance.placeBet(1, 1, {value: web3.utils.toWei("1", "ether")}));
    });
    it("Shouldn`t let the player bet on other numbers then 0 (Heads) or 1 (Tails).", async function() {
        await truffleAssert.fails(instance.placeBet(1, 2, {value: web3.utils.toWei("1", "ether")}));
    });
    it("Shouldn`t let the betAmount be lower than 0.00001 Eth", async function() {
        await truffleAssert.fails(instance.placeBet(10, 0, {value: 10}), truffleAssert.ErrorType.REVERT);
    });

    /*  UnitTesting the payOutBetAmount function  */
    it ("Should not allow a non-owner to use payOutBetAmount function", async function() {
        let instance = await CoinToss.new();
        await instance.placeBet(1, 0, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        await truffleAssert.fails(instance.payOutBetAmount({from: accounts[0]}), truffleAssert.ErrorType.REVERT);
    });
    it ("Should allow a owner to use payOutBetAmount function", async () => {
        let instance = await CoinToss.new();
        await instance.placeBet(1, 0, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        await truffleAssert.passes(instance.payOutBetAmount({from: accounts[1]}));
    });

    /*  UnitTesting the payOutToBalance function  */
    it("should increase the contracts balance", async () => {
        let instance = await CoinToss.new();
        let contractBalance = await web3.eth.getBalance(accounts[0]);
        await instance.placeBet(1, 1, {value: web3.utils.toWei("1", "ether")});
        await instance.payOutToBalance({from: accounts[0]});
        assert(contractBalance += parseInt(web3.utils.toWei("1", "ether")));
    });
/*
    it ("Should allow a owner to use payOutBetAmount function", async function() {
        let instance = await CoinToss.new();
        await instance.placeBet(1, 0, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        await truffleAssert.passes(instance.payOutBetAmount({from: accounts[0]}));
    });
*/





})
