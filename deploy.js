const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const compiledContract = require('./build/crowdFundFactory.json');

const provider = new HDWalletProvider({
    mnemonic: "wide page grab obtain advance comic stand ranch ripple scrub choice thought",
    providerOrUrl: "https://ropsten.infura.io/v3/29c51a2261c3427cb73a90dec424421a"
  });

  const web3 = new Web3(provider);

  const deploy = async () => {
    console.log("comes here yoo");

    try{
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log("get balance for account 0: ", balance);

        console.log("attempting to deploy contract from account", accounts[0]);
        console.log("the type is", typeof(compiledContract.abi))
        const deployedContract = await new web3.eth.Contract(compiledContract.abi, )
        .deploy({data: '0x' + compiledContract.evm.bytecode.object, arguments: [web3.utils.asciiToHex(1000)]})
        .send({gas: '5000000', from: accounts[0]});

        console.log('contract deployed at: ', deployedContract._address);
    }

    catch (err){
        console.log(err)
    }

  };

  deploy();