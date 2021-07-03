const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts', 'crowdFund.sol');


const source = fs.readFileSync(contractPath, 'utf8');

var input = {
    language: 'Solidity',
    sources: {
        'crowdFund.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 


const compiledContracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

console.log("checking the mfking compiledContracts here: ", compiledContracts);

fs.ensureDirSync(buildPath);

for(let contract in compiledContracts['crowdFund.sol']){
    console.log("see the mfking contract here: ", contract);
    fs.outputJSONSync(
        path.resolve(buildPath, contract + '.json'),
        compiledContracts['crowdFund.sol'][contract]
    );
}