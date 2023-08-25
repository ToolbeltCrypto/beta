import { testAll, setTax, approve, stake, unstake, claimStake, newSale, joinSale, endSale, claimSale, unlockLiquidity, getUserStake, getTotalStake, getTotalSupply, getTotalRewards, getUserRewards, getUnstakePayout, allowance, balanceOf, setupAffiliate, getConnections, getTokensEarned, getMostConnections, getMostTokensEarned, getAffiliate, getBalancePair, getSale, getTime, getUnlockablePercentage, tokenOwnershipToLocker, createDelta, executeDelta, voteDelta, toggleDelta, getDelta, getParamValues, getReturnValues, getLockerHex, getSaleHex, cTOKEN, cSTAKE, cSALE, cAFFILIATE, cLOCKER, cEVENT, WETH, getTokenVote, getCreationCost, subscribe, unsubscribe, getEventHex, getBlock, getEventCount, getEventParamNames, getEventPing, getApproveHex, getTokenName, connectWallet, hexBreak, setHexBreak, isUnsubscribed, getTransaction, delay, getVoteDuration, unapprove, subscribeToCreateDelta, subscribeToStake, addChain, connectWalletMobile } from './chain.js';
import { ethers } from "ethers";
var menuSubmitFunction;
var currentZone = 'Home';
export var bypassMode = false;
var isHexLooping = false;
var hexMap = new Map();
var hexPage = 0;
var hexPageSign = -1;
var hexRow = 0;

//replace toolbelt with new name in all files?
function handleError(error) {
    if (error.reason != undefined) {
        let eSplit = error.reason.split(' ');
        if (eSplit.includes('provider')) {
            alert('Connect wallet to access the blockchain.');
        } else {
            alert('ERROR: ' + error.reason);
        } 
    } else if (error.message != undefined) {
        let eSplit = error.message.split(' ');
        if (eSplit.includes('status')) {
            alert('Too many requests. Wait and try again.');
        } else if (eSplit.includes('undefined')) {
            alert('Connect wallet to access the blockchain.');
        } else {
            alert('ERROR: ' + error.message);
        }
    } else {
        let eSplit = error.toString().split(' ');
        if (eSplit.includes('undefined')) {
            alert('Connect wallet to access the blockchain.');
        } else {
            alert(error.toString());
        }
    }
    console.log(error);
}

function findInputs(className) {
    let inputs = document.getElementsByClassName(className);
    let inputValues = [];
    for (let i=0; i < inputs.length; i++) {
        inputValues.push(inputs[i].value);
    }
    return inputValues;
}
function removeElements(className) {
    while (document.getElementsByClassName(className).length > 0) {
        document.getElementsByClassName(className)[0].remove();
    }
}
function displayElements(className, display) {
    for (let i=0; i < document.getElementsByClassName(className).length; i++) {
        document.getElementsByClassName(className)[i].style.display = display;
    }
}

document.addEventListener('keypress', (k) => {
    if(k.key == 'Enter') {
        k.preventDefault();
        k.target.click();
    }
});

//BYPASS
function toggleBypass() {
    if (bypassMode) {
        console.log('INACTIVE: idiotproof bypass');
        bypassMode = false;
        document.querySelector('html').style.setProperty('filter', 'hue-rotate(0deg)');
    } else {
        console.log('ACTIVE: idiotproof bypass');
        bypassMode = true;
        document.querySelector('html').style.setProperty('filter', 'hue-rotate(90deg)');
    }
}
document.getElementById('toggleBypass').addEventListener("click", () => {toggleBypass()});
document.addEventListener('keypress', (k) => {
    if(k.ctrlKey && k.key == '\x02') { //ctrl + b
        k.preventDefault();
        toggleBypass();
    }
});

function setupToggleDisplay(wrap) {
    let eWrap = document.getElementsByClassName(wrap);
    for (let i=0; i < eWrap.length; i++) {
        eWrap[i].addEventListener("click", () => {
            let eWrapToggle = eWrap[i].children[1];
            if (eWrapToggle != undefined) {
                if (eWrapToggle.style.display == '') {
                    eWrapToggle.style.display = 'block';
                } else {
                    eWrapToggle.style.display = '';
}}})}}

//NAV
function displayZone(newZone) {
    statsClose();
    hexClose();
    menuClose();
    currentZone = newZone;
    displayElements('zone', 'none');
    displayElements('video', 'initial');
    document.getElementById('zone' + currentZone).style.display = 'block';
    document.getElementById('subscribeToContainer').style.display = 'none';

}
async function selectWallet(func) {
    document.getElementById('connectWallet').innerHTML = 'CONNECTING';
    let isConnected = await func();

    if (isConnected) {
        //rejected metamask connection request still says connected?
        document.getElementById('connectWallet').innerHTML = 'CONNECTED';
    } else {
        document.getElementById('connectWallet').innerHTML = 'CONNECT WALLET';
    }
}
document.getElementById('connectWalletBrowser').addEventListener("click", async() => {
    selectWallet(connectWallet);
});
document.getElementById('connectWalletMoblie').addEventListener("click", async() => {
    selectWallet(connectWalletMobile);
});

let eLinkTest = document.getElementsByName('linkTest');
let eLinkHome = document.getElementsByName('linkHome');
let eLinkSocial = document.getElementsByName('linkSocial');
let eLinkSale = document.getElementsByName('linkSale');
let eLinkStake = document.getElementsByName('linkStake');
let eLinkApprove = document.getElementsByName('linkApprove');
let eLinkAffiliate = document.getElementsByName('linkAffiliate');
let eLinkLocker = document.getElementsByName('linkLocker');
let eLinkEvent = document.getElementsByName('linkEvent');
eLinkTest.forEach((e) => {e.addEventListener("click", () => {
    displayZone('Test');
    document.getElementById('toggleHex').style.display = 'none';
    document.getElementById('toggleStats').style.display = 'none';
})});
eLinkHome.forEach((e) => {e.addEventListener("click", () => {
    displayZone('Home');
    document.getElementById('toggleHex').style.display = 'none';
    document.getElementById('toggleStats').style.display = 'none';
})});
eLinkSocial.forEach((e) => {e.addEventListener("click", () => {
    displayZone('Social');
    document.getElementById('toggleHex').style.display = 'none';
    document.getElementById('toggleStats').style.display = 'none';
})});
eLinkSale.forEach((e) => {e.addEventListener("click", () => {
    displayZone('Sale');
    document.getElementById('toggleHex').style.display = 'flex';
    document.getElementById('toggleStats').style.display = 'flex';
})});
eLinkStake.forEach((e) => {e.addEventListener("click", () => {
    displayZone('Stake');
    document.getElementById('toggleHex').style.display = 'none';
    document.getElementById('toggleStats').style.display = 'flex';
})});
eLinkApprove.forEach((e) => {e.addEventListener("click", () => {
    displayZone('Approve');
    document.getElementById('toggleHex').style.display = 'flex';
    document.getElementById('toggleStats').style.display = 'flex';
})});
eLinkAffiliate.forEach((e) => {e.addEventListener("click", () => {
    displayZone('Affiliate');
    document.getElementById('toggleHex').style.display = 'none';
    document.getElementById('toggleStats').style.display = 'flex';
})});
eLinkLocker.forEach((e) => {e.addEventListener("click", () => {
    displayZone('Locker');
    document.getElementById('toggleHex').style.display = 'flex';
    document.getElementById('toggleStats').style.display = 'flex';
})});
eLinkEvent.forEach((e) => {e.addEventListener("click", () => {
    displayZone('Event');
    document.getElementById('toggleHex').style.display = 'flex';
    document.getElementById('toggleStats').style.display = 'flex';
})});

//MENU
function menuOpen(placeholders, title, description) {
    menuClose();
    displayElements('video', 'none');
    document.getElementById('menuContainer').style.display = 'block';
    document.getElementById('menuTitle').innerHTML = title;
    document.getElementById('menuDescription').innerHTML = description;
    for (let i=0; i < placeholders.length; i++) {
        let mI = document.createElement("input");
        mI.setAttribute("type", 'text');
        mI.setAttribute("class", 'menuInput');
        mI.setAttribute("placeholder", placeholders[i]);
        document.getElementById('menuForm').appendChild(mI);
    }
}
function menuClose() {
    removeElements('menuInput');
    document.getElementById('menuContainer').style.display = 'none';
}
document.getElementById('menuSubmit').addEventListener("click", async(e) => {
    e.preventDefault();
    let innerPrevious = document.getElementById('menuSubmit').innerHTML;
    let paddingPrevious = document.getElementById('menuSubmit').style.padding;
    document.getElementById('menuSubmit').style.padding = '16px 9px';
    document.getElementById('menuSubmit').innerHTML = 'APPROVING';
    try {
        await allowanceCheck();
        document.getElementById('menuSubmit').style.padding = '16px 9px';
        document.getElementById('menuSubmit').innerHTML = 'PROCESSING';
        await menuSubmitFunction(findInputs('menuInput'));
        menuClose();
    } catch (e) {
        handleError(e);
    }
    document.getElementById('menuSubmit').style.padding = paddingPrevious;
    document.getElementById('menuSubmit').innerHTML = innerPrevious;
});
document.getElementById('menuCancel').addEventListener("click", (e) => {e.preventDefault(); menuClose();});


//ALLOWANCE
async function allowanceCheck() {
    let approveInputParams = [];
    let menuInputParams = findInputs('menuInput');
    if (menuSubmitFunction == stake) {
        approveInputParams = [menuInputParams[0], cSTAKE.address, cTOKEN.address];
    } else if (menuSubmitFunction == newSale) {
        approveInputParams = [menuInputParams[0], cSALE.address, cTOKEN.address];
    } else if (menuSubmitFunction == joinSale) {
        approveInputParams = [menuInputParams[0], cSALE.address, WETH];
    } else if (menuSubmitFunction == createDelta || menuSubmitFunction == toggleDelta) {
        approveInputParams = [ethers.utils.formatEther(await getCreationCost(menuInputParams[0])), cLOCKER.address, cTOKEN.address];
    } else {
        return;
    }
    if (await allowance(approveInputParams.slice(1)) - ethers.utils.parseEther(approveInputParams[0]) < 0) {
        await approve(approveInputParams);
    }
}


//STATS
function toggleStats() {
    if (document.getElementById('toggleStats').innerHTML == 'X') {
        statsClose();
    } else {
        statsOpen();
    }
}
function statsOpen() {
    displayElements('video', 'none');
    document.getElementById('toggleStats').innerHTML = 'X';
    document.getElementById('statsContainer').style.display = 'block';
    try {document.getElementById('stats' + currentZone).style.display = 'block';} catch {}
    statsUpdate();
}
function statsClose() {
    document.getElementById('toggleStats').innerHTML = '&#128794;';
    document.getElementById('statsContainer').style.display = 'none';
    try{document.getElementById('stats' + currentZone).style.display = 'none';} catch {}
}
async function statsUpdate() {
    try {
        if (currentZone == 'Stake') {
            let userStake = await getUserStake();
            let userRewards = await getUserRewards();
            let totalSupply = await getTotalSupply();
            let totalStake = await getTotalStake();
            let totalRewards = await getTotalRewards();
            let unstakePayout = await getUnstakePayout();
            document.getElementById('stakePerSupply').style.setProperty("--deg", (100*totalStake/totalSupply).toFixed() + '%');
            document.getElementById('stakePerTotal').style.setProperty('--deg', (100*userStake/totalStake).toFixed() + '%');
            document.getElementById('timeLeft').style.setProperty('--deg', (100*unstakePayout/userStake).toFixed() + '%');
            document.getElementById('rewardsPerTotal').style.setProperty('--deg', (100*userRewards/totalRewards).toFixed() + '%');
            document.getElementById('stakeTotal').innerHTML = (+ethers.utils.formatEther(totalStake)).toExponential(2) + ' tokens';
            document.getElementById('stakeUser').innerHTML = (+ethers.utils.formatEther(userStake)).toExponential(2) + ' tokens';
            document.getElementById('unstakableUser').innerHTML = (+ethers.utils.formatEther(unstakePayout)).toExponential(2) + ' tokens';
            document.getElementById('rewardsUser').innerHTML = (+ethers.utils.formatEther(userRewards)).toExponential(2) + ' tokens';
        
        }
    } catch (e) {
        handleError(e);
    }
}
async function statsView() {
    let inputParams;
    try {
        inputParams = findInputs('statsInput' + currentZone);
        if (currentZone == 'Sale') {
            let sale = await getSale(inputParams[0]);
            let weiPair = sale.weiPair;
            let balancePair = await getBalancePair(inputParams[0]);
            let lpPercent = sale.percentIntoLiquidity;
            let timeLength = sale.endTime - sale.startTime;
            let timeLeft = sale.endTime - await getTime();
            let unlockable;
            try { unlockable = await getUnlockablePercentage(inputParams[0]);
            } catch {unlockable = 0;}
            if (timeLeft < 0) {timeLeft = 0;}
            document.getElementById('balancePerTotalPair').style.setProperty("--deg", (100*balancePair/weiPair).toFixed() + '%');
            document.getElementById('liquidityPercentChart').style.setProperty("--deg", lpPercent + '%');
            document.getElementById('saleTime').style.setProperty("--deg", (100*timeLeft/timeLength).toFixed() + '%');
            document.getElementById('unlockablePercentChart').style.setProperty("--deg", unlockable + '%');
            document.getElementById('totalPair').innerHTML = (+ethers.utils.formatEther(weiPair)).toExponential(2) + ' tokens';
            document.getElementById('liquidityPercent').innerHTML = lpPercent + '%';
            document.getElementById('saleTimeLeft').innerHTML = (timeLeft / 3600).toFixed(2) + ' hours';
            document.getElementById('unlockablePercent').innerHTML = unlockable + '%';
        } else if (currentZone == 'Approve') {
            let al = await allowance(inputParams);
            let balance = await balanceOf(inputParams[1]);
            if (balance == 0) {balance = 1;}
            document.getElementById('allowancePerBalance').style.setProperty("--deg", (100*al/balance).toFixed() + '%');
            document.getElementById('allowanceUser').innerHTML = (+ethers.utils.formatEther(al)).toExponential(2) + ' tokens';
        } else if (currentZone == 'Affiliate') {
            if (inputParams[0] == '') {inputParams[0] = cTOKEN.address;}
            let connectionsUser = await getConnections(inputParams[0]);
            let tokensEarnedUser = await getTokensEarned(inputParams[0]);
            let connectionsMost = await getMostConnections(inputParams[0]);
            let tokensEarnedMost = await getMostTokensEarned(inputParams[0]);
            let referrer = await getAffiliate(inputParams[0]);
            let hasAffiliate = 1;
            if (referrer == 0x0) {
                hasAffiliate = 0;
                referrer = 'empty';
            }
            document.getElementById('connectionsPerMost').style.setProperty("--deg", (100*connectionsUser/connectionsMost).toFixed() + '%');
            document.getElementById('tokensEarnedPerMost').style.setProperty("--deg", (100*tokensEarnedUser/tokensEarnedMost).toFixed() + '%');
            document.getElementById('hasAffiliate').style.setProperty("--deg", (100*hasAffiliate).toFixed() + '%');
            document.getElementById('connectionsUser').innerHTML = connectionsUser + ' wallets';
            document.getElementById('tokensEarnedUser').innerHTML = (+ethers.utils.formatEther(tokensEarnedUser)).toExponential(2) + ' tokens';
            document.getElementById('referrer').innerHTML = referrer;
        } else if (currentZone == 'Locker') {
            let id = inputParams[0];
            let delta = await getDelta(id);
            let functionValues = await getParamValues(id);
            let voteDuration = await getVoteDuration();
            let voteTotal = delta.voteYay.add(delta.voteNay);
            let voteTimeLeft = delta.epoch.add(voteDuration).sub(await getTime());
            if (voteTimeLeft < 0) {voteTimeLeft = 0;}
            if (delta.executionDone) {
                try {
                    let returnValues = await getReturnValues(id);
                document.getElementById('lockerReturnCircle').style.setProperty("--deg", (360*delta.executionDone).toFixed() + '%');
                document.getElementById('lockerReturn').innerHTML = '(' + returnValues.toString().replace(/,/g, ', ') + ')';
                } catch {
                    document.getElementById('lockerReturnCircle').style.setProperty("--deg", '0%');
                    document.getElementById('lockerReturn').innerHTML = 'Invalid return types, Execution complete';
                }
            } else {
                document.getElementById('lockerReturnCircle').style.setProperty("--deg", '0%');
                document.getElementById('lockerReturn').innerHTML = 'Wait for execution';
            }
            
            document.getElementById('voteYayPerTotal').style.setProperty("--deg", (100*delta.voteYay/voteTotal).toFixed() + '%');
            document.getElementById('voteTimePerTotal').style.setProperty("--deg", (100*(1-voteTimeLeft/voteDuration)).toFixed() + '%');
            document.getElementById('lockerContractCircle').style.setProperty("--deg", (360*delta.executionDone).toFixed() + '%');
            document.getElementById('lockerFunctionCircle').style.setProperty("--deg", (360*delta.executionDone).toFixed() + '%');
            document.getElementById('lockedContract').innerHTML = delta[0];
            document.getElementById('functionName').innerHTML = delta[1];
            document.getElementById('functionValues').innerHTML = '(' + functionValues.toString().replace(/,/g, ', ') + ')';
            document.getElementById('votePercent').innerHTML = (100*delta.voteYay/voteTotal).toFixed() + '%';
            document.getElementById('voteTime').innerHTML = (voteTimeLeft / 60).toFixed() + ' minutes';
        } else if (currentZone == 'Event') {
            if (isHexLooping) {
                alert('WARNING: stop searching first.');
                return;
            }
            let paramNamesPromise = getEventParamNames(inputParams[0]);
            let currentBlock = await getBlock();
            let block = (await getTransaction(inputParams[1])).blockNumber;
            let output = [];
            try {
                let hex = await getEventHex(inputParams[0], block, 1);
                console.log(hex);
                for (let i=0; i < hex.length; i++) {
                    if (hex[i].transactionHash == inputParams[1]) {
                        output = hex[i];
                        break;
                    }
                }
                console.log(output);
                document.getElementById('eventBlock').innerHTML = block.toLocaleString("en-US").split(',').join(' ');
                document.getElementById('eventBlockCircle').style.setProperty('--deg', 100*(1-(currentBlock-block)/currentBlock).toFixed() + '%');
                document.getElementById('eventSignature').innerHTML = output.event + ' (' + await paramNamesPromise + ')';
                document.getElementById('eventValues').innerHTML = output.args.slice('').join(', \n');
                document.getElementById('eventSignatureCircle').style = "background-color: var(--color1);";
                document.getElementById('eventValuesCircle').style = "background-color: var(--color1);";
            } catch(e) {
                document.getElementById('eventBlock').innerHTML = block.toLocaleString("en-US").split(',').join(' ');
                document.getElementById('eventBlockCircle').style.setProperty('--deg', 100*(1-(currentBlock-block)/currentBlock).toFixed() + '%');
                document.getElementById('eventSignature').innerHTML = '';
                document.getElementById('eventValues').innerHTML = '';
                document.getElementById('eventSignatureCircle').style = "background-color: var(--white);";
                document.getElementById('eventValuesCircle').style = "background-color: var(--white);";
                alert('ERROR: match subscription # to transaction hash');
            }
            
        }
    } catch (e) {
        handleError(e)
    }
}
document.getElementById('toggleStats').addEventListener("click", () => {toggleStats();});;
let statsViewElements = document.getElementsByClassName('statsView');
for (let i = 0; i < statsViewElements.length; i++) {
    statsViewElements[i].addEventListener("click", async(a) => {a.preventDefault(); document.getElementsByClassName('statsView')[i].innerHTML = 'QUERYING'; await statsView(); document.getElementsByClassName('statsView')[i].innerHTML = 'VIEW';});
}


//HEX
export function hexRowAdd() {
    hexRow += 1;
}
function toggleHex() {
    if (document.getElementById('toggleHex').innerHTML == 'X') {
        hexClose();
    } else {
        hexOpen();
    }
}
function hexOpen() {
    displayElements('video', 'none');
    document.getElementById('toggleHex').innerHTML = 'X';
    document.getElementById('hexContainer').style.display = 'block';
    hexPage = 0;
    hexRow = 0;
    hexUpdate();
}
function hexClose() {
    setHexBreak(true);
    removeElements('hexRow');
    document.getElementById('toggleHex').innerHTML = '&#128824;';
    document.getElementById('hexContainer').style.display = 'none';
    hexMap.clear();
}
function hexUpdate() {
    displayElements('hexZone', 'none');
    if (currentZone == 'Approve') {
        document.getElementById('hexApprove').style.display = 'block';
        document.getElementById('hexFilterBreak').style.display = 'block';
        document.getElementsByClassName('hexFilter')[0].placeholder = 'Token with Approval';
        document.getElementsByClassName('hexFilter')[1].style.display = 'block';
    } else if (currentZone == 'Sale') {
        document.getElementById('hexSale').style.display = 'block';
        document.getElementById('hexFilterBreak').style.display = 'none';
        document.getElementsByClassName('hexFilter')[0].placeholder = 'Type: buy, sell, lock';
        document.getElementsByClassName('hexFilter')[1].style.display = 'none';
    } else if (currentZone == 'Locker') {
        document.getElementById('hexLocker').style.display = 'block';
        document.getElementById('hexFilterBreak').style.display = 'none';
        document.getElementsByClassName('hexFilter')[0].placeholder = 'Token for Delta';
        document.getElementsByClassName('hexFilter')[1].style.display = 'none';
    } else if (currentZone == 'Event') {
        document.getElementById('hexEvent').style.display = 'block';
        document.getElementById('hexFilterBreak').style.display = 'block';
        document.getElementsByClassName('hexFilter')[0].placeholder = '# of Subscription';
        document.getElementsByClassName('hexFilter')[1].style.display = 'block';
    }    
}
async function hexView() {
    let inputParams;
    let blocksPerRequest = 10000;
    document.getElementById('hexFilterButton').innerHTML = 'QUERYING';
    try {
        inputParams = findInputs('hexFilter');
        if (currentZone == 'Approve') {
            hexPage += hexPageSign;
            if (inputParams[0] == '') {inputParams[0] = cTOKEN.address;}
            let hex = await getApproveHex(inputParams[0], inputParams[1], blocksPerRequest);
            let name = await getTokenName(inputParams[0]);

            if (hex != null) {
                let contracts = hex[0];
                let allowances = hex[1];
                for (let i = hex[0].length-1; i >= 0; i--) {
                    if (!hexMap.get(contracts[i])) {
                        hexMap.set(contracts[i], true);
                        let eHexRow = document.getElementsByClassName('hexRow');
                        let tr = document.createElement("tr");
                        let tdName = document.createElement("td");
                        let tdContract = document.createElement("td");
                        let tdAllowance = document.createElement("td");
                        tr.setAttribute("class", 'hexRow');
                        tdName.setAttribute("class", 'hexCenter');
                        tdContract.setAttribute("class", 'hexCenter');
                        tdContract.setAttribute("name", 'checkContract');
                        tdContract.setAttribute("style", 'font-size: 7px;');
                        tdAllowance.setAttribute("class", 'hexCenter');
                        tdName.innerHTML = name;
                        tdContract.innerHTML = contracts[i];
                        tdAllowance.innerHTML = (+ethers.utils.formatEther(allowances[i].toString())).toExponential(2);
                        document.getElementsByClassName('hexTable')[0].appendChild(tr); //hardcode
                        eHexRow[eHexRow.length-1].appendChild(tdName);
                        eHexRow[eHexRow.length-1].appendChild(tdContract);
                        eHexRow[eHexRow.length-1].appendChild(tdAllowance);
                    }
                }
            }

        } else if(currentZone == 'Sale') {
            let hex = await getSaleHex(inputParams[0], hexPage);
            let names = hex[0];
            let contracts = hex[1];
            let types = hex[2];
            removeElements('hexRow');
            for (let i=0; i < hex[0].length; i++) {
                let tr = document.createElement("tr");
                let tdName = document.createElement("td");
                let tdContract = document.createElement("td");
                let tdType = document.createElement("td");
                tr.setAttribute("class", 'hexRow');
                tdContract.setAttribute("style", 'font-size: 7px;');
                tdType.setAttribute("class", 'hexRight');
                tdName.innerHTML = names[i];
                tdContract.innerHTML = contracts[i];
                tdType.innerHTML = types[i];
                document.getElementsByClassName('hexTable')[1].appendChild(tr); //hardcode
                document.getElementsByClassName('hexRow')[i].appendChild(tdName);
                document.getElementsByClassName('hexRow')[i].appendChild(tdContract);
                document.getElementsByClassName('hexRow')[i].appendChild(tdType);
            }
        } else if (currentZone == 'Locker') {
            if (inputParams[0] == '') {inputParams[0] = cTOKEN.address;}
            let hex = await getLockerHex(inputParams[0], hexPage);
            let currentTime = await getTime();
            let ids = hex[0];
            let contracts = hex[1];
            let epochs = hex[2];
            let costsPromises = [];
            let costs = [];
            for (let i=0; i < contracts.length; i++) {
                costsPromises.push(getCreationCost(contracts[i]));
            }
            costs = await Promise.all(costsPromises);
            
            removeElements('hexRow');
            for (let i=0; i < hex[0].length; i++) {
                let tr = document.createElement("tr");
                let tdID = document.createElement("td");
                let tdContract = document.createElement("td");
                let tdCost = document.createElement("td");
                let tdTime = document.createElement("td");
                tr.setAttribute("class", 'hexRow');
                tdID.setAttribute("class", 'hexCenter');
                tdContract.setAttribute("style", 'font-size: 7px;');
                tdCost.setAttribute("class", 'hexCenter');
                tdTime.setAttribute("class", 'hexCenter');
                tdID.innerHTML = ids[i];
                tdContract.innerHTML = contracts[i];
                tdCost.innerHTML = ethers.utils.formatUnits(costs[i], 18);
                tdTime.innerHTML = ((currentTime - epochs[i]) / 3600).toFixed(2); 
                document.getElementsByClassName('hexTable')[2].appendChild(tr); //hardcode
                document.getElementsByClassName('hexRow')[i].appendChild(tdID);
                document.getElementsByClassName('hexRow')[i].appendChild(tdContract);
                document.getElementsByClassName('hexRow')[i].appendChild(tdCost);
                document.getElementsByClassName('hexRow')[i].appendChild(tdTime);
            }
        } else if (currentZone == 'Event') {
            if (hexPage == 0) {
                hexPage = 1;
            }
            let hex;
            let id = hexPage;
            setHexBreak(false);
            while(true) {
                if (inputParams[0] != '') {
                    hexPage = inputParams[0];
                    hex = await getEventHex(inputParams[0], inputParams[1], blocksPerRequest);
                    setHexBreak(true);
                } else {
                    loopPage: do {
                        if (await isUnsubscribed(id)) {
                            hexPage += hexPageSign;
                        } else {break loopPage;}
                        id = hexPage;
                    } while(id > 0 && hexPage > 0);

                    try {
                        document.getElementsByClassName('hexFilter')[0].value = hexPage;
                        hex = await getEventHex(id, inputParams[1], blocksPerRequest);
                    } catch {}
                    setHexBreak(true);
                }

                if (hex != null) {
                    let outputs = hex;
                    console.log(outputs);
                    for (let i = outputs.length-1; i >= 0; i--) {
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
                        tdID.innerHTML = hexPage;
                        tdEvent.innerHTML = outputs[i].event;
                        tdBlock.innerHTML = outputs[i].blockNumber.toLocaleString("en-US").split(',').join(' ');
                        tdHash.innerHTML = outputs[i].transactionHash;
                        document.getElementsByClassName('hexTable')[3].appendChild(tr); //hardcode
                        document.getElementsByClassName('hexRow')[hexRow].appendChild(tdID);
                        document.getElementsByClassName('hexRow')[hexRow].appendChild(tdEvent);
                        document.getElementsByClassName('hexRow')[hexRow].appendChild(tdBlock);
                        document.getElementsByClassName('hexRow')[hexRow].appendChild(tdHash);
                        hexRow++;
                    }
                }
                if (hexBreak) {
                    setHexBreak(false);
                    break;
                }
            }
        }
    } catch(e) {
        if (e != 'query paused') {
            isHexLooping = false;
            handleError(e);
        }
        document.getElementsByClassName('hexFilter')[0].value = '';
        document.getElementsByClassName('hexFilter')[1].value = inputParams[1];
        document.getElementById('hexFilterButton').innerHTML = 'FILTER';
    }
    document.getElementById('hexFilterButton').innerHTML = 'FILTER';
    isHexLooping = false;

}
document.getElementById('toggleHex').addEventListener("click", () => {toggleHex();});
document.getElementById('hexFilterButton').addEventListener("click", async() => {
    if (!isHexLooping) {
        isHexLooping = true;
        hexPageSign = 1;
        await hexView();
    }
});
document.getElementById('hexNext').addEventListener("click", async() => {
    if (!isHexLooping) {
        isHexLooping = true;
        hexPageSign = 1;
        hexPage += Number(hexPageSign);
        document.getElementsByClassName('hexFilter')[0].value = '';
        document.getElementsByClassName('hexFilter')[1].value = '';
        removeElements('hexRow');
        hexRow = 0;
        hexMap.clear();
        await hexView();
    }
});
document.getElementById('hexPrevious').addEventListener("click", async() => {
    if (!isHexLooping) {
        isHexLooping = true;
        hexPageSign = -1;
        hexPage += hexPageSign;
        if (hexPage < 1) {hexPage = 0;}
        document.getElementsByClassName('hexFilter')[0].value = '';
        document.getElementsByClassName('hexFilter')[1].value = '';
        removeElements('hexRow');
        hexRow = 0;
        hexMap.clear();
        await hexView();
    }
});
document.getElementById('hexFilterBreak').addEventListener("click", async() => {
    setHexBreak(true);
    if (isHexLooping) {
        document.getElementById('hexFilterButton').innerHTML = 'PAUSING';
    }
});

//TEST ZONE
document.getElementById('test').addEventListener("click", async() => { await testAll(); });
document.getElementById('addChainTestBNB').addEventListener("click", async() => { await addChain('tBNB'); });


//SALE ZONE
document.getElementById('newSale').addEventListener("click", () => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Amount of tokens to Sell';
        placeholders[1] = 'Token address to Sell';
        placeholders[2] = 'Token address to Pair';
        placeholders[3] = 'Router address of Swap';
        placeholders[4] = 'Percent of sale into Liquidity';
        placeholders[5] = 'Duration of sale in Seconds';
        menuOpen(placeholders, 'NEW SALE', 'Create a presale pair.');
        menuSubmitFunction = newSale;
    } else {
        menuClose();
    }
});
document.getElementById('joinSale').addEventListener("click", () => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Amount of tokens to Exchange';
        placeholders[1] = 'Token address to Buy';
        placeholders[2] = 'Token address to Exchange';
        menuOpen(placeholders, 'JOIN SALE', 'Buy a share of this presale.');
        menuSubmitFunction = joinSale;
    } else {
        menuClose();
    }
});
document.getElementById('endSale').addEventListener("click", () => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Token address of Sale';
        menuOpen(placeholders, 'END SALE', 'Complete the sale and add liquidity.');
        menuSubmitFunction = endSale;
    } else {
        menuClose();
    }
});
document.getElementById('claimSale').addEventListener("click", () => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Token address of Sale';
        menuOpen(placeholders, 'CLAIM SALE', 'Claim tokens after sale completion.');
        menuSubmitFunction = claimSale;
    } else {
        menuClose();
    }
});
document.getElementById('unlockLiquidity').addEventListener("click", () => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Token address of Lock';
        menuOpen(placeholders, 'UNLOCK LIQUIDITY', 'Remove liquidity from the swap pool.');
        menuSubmitFunction = unlockLiquidity;
    } else {
        menuClose();
    }
});


//STAKE ZONE
document.getElementById('stake').addEventListener("click", () => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Tokens to Stake';
        menuOpen(placeholders, 'STAKE', 'Lock tokens for 1 year to obtain revenue.');
        menuSubmitFunction = stake;    
    } else {
        menuClose();
    }
});
document.getElementById('unstake').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        menuOpen(placeholders, 'UNSTAKE', 'Unlock tokens and send fee to stakers.');
        menuSubmitFunction = unstake;        
    } else {
        menuClose();
    }
});
document.getElementById('claimStake').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        menuOpen(placeholders, 'CLAIM REWARDS', 'Collect staking rewards.');
        menuSubmitFunction = claimStake;
    } else {
        menuClose();
    }
});


//APPROVAL ZONE
document.getElementById('approve').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Amount of Tokens';
        placeholders[1] = 'Contract address to Allow';
        placeholders[2] = 'Token address to Approve';
        menuOpen(placeholders, 'APPROVE', 'Grant token access to a contract.');
        menuSubmitFunction = approve;
    } else {
        menuClose();
    }
});
document.getElementById('unapprove').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Contract address to Allow';
        placeholders[1] = 'Token address to Approve';
        menuOpen(placeholders, 'UNAPPROVE', 'Remove token access to a contract.');
        menuSubmitFunction = unapprove;
    } else {
        menuClose();
    }
});


//AFFILIATE ZONE
document.getElementById('setAffiliate').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Token address of Referral';
        placeholders[1] = 'Wallet address of Affiliate';
        menuOpen(placeholders, 'SET AFFILIATE', 'Redistribute some transfer fees to affiliate.');
        menuSubmitFunction = setupAffiliate;
    } else {
        menuClose();
    }
});


//LOCKER ZONE
document.getElementById('voteDelta').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'ID of Delta';
        placeholders[1] = 'Agree to Change: yes or no';
        menuOpen(placeholders, 'VOTE DELTA', 'Vote to change state of contract. (75%+)');
        menuSubmitFunction = voteDelta;
    } else {
        menuClose();
    }
});
document.getElementById('createDelta').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Contract to Alter';
        placeholders[1] = 'Function to Execute';
        placeholders[2] = 'List of Parameter Types: address, uint256';
        placeholders[3] = 'List of Parameter Values: 0x0, 1000000000000';
        placeholders[4] = 'List of Return Types: bool, string';
        menuOpen(placeholders, 'CREATE DELTA', 'Initialize a vote to alter the contract.');
        menuSubmitFunction = createDelta;
    } else {
        menuClose();
    }
});
document.getElementById('toggleDelta').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Contract to Alter';
        menuOpen(placeholders, 'TOGGLE VOTING', 'Enable or disable votes with a vote.');
        menuSubmitFunction = toggleDelta;
    } else {
        menuClose();
    }
});
document.getElementById('executeDelta').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'ID of Delta';
        menuOpen(placeholders, 'EXECUTE DELTA', 'Call contract function after voting period.');
        menuSubmitFunction = executeDelta;
    } else {
        menuClose();
    }
});
document.getElementById('transferOwnership').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Contract to Lock';
        placeholders[1] = 'Token for Vote';
        menuOpen(placeholders, 'LOCK CONTRACT', 'Hand over contract ownership to your community.');
        menuSubmitFunction = tokenOwnershipToLocker;
    } else {
        menuClose();
    }
});

//EVENT ZONE
function toggleSubscribeTo() {
    if (document.getElementById('subscribeToContainer').style.display == 'none') {
        displayElements('video', 'none');
        document.getElementById('subscribeToContainer').style.display = 'block';
    } else {
        document.getElementById('subscribeToContainer').style.display = 'none';
    }
}
document.getElementById('subscribeTo').addEventListener("click", (e) => {e.preventDefault(); toggleSubscribeTo();});
document.getElementById('subscribeToExit').addEventListener("click", (e) => {e.preventDefault(); toggleSubscribeTo();});
document.getElementById('subscribeToCreateDelta').addEventListener("click", async() => {
    let placeholders = [];
    placeholders[0] = 'Token with Voting Power';
    menuOpen(placeholders, 'SUBSCRIBE TO', 'Track the CreateDelta event.');
    menuSubmitFunction = subscribeToCreateDelta;
    document.getElementById('subscribeToContainer').style.display = 'none';
});
document.getElementById('subscribeToStake').addEventListener("click", async() => {
    let placeholders = [];
    menuOpen(placeholders, 'SUBSCRIBE TO', 'Track all staking activity.');
    menuSubmitFunction = subscribeToStake;
    document.getElementById('subscribeToContainer').style.display = 'none';
});

document.getElementById('subscribeEvent').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = 'Contract with Event';
        placeholders[1] = 'Name of Event';
        placeholders[2] = 'List of Parameter Types: address indexed, uint';
        placeholders[3] = 'List of Parameter Names: wallet, wei';
        placeholders[4] = 'List of Filter Values: null, 10000000';
        menuOpen(placeholders, 'SUBSCRIBE', 'Choose an event with filters.');
        menuSubmitFunction = subscribe;
    } else {
        menuClose();
    }
});
document.getElementById('unsubscribeEvent').addEventListener("click", async() => {
    if (document.getElementById('menuContainer').style.display == 'none') {
        let placeholders = [];
        placeholders[0] = '# of Subscription';
        menuOpen(placeholders, 'UNSUBSCRIBE', 'Silence an event forever.');
        menuSubmitFunction = unsubscribe;
    } else {
        menuClose();
    }
});

//HOME ZONE
setupToggleDisplay('homeWrap2');
let homeSections = ['Community', 'Revenue', 'Decentralize', 'Track'];
for (let i=0; i < homeSections.length; i++) {
    document.getElementById('home' + homeSections[i]).addEventListener("click", () => {
        let eHomeWrap = document.getElementById('homeWrap' + homeSections[i]);
        if (eHomeWrap.style.display == "") {
            eHomeWrap.style.display = "block";
        } else {
            eHomeWrap.style.display = "";
}})};

//SOCIAL ZONE
setupToggleDisplay('socialWrap');
