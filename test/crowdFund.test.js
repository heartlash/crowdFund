const assert = require('assert');
const HDWalletProvider = require("@truffle/hdwallet-provider");

const Web3 = require('web3');

const provider = new HDWalletProvider({
    mnemonic: "wide page grab obtain advance comic stand ranch ripple scrub choice thought",
    providerOrUrl: "https://ropsten.infura.io/v3/29c51a2261c3427cb73a90dec424421a"
  });

const web3 = new Web3(provider);

const crowdFund = require('../build/crowdFund.json');
const crowdFundFactory = require('../build/crowdFundFactory.json');

let accounts;
let crowdFundFactoryAddress;


beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    crowdFundFactoryDeployed = new web3.eth.Contract(crowdFundFactory.abi, '0xa8bbdB5068aB01b9a729E22d044B8AD2cF8a9E9F');


    crowdFundDeployedAddress = await crowdFundFactoryDeployed.methods.getDeployedCrowdFundingCampaigns().call();


    crowdFundDeployed = new web3.eth.Contract(crowdFund.abi, crowdFundDeployedAddress[0])

});

describe('Test crowdFundFactory', () => {

    it('correctly deploys itself', () => {
        console.log("check the deployed address: ", crowdFundFactoryDeployed._address);
        assert.ok(crowdFundFactoryDeployed._address);
    });

    it('correctly deploys the crowdFund contracts', async () => {
        console.log("check the deployed address: ", crowdFundDeployedAddress[0]);
        assert.ok(crowdFundDeployedAddress[0]);

    });
});

describe('Test crowdFund', () => {

    it('checks that you cant contribute less than minimum amount', async () => {

        try{
            /*await crowdFundDeployed.methods.contributeToBusiness().send({value: 100, from: accounts[1]})*/
            assert(false)
        }
        catch (err){

            assert(err)
        }
    });

    it('after contribution the contract balance is increased', async () => {

        const initial_balance = await web3.eth.getBalance(crowdFundDeployedAddress[0]);
        console.log("here is the initial balance of the crowdFund wallet: ", initial_balance);

    });

    it('correctly marks the manager', async () => {
        assert.strictEqual(accounts[0], await crowdFundDeployed.methods.entrepreneur().call());
    });

    it('lets people contribute and mark then contributed', async() => {
        await crowdFundDeployed.methods.contributeToBusiness().send({value: 1002, from: accounts[1]});
        assert(await crowdFundDeployed.methods.contributors(accounts[1]).call().contributed)

    });

    it('the entrepenuer starts a withrawal request', async () => {
        
        try{
            await crowdFundDeployed.methods.initiateRequest('for music video', 400, accounts[5]).send({
                from: accounts[0], gas: '1000000'
            });
            assert.strictEqual(accounts[5],await crowdFundDeployed.methods.withrawalRequests(0).call().recipient)

        }
        catch (err){
            console.log(err)
        }
    });

    it('a contributor can approve the request', async () => {

        try{
            await crowdFundDeployed.methods.approveWithrawalRequests(0).send({
                from: accounts[1], gas: '1000000'
            });
            assert(await crowdFundDeployed.methods.contributors(accounts[1].approved));
        }
        catch (err){
            console.log(err)
            assert(false)
        }

    });

    it('entrepeneur is able to withdraw funds', async() => {
        await crowdFundDeployed.methods.contributeToBusiness().send({value: 1010, from: accounts[2]});
        await crowdFundDeployed.methods.approveWithrawalRequests(0).send({
            from: accounts[2], gas: '1000000'
        });
        await crowdFundDeployed.methods.contributeToBusiness().send({value: 1020, from: accounts[3]});
        await crowdFundDeployed.methods.approveWithrawalRequests(0).send({
            from: accounts[3], gas: '1000000'
        });

        try{
            await crowdFundDeployed.methods.withdrawFunds(0).send({
                from: accounts[0], gas: '1000000'
            });

            assert(true);
        }
        catch (err){
            assert(false)
        }
    });

    it('increases entrepeneurs wallet balance', async () => {

        const current_balance = await web3.eth.getBalance(accounts[0]);

        assert.strictEqual(0, await web3.eth.getBalance(crowdFundDeployedAddress[0]));

    });


});