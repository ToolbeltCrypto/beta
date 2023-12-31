import { ethers } from "ethers";
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { bypassMode, hexRowAdd } from "./index.js";
import abi_erc20 from "../ABI/abi_erc20.json";
import abi_ownable from "../ABI/abi_ownable.json";
import abi_token from "../ABI/abi_token.json";
import abi_stake from "../ABI/abi_stake.json";
import abi_sale from "../ABI/abi_sale.json";
import abi_affiliate from "../ABI/abi_affiliate.json";
import abi_locker from "../ABI/abi_locker.json";
import abi_event from "../ABI/abi_event.json";
import bc_token from "../ABI/bc_token.json";
import bc_stake from "../ABI/bc_stake.json";
import bc_sale from "../ABI/bc_sale.json";
import bc_affiliate from "../ABI/bc_affiliate.json";
import bc_locker from "../ABI/bc_locker.json";
import bc_event from "../ABI/bc_event.json";
export var hexBreak = false;
export var loopEventBlock;

// matic
// const alchemyApiKey = '';
// const provider = new ethers.providers.AlchemyProvider('maticmum', alchemyApiKey);
// export var WETH = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
// let swapRouter = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';
// let contracts = ['0x6639BB4bD2515adE006cB5d5270D51678Aa12e6a', '0x0b4434aAc36B65cD7648cE90365397FE9b9087F4', '0x345B68aC19AEBDAd5b23BAd3CF72AdF44bf0A232', '0x4813FaF0AfB661153AEac94c9f07314c98510DB2', '0x4C71A2FCdC8ccD4AACd0b07C6ba41c999e76429A', '0x54Fa8812bb9b34C6EC3b891EedDDb26fe0Cb8AF8'];

// bsc
// const provider = new ethers.providers.JsonRpcProvider('');
export var WETH = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'; //change on mainnet?
let swapRouter = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'; //change on mainnet?
let contracts = ['0x3122eE54C5bD358211d84CAEb7235FD656ca1B09', '0x36a9e6BE2767F6E6a3c672DeD2979473cd0e892e', '0xd6c9c36C3a101405D763b683Fe9d5549e06628cE', '0x05aBF87253B56cC3ccbD6EDD059577E626bAAd3F', '0x43aeed08B955E0aeF89cc08E74922CC9d8399e56', '0x59FC270A17FffE86411b90BF2cba435904447E58'];

/* SIGNER */
var provider;
var wallet;
var chainID;

/* WALLET */
// var privateKeys = ['', ''];
// var wallet2 = new ethers.Wallet(privateKeys[0], provider);
// var wallet = new ethers.Wallet(privateKeys[1], provider);
// wallet._address = wallet.address;
// var chainID = provider.getNetwork.chainId;


export var cTOKEN;
export var cSTAKE;
export var cSALE;
export var cAFFILIATE;
export var cLOCKER;
export var cEVENT;

function loadContracts() {
    cTOKEN = new ethers.Contract(contracts[0], abi_token, wallet);
    cSTAKE = new ethers.Contract(contracts[1], abi_stake, wallet);
    cSALE = new ethers.Contract(contracts[2], abi_sale, wallet);
    cAFFILIATE = new ethers.Contract(contracts[3], abi_affiliate, wallet);
    cLOCKER = new ethers.Contract(contracts[4], abi_locker, wallet);
    cEVENT = new ethers.Contract(contracts[5], abi_event, wallet);
}

export async function connectWallet() {
    try {
        if (window.ethereum) {
            addChain('tBNB', window.ethereum); //change for mainnet?
            provider = new ethers.providers.Web3Provider(window.ethereum);
            wallet = provider.getSigner((await provider.send("eth_requestAccounts", []))[0]);
            chainID = provider.getNetwork.chainId;
            loadContracts();

            provider.on('accountsChanged', async() => {
                await provider.send("eth_requestAccounts", []);
                wallet = provider.getSigner();
            });
            window.ethereum.on('chainChanged', (chainId) => {
                chainID = chainId;
            });

            await getEventPing();
            return true;
        } else {
            alert('ERROR: no wallet found');
            return false;
        }
    } catch(e) {
        alert(e);
    }
}

export async function connectWalletMobile() { //working? appears twice after close? grey out screen?
    try {
        let providerWC = await EthereumProvider.init({
            projectId: '9cb2b2dd7e7d5b6124d546908cf695bf',
            chains: [0x61], //change for mainnet? wait for wc software update?
            events: ['chainChanged', 'accountsChanged'],
            showQrModal: true,
            qrModalOptions: {
                themeMode: 'dark',
                explorerRecommendedWalletIds: [
                    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
                    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
                    '225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f'
                ]
            }
        });

        await providerWC.enable();
        provider = new ethers.providers.Web3Provider(providerWC);
        wallet = provider.getSigner((await provider.send("eth_requestAccounts", []))[0]);
        chainID = providerWC.chainId;
        addChain('tBNB', providerWC);
        loadContracts();
        await getEventPing();
        return true;
    } catch (e) {
        alert(e);
        return false;
    }  
}

export async function addChain(nativeCurrency, providerUnwraped) {
    let cID;
    let cName;
    let rUrls;
    let bUrls;
    let nName;
    let nSymbol;
    let nDecimals;

    if (nativeCurrency == 'tBNB') { 
        cID = '0x61';
        cName = 'BNB Smart Chain Testnet';
        rUrls = ['https://data-seed-prebsc-2-s1.bnbchain.org:8545']; //slow after earlier querys (event)?
        bUrls = ['https://testnet.bscscan.com'];
        nName = 'testnet BNB';
        nSymbol = 'tBNB';
        nDecimals = 18;
    } else if (nativeCurrency == 'BNB') {
        //change for mainnet?
    }

    if (providerUnwraped == window.ethereum) {
        await providerUnwraped.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: cID,
                    chainName: cName,
                    rpcUrls: rUrls,
                    blockExplorerUrls: bUrls,
                    nativeCurrency: {
                        name: nName,
                        symbol: nSymbol,
                        decimals: nDecimals,
                    },
                },
            ],
        });
    } else {

    }
};

export async function deploy() {
    console.log('DEPLOYING...');

    cTOKEN = await new ethers.ContractFactory(abi_token, bc_token, wallet).deploy(swapRouter, await getGasObj());
    await cTOKEN.deployTransaction.wait();

    cSTAKE = await new ethers.ContractFactory(abi_stake, bc_stake, wallet).deploy(cTOKEN.address, await getGasObj());
    await cSTAKE.deployTransaction.wait();

    cSALE = await new ethers.ContractFactory(abi_sale, bc_sale, wallet).deploy(WETH, cSTAKE.address, await getGasObj());
    await cSALE.deployTransaction.wait();

    cAFFILIATE = await new ethers.ContractFactory(abi_affiliate, bc_affiliate, wallet).deploy(cSTAKE.address, await getGasObj());
    await cAFFILIATE.deployTransaction.wait();

    cLOCKER = await new ethers.ContractFactory(abi_locker, bc_locker, wallet).deploy(cSTAKE.address, await getGasObj());
    await cLOCKER.deployTransaction.wait();

    cEVENT = await new ethers.ContractFactory(abi_event, bc_event, wallet).deploy(cSTAKE.address, await getGasObj());
    await cEVENT.deployTransaction.wait();

    console.log("let contracts = ['" + cTOKEN.address + "', '" + cSTAKE.address + "', '" + cSALE.address + "', '" + cAFFILIATE.address + "', '" + cLOCKER.address + "', '" + cEVENT.address + "'];");
}

async function getGasObj() {
    let nonce = provider.getTransactionCount(wallet._address);
    let feeData = await provider.getFeeData();
    if (feeData.gasPrice == null) {
        if (feeData.maxFeePerGas == null) {
            return null;
        }
        return {maxFeePerGas: feeData.maxFeePerGas, maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, chainId: chainID, nonce: await nonce};
    }
    return {gasPrice: feeData.gasPrice, chainId: chainID, nonce: await nonce};
}


//APPROVE
export async function approve(inputParams) {
    let wei = ethers.utils.parseUnits(inputParams[0], 18);
    let c = new ethers.Contract(inputParams[2], abi_erc20, wallet);
    let r = await c.approve(inputParams[1], wei, await getGasObj());
    await r.wait();
    console.log(r);
}
export async function unapprove(inputParams) {
    inputParams.unshift('0');
    await approve(inputParams);
}
export async function allowance(inputParams) {
    let c = new ethers.Contract(inputParams[1], abi_erc20, wallet);
    return await c.allowance(wallet._address, inputParams[0]);
}
export async function balanceOf(token) {
    let c = new ethers.Contract(token, abi_erc20, wallet);
    return await c.balanceOf(wallet._address);
}
export async function getTokenName(token) {
    let c = new ethers.Contract(token, abi_erc20, wallet);
    try {
        return await c.name();
    } catch {
        let abbreviation = '';
        for (let i=0; i < 7; i++) {
            abbreviation += token[i];
        }
        return abbreviation;
    }
    
}
export async function getTime() {
    return (await provider.getBlock('latest')).timestamp;
}
export async function getBlock() {
    return await provider.getBlockNumber();
}
export async function getTransaction(hash) {
    return await provider.getTransaction(hash);
}


//TOKEN
export async function setTax(taxPercent) {
    let r = await cTOKEN.setTaxPerThousand(taxPercent * 10, await getGasObj());
    await r.wait();
    console.log(r);
}
async function addIgnoreFee(ignored) {
    let r = await cTOKEN.addIgnoreFee(ignored, await getGasObj());
    await r.wait();
    console.log(r);
}
async function setupContractDependencies() {
    let r = await cTOKEN.setupContractDependencies(cSTAKE.address, cAFFILIATE.address, await getGasObj());
    await r.wait();
    console.log(r);
}
async function transfer(amtIn, receiver) { //test?
    let weiIn = ethers.utils.parseUnits(amtIn, 18);
    let r = await cTOKEN.transfer(receiver, weiIn, await getGasObj());
    await r.wait();
    console.log(r);
}


//STAKE
export async function stake(inputParams) {
    let weiStakeSize = ethers.utils.parseUnits(inputParams[0], 18);
    let r = await cSTAKE.stake(weiStakeSize, await getGasObj());
    await r.wait();
    console.log(r);
}
export async function unstake() {
    let r = await cSTAKE.unstake(await getGasObj());
    await r.wait();
    console.log(r);
}
export async function claimStake() {
    let r = await cSTAKE.claim(await getGasObj());
    await r.wait();
    console.log(r);
}
export async function getTotalSupply() {
    return await cTOKEN.totalSupply();
}
export async function getUserStake() {
    return (await cSTAKE.staker_wallet(wallet._address))[0];
}
export async function getTotalStake() {
    return await cSTAKE.totalStaked();
}
export async function getUserRewards() {
    try {
        return await cSTAKE.getClaimableRewards(wallet._address);
    }
    catch {
        return 0;
    }
}
export async function getTotalRewards() {
    return await cSTAKE.rewards();
}
export async function getUnstakePayout() {
    return await cSTAKE.getUnstakePayout(wallet._address);
}


//SALE
export async function newSale(inputParams) {
    //_tokenSale, _tokenPair, _router, _percentIntoLiquidity, _amtToken, _duration
    let _weiToken = ethers.utils.parseUnits(inputParams[0], 18);
    let r = await cSALE.newSale(inputParams[1], inputParams[2], inputParams[3], inputParams[4], _weiToken, inputParams[5], await getGasObj());
    await r.wait();
    console.log(r);
}
export async function joinSale(inputParams) {
    //_tokenSale, _tokenPay, _amtIn
    let _weiIn = ethers.utils.parseUnits(inputParams[0], 18);
    let r;
    try {
        r = await cSALE.joinSale(inputParams[1], inputParams[2], _weiIn, await getGasObj());
        await r.wait();
        console.log(r);
    } catch {
        r = await cSALE.joinSale(inputParams[1], inputParams[2], _weiIn, await getGasObj());
        await r.wait();
        console.log(r);
    }
}
export async function endSale(inputParams) {
    let r = await cSALE.endSale(inputParams[0], await getGasObj());
    await r.wait();
    console.log(r);
}
export async function claimSale(inputParams) {
    let r = await cSALE.claimSale(inputParams[0], await getGasObj());
    await r.wait();
    console.log(r);
}
export async function unlockLiquidity(inputParams) {
    let r = await cSALE.unlockLiquidity(inputParams[0], await getGasObj());
    await r.wait();
    console.log(r);
}
export async function getBalancePair(tokenSale) {
    return await cSALE.balanceOfPair_wallet_token(tokenSale, wallet._address);
}
export async function getSale(tokenSale) {
    return await cSALE.sale_token(tokenSale);
}
export async function getUnlockablePercentage(tokenSale) {
    return await cSALE.getUnlockablePercentage(tokenSale);
}


//AFFILIATE
export async function setupAffiliate(inputParams) {
    let r = await cAFFILIATE.setupAffiliate(inputParams[0], inputParams[1], await getGasObj());
    await r.wait();
    console.log(r);
}
export async function getAffiliate(token) {
    return await cAFFILIATE.affiliate_token_wallet(token, wallet._address);
}
export async function getConnections(token) {
    return await cAFFILIATE.connections_token_wallet(token, wallet._address);
}
export async function getTokensEarned(token) {
    return await cAFFILIATE.tokensEarned_token_wallet(token, wallet._address);
}
export async function getMostConnections(token) {
    return await cAFFILIATE.mostConnections(token);
}
export async function getMostTokensEarned(token) {
    return await cAFFILIATE.mostConnections(token);
}


//LOCKER
export async function tokenOwnershipToLocker(inputParams) {
    //contract, token
    let c = new ethers.Contract(inputParams[0], abi_ownable, wallet);
    let r = await c.transferOwnership(cLOCKER.address, await getGasObj());
    await r.wait();
    console.log(r);
    let q = await cLOCKER.setupTokenVote(inputParams[0], inputParams[1], await getGasObj());
    await q.wait();
    console.log(q);
}
export async function toggleDelta(inputParams) {
    let ID = await cLOCKER.nextID();
    let r = await cLOCKER.toggleDelta(inputParams[0], await getGasObj());
    await r.wait();
    console.log(r);
    return ID;
}
export async function createDelta(inputParams) { //works with space in input?
    //contract, functionName, paramTypes, paramValues, returnTypes
    let paramTypes = inputParams[2].split(", ");
    let paramValues = inputParams[3].split(", ");
    let returnTypes = inputParams[4].split(", ");
    if (paramTypes.length != paramValues.length) {
        alert('ERROR: unmatched types or values');
        return 0;
    }
    let ID = await cLOCKER.nextID();
    let r = await cLOCKER.createDelta(inputParams[0], inputParams[1], paramValues, returnTypes, encodeParams(inputParams[1], paramTypes, paramValues), await getGasObj());
    await r.wait();
    console.log(r);
    return ID;
}
export async function voteDelta(inputParams) {
    //ID, inFavor
    let inFavor;
    //fix yes no?
    if (inputParams[1] == 'no') {
        inFavor = false;
    } else if (inputParams[1] == 'yes') {
        inFavor = true;
    } else {
        alert('TYPE: yes or no');
        return;
    }
    let r = await cLOCKER.voteDelta(inputParams[0], inFavor, await getGasObj());
    await r.wait();
    console.log(r);
}
export async function executeDelta(inputParams) {
    let r = await cLOCKER.executeDelta(inputParams[0], await getGasObj());
    await r.wait();
    console.log(r);
}
export function encodeParams(functionName, paramTypes, paramValues) {
    let stringABI = "function " + functionName + "("
    for (let i=0; i < paramTypes.length; i++) {
        if (i!==0) {
            stringABI += ", ";
        }
        stringABI += paramTypes[i] + " p" + i;
    }
    stringABI += ")";
    let r = new ethers.utils.Interface([stringABI]).encodeFunctionData(functionName, paramValues);
    return r;
}
export async function decodeBytes(rTypes, bytes) {
    return ethers.utils.defaultAbiCoder.decode(rTypes, bytes);
}
async function createAndExecuteDelta(contractAddress, functionName, paramTypes, paramValues, returnTypes) { //test?
    let id = await createDelta([contractAddress, functionName, paramTypes, paramValues, returnTypes]);
    console.log(id);
    await voteDelta([id, 'yes']);
    await executeDelta([id]);
}
async function toggleAndExecuteDelta(contractAddress) { //test?
    let id = await toggleDelta([contractAddress]);
    console.log(id);
    await voteDelta([id, 'yes']);
    await executeDelta([id]);
}
export async function getDelta(id) {
    return await cLOCKER.deltas(id);
}
export async function getParamValues(id) {
    return await cLOCKER.getParamValues(id);
}
export async function getReturnValues(id) {
    return await decodeBytes(await cLOCKER.getReturnTypes(id), (await getDelta(id)).encodedOutput);
}
export async function getCreationCost(contract) {
    return await cLOCKER.getNextCreationCost(contract);
}
export async function getTokenVote(contract) {
    return await cLOCKER.tokenVote(contract);
}
export async function getVoteDuration() {
    return await cLOCKER.voteEndPeriod();
}


//EVENT
export async function subscribeToCreateDelta(token) {
    if (token == '') {
        token = cTOKEN.address;
    } else {
        token = token.join(', ');
    }
    subscribe([cLOCKER.address, 'CreateDelta', 'address indexed, address indexed, uint indexed', 'token, contract, ID', token])
}
export async function subscribeToStake() {
    subscribe([cSTAKE.address, 'Stake', 'address indexed, uint', 'wallet, wei staked', ''])
}
export async function subscribe(inputParams) { //no menu close when unbypassed?
    //contractAddress, eventName, paramsTypes, paramNames, filterValues
    let contractAddress = inputParams[0];
    let params = inputParams[1] + '(';
    let paramTypes = inputParams[2];
    let paramTypesList = paramTypes.split(", ");
    let paramNames = inputParams[3];
    let filterValuesList = [];
    if (inputParams[4] == '') {
        filterValuesList[0] = 'null';
    } else {
        filterValuesList = inputParams[4].split(", ");
    }
    let bytesList = [];
    for (let i=0; i < filterValuesList.length; i++) {
        if (!(filterValuesList[i][0] == '0' && filterValuesList[i][1] == 'x')) {
            filterValuesList[i] = ethers.utils.formatBytes32String(filterValuesList[i]);
        }
        bytesList.push(ethers.utils.hexZeroPad(filterValuesList[i], 32));
    }

    for (let i=0; i < paramTypesList.length; i++) {
        params += paramTypesList[i];
        if (i != paramTypesList.length-1) {params += ', ';}
    }
    params += ')';  

    if (await verifyEvent(contractAddress, params) || bypassMode) {
        let r = await cEVENT.subscribeEvent(contractAddress, params, paramNames, bytesList, await getGasObj());
        await r.wait();
        console.log(r);
        await getEventPing();
    } else {
        alert("WARNING: events not verified on bscscan. Press 'ctrl + b' or click the 'B' button to enter bypass mode.");
    }   
}
export async function unsubscribe(inputParams) {
    let r = await cEVENT.unsubscribeEvent(inputParams[0], await getGasObj());
    await r.wait();
    console.log(r);
    await getEventPing();
}
async function verifyEvent(contractAddress, params) {
    let eventParams = 'event ' + params.split(', ').join(',');
    let fetch = (await ethers.utils.fetchJson('https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=' + contractAddress + '&apikey=NT2AZKZKAV7F2FS37245TEVHGVYJAXBYD4')).result; //change on mainnet?
    if (fetch != 'Contract source code not verified') {
        const iface = new ethers.utils.Interface(fetch);
        const abi = iface.format('minimal');
        if (abi.includes(eventParams)) {
            return true;
        }
    }
    return false;
}
export async function getEventCount() {
    return await cEVENT.eventCount(wallet._address);
}
export async function isUnsubscribed(id) {
    return cEVENT.isUnsubscribed_wallet_id(wallet._address, id);
}
export async function getEventParamNames(id) {
    let p = (await cEVENT.events_wallet_id(wallet._address, id)).paramNames;
    return p;
}

//HEX
export async function getApproveHex(token, block, blocksPerRequest) {
    let abi = 'Approval(address indexed, address indexed, uint)';
    let filterInput = getEventFilterInput(token, abi, [ethers.utils.hexZeroPad(wallet._address, 32)]);
    let currentBlock = await getBlock();
    if (block == '' || block >= currentBlock) {block = currentBlock;}
    loopEventBlock = +block;

    let contract = new ethers.Contract(token, ['event ' + abi], wallet);
    hexBreak = false;

    let outputs = await loopEventFilter(contract, filterInput, blocksPerRequest);
    if (outputs.length != 0) {     
        loopEventBlock = outputs[0].blockNumber - 1;
        document.getElementsByClassName('hexFilter')[1].value = loopEventBlock;
    }

    let allowancesPromises = [];
    let allowances = [];
    let usedContracts = [];
    for (let i=outputs.length-1; i >= 0; i--) {
        allowancesPromises.push(allowance([outputs[i].args[1], token]));
        usedContracts.push(outputs[i].args[1]);
    }
    allowances = await Promise.all(allowancesPromises);
    return [usedContracts, allowances];
}
export async function getLockerHex(token, page) {
    let perPage = 5;
    let idsPromises = [];
    let deltasPromises = [];
    let ids = [];
    let deltas = []
    let contracts = [];
    let epochs = [];
    let idLength = await cLOCKER.idLength_token(token);
    let j = 0;
    for (let i=idLength-page*perPage-1; j < perPage && i >= 0; i--) {
        idsPromises.push(cLOCKER.ids_token(token, i));
        j++;
    }
    ids = await Promise.all(idsPromises);
    for (let k=0; k < idsPromises.length; k++) {
        deltasPromises.push(getDelta(ids[k]));
    }
    deltas = await Promise.all(deltasPromises);
    for (let k=0; k < idsPromises.length; k++) {
        contracts.push(deltas[k].contractAddress);
        epochs.push(deltas[k].epoch);
    }
    return [ids, contracts, epochs];
}
export async function getSaleHex(filter, page) {
    let perPage = 5;
    let names = [];
    let contracts = [];
    let types = [];

    let lengths = await Promise.all([
        cSALE.userSalesLength(wallet._address),
        cSALE.userPurchasesLength(wallet._address),
        cSALE.userLiquiditiesLength(wallet._address)
    ]);

    let iS = lengths[0]-1 - page*perPage;
    let iB = lengths[1]-1 - page*perPage;
    let iL = lengths[2]-1 - page*perPage;
    let j = 0;
    try {
        let contractsPromises = [];
        if (filter == 'sell' || filter == '') {
            while (j < perPage && iS >= 0) {
                contractsPromises.push(cSALE.userSales(wallet._address, iS));
                types.push('sell');
                iS--;
                j++;
            }
        }
        if (filter == 'buy' || filter == '') {
            while (j < perPage && iB >= 0) {
                contractsPromises.push(cSALE.userPurchases(wallet._address, iB));
                types.push('buy');
                iB--;
                j++;
            }
        }
        if (filter == 'lock' || filter == '') {
            while (j < perPage && iL >= 0) {
                contractsPromises.push(cSALE.userLiquidities(wallet._address, iL));
                types.push('lock');
                iL--;
                j++;
            }
        }
        contracts = await Promise.all(contractsPromises);
    
        let namesPromises = [];
        for (let i = 0; i < contracts.length; i++) {
            let cERC = new ethers.Contract(contracts[i], abi_erc20, wallet);
            namesPromises.push(cERC.symbol());
        }
        names = await Promise.all(namesPromises);
    } catch (e) {
        console.log(e);
    }
    return [names, contracts, types];
}
export async function getEventHex(id, block, blocksPerRequest) {
    let evntPromise = cEVENT.events_wallet_id(wallet._address, id);
    let filterValuesPromise = cEVENT.getFilterValues(id);
    let currentBlock = await getBlock();
    if (block == '' || block >= currentBlock) {block = currentBlock;}
    loopEventBlock = +block;
    
    let evnt = await evntPromise;
    if (evnt.length == 0) {
        return null;
    }

    let contract = new ethers.Contract(evnt.contractAddress, ['event ' + evnt.abi_], wallet);
    let filterInput = getEventFilterInput(evnt.contractAddress, evnt.abi_, await filterValuesPromise);
    let outputs = await loopEventFilter(contract, filterInput, blocksPerRequest);
    if (outputs.length != 0) {
        let min = 0;
        for (let i=0; i < outputs.length; i++) {
            if (outputs[i].blockNumber < min || min == 0) {
                min = outputs[i].blockNumber - 1;
            }
        }
        loopEventBlock = min;
        document.getElementsByClassName('hexFilter')[1].value = loopEventBlock;
        return outputs;
    }
    return null;
}
export async function getEventPing() {
    let eventCount = await getEventCount();
    let eventsPromises = [];
    let filterValuesPromises = [];
    let ids = [];
    let unsubListPromises = [];
    for (let i=1; i <= eventCount; i++) {
        unsubListPromises.push(isUnsubscribed(i));
    }
    let unsubList = await Promise.all(unsubListPromises);

    for (let i=1; i <= eventCount; i++) {
        if (!unsubList[i-1]) {
            eventsPromises.push(cEVENT.events_wallet_id(wallet._address, i));
            filterValuesPromises.push(cEVENT.getFilterValues(i));
            ids.push(i);
        }
    }
    let events = await Promise.all(eventsPromises);
    let filterValues = await Promise.all(filterValuesPromises);

    for (let i=0; i < events.length; i++) {
        if (events[i].length == 0) {
            events.splice(i, 1);
            filterValues.splice(i, 1);
            ids.splice(i, 1);
            i--;
        } else if (events[i].contractAddress == '0x0000000000000000000000000000000000000000') {
            events.splice(i, 1);
            filterValues.splice(i, 1);
            ids.splice(i, 1);
            i--;
        } else {
            let contract = new ethers.Contract(events[i].contractAddress, ['event ' + events[i].abi_], wallet);
            let filterInputs = getEventFilterInput(events[i].contractAddress, events[i].abi_, filterValues[i]);
            provider.removeAllListeners(filterInputs);

            contract.on(filterInputs, (...args) => {
                let eHexRow = document.getElementsByClassName('hexRow');
                let tr = document.createElement("tr");
                let tdID = document.createElement("td");
                let tdEvent = document.createElement("td");
                let tdBlock = document.createElement("td");
                let tdHash = document.createElement("td");
                tr.setAttribute("class", 'hexRow');
                tdID.setAttribute("class", 'hexCenter');
                tdBlock.setAttribute("class", 'hexRight');
                tdHash.setAttribute("class", 'hexCenter');
                tdHash.setAttribute("style", 'font-size: 1px');
                tdID.innerHTML = ids[i];
                tdEvent.innerHTML = args[args.length-1].event;
                tdBlock.innerHTML = args[args.length-1].blockNumber.toLocaleString("en-US").split(',').join(' ');
                tdHash.innerHTML = args[args.length-1].transactionHash;
                document.getElementsByClassName('hexTable')[3].appendChild(tr); //hardcode
                eHexRow[eHexRow.length-1].appendChild(tdID);
                eHexRow[eHexRow.length-1].appendChild(tdEvent);
                eHexRow[eHexRow.length-1].appendChild(tdBlock);
                eHexRow[eHexRow.length-1].appendChild(tdHash);
                hexRowAdd();
            });
        }
    }
    console.log(events);
}
function getEventFilterInput(contractAddress, abi, bytesList) { //multiple transfers in same block appear as one? //issue?
    let contract = new ethers.Contract(contractAddress, ['event ' + abi], wallet);
    let eventName = abi.split(' ')[0].split('(')[0];
    let filterFunction = 'contract.filters.' + eventName;
    let filterCall = [];
    
    for (let i=0; i < bytesList.length; i++) {
        if (bytesList[i][2] != '0') { //string
            if (bytesList[i] == '0x6e756c6c00000000000000000000000000000000000000000000000000000000') {
                filterCall.push(null);
            } else {
                filterCall.push(ethers.utils.parseBytes32String(bytesList[i]));
            }
        } else { //address, uint
            filterCall.push(ethers.utils.hexStripZeros(bytesList[i]).toString());
        }
    }
    return eval(filterFunction)(...filterCall);
}
async function loopEventFilter(contract, filterInput, blocksPerRequest) { //reloop after too many rpc requests?
    let isLoop = false;
    if (blocksPerRequest > 100) {
        isLoop = true;
    }
    let outputs = [];
    if (!bypassMode) {
        outputs = await contract.queryFilter(filterInput, loopEventBlock-blocksPerRequest, loopEventBlock);
        loopEventBlock -= blocksPerRequest;
        document.getElementsByClassName('hexFilter')[1].value = loopEventBlock;
        if (hexBreak) {
            hexBreak = false;
            return [];
        }
        if (outputs.length == 0 && isLoop) {
            try {
                outputs = await loopEventFilter(contract, filterInput, blocksPerRequest);
            } catch {
                throw('query paused');
            }
        }
    } else {
        let j=0;
        let outputssPromises = [];
        await delay(1000);
        while(j < 36) {
            let p = contract.queryFilter(filterInput, loopEventBlock-blocksPerRequest, loopEventBlock);
            loopEventBlock -= blocksPerRequest;
            document.getElementsByClassName('hexFilter')[1].value = loopEventBlock;
            outputssPromises.push(p);
            j++;
        }
        let outputss = await Promise.all(outputssPromises);
        for (let i=0; i < outputss.length; i++) {
            if (outputss[i].length == 0) {
                outputss.splice(i, 1);
                i--;
            } else {
                outputs.push(...outputss[i]);
            }
        }
        if (hexBreak) {
            hexBreak = false;
            return [];
        }
        if (outputs.length == 0 && isLoop) {
            try {
                outputs = await loopEventFilter(contract, filterInput, blocksPerRequest);
            } catch {
                throw('query paused');
            }
        }
    }    
    return outputs;
}

//TESTS
export async function testAll() {
    let dNonce = await provider.getTransactionCount(wallet._address);
    console.log('START...');
    try {
        // await deploy();
        // await setupContractDependencies();
        // loadContracts();

        await approve(['10000000', cSTAKE.address, cTOKEN.address]);
        await stake(['10']);

        // await approve(['10000000', cSALE.address, cTOKEN.address]);
        // await approve(['10000000', cSALE.address, WETH]);
        // await addIgnoreFee(cSALE.address);
        // await newSale(['100', cTOKEN.address, WETH, swapRouter, '80', '10']);
        // await joinSale(['0.00001', cTOKEN.address, WETH]);
        // let weiB = await cSALE.getBalanceOfTokens(cTOKEN.address);
        // let weiS = await cSALE.getWeiSale(cTOKEN.address);
        // let w0 = weiB[0] - weiS[0]; //tokens in contract - tokens in struct
        // let w1 = weiB[1] - weiS[1]; //WETH in contract - WETH in struct
        // console.log('weiDiff:', w0, w1);
        // await endSale([cTOKEN.address]);
        // await claimSale([cTOKEN.address]);

        // await approve(['10000000', cLOCKER.address, cTOKEN.address]);
        // await addIgnoreFee(cLOCKER.address); 
        // await tokenOwnershipToLocker([cTOKEN.address, cTOKEN.address]);
        // await tokenOwnershipToLocker([cLOCKER.address, cTOKEN.address]);
        // await createAndExecuteDelta(cTOKEN.address, 'balanceOf', 'address', '0xfFEd77aD4A4FbCB255eBb9Ba40de4430Df34E7E4', 'uint');
        // await createAndExecuteDelta(cLOCKER.address, 'setStakeVotePercent', 'uint', '10000', '');
        // await createAndExecuteDelta(cLOCKER.address, 'transferOwnership', 'address', wallet._address, '');
        // // await toggleAndExecuteDelta(cTOKEN.address);

        // await subscribe([cLOCKER.address, 'CreateDelta', 'address indexed, address indexed, uint indexed', 'token, contract, ID', cTOKEN.address]);
        // await subscribe([cLOCKER.address, 'ExecuteDelta', 'address indexed, address indexed, uint indexed, bytes', 'token,contract,ID,bytes', cTOKEN.address + ',' + cTOKEN.address]); 
        // await subscribe([cAFFILIATE.address, 'SetupAffiliate', 'address indexed, address indexed', 'token, wallet', cTOKEN.address]);
        // await subscribe([cSTAKE.address, 'Stake', 'address indexed, uint', 'wallet, wei', wallet._address]);
        // await subscribe([cSALE.address, 'NewSale', 'address indexed, uint_indexed, uint', 'tokenSale,%LP,duration', cTOKEN.address]);
        // await subscribe([cSALE.address, 'EndSale', 'address indexed, uint, uint', 'tokenSale, weiToLiquidity, weiToWallet', cTOKEN.address]);
        // await subscribe([cSALE.address, 'UnlockLiquidity', 'address indexed, uint, uint', 'tokenSale ,weiToWallet, weiFee', cTOKEN.address]);
        // await subscribe([cAFFILIATE.address, 'AffiliateDistribution', 'address indexed, address indexed, address indexed, uint', 'token,affiliate,wallet,weiIn', cTOKEN.address]);
        // await subscribe([cEVENT.address, 'SubscribeEvent', 'address indexed, address indexed', 'contract, wallet', 'null, ' + wallet._address]);
        await subscribe([WETH, 'Approval', 'address indexed, address indexed, uint256', 'wallet, contract, wei', '']);

        // await stake(['100']);
        // await transfer('100', wallet2.address);

        // //error below? enable affiliate before unlock
        // await unlockLiquidity([cTOKEN.address]);
        // await unstake();
        

    } catch (e) {
        console.log(e);
    }
    dNonce = await provider.getTransactionCount(wallet._address) - dNonce;
    console.log(dNonce);
}

export function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export function setHexBreak(boo) {
    hexBreak = boo;
}
