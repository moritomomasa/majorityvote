const minNumMembers = 2;
const maxNumMembers = 10;
const minNumSelections = 2;
const maxNumSelections = 10;

var numMembers = 2;
var numSelections = 2;
var selectionsName = new Array(10);
var voteAggregation = new Array(10);

// settings ---------------------------------------------------------------
function saveInputValue(obj) {
    if(obj.id == 'num-member-input') {
        value = valueAdjustmentOfMembers(obj.value);
        numMembers = value;
        obj.value = numMembers;
    }
    else if(obj.id == 'num-selection-input') {
        value = valueAdjustmentOfSelections(obj.value);
        numSelections = value;
        obj.value = numSelections;
        // visible or invisible
        for(var i=1; i<11; i++) {
            var iSelection = document.getElementById('selection-' + i);
            if(i > numSelections) iSelection.style.display = 'none';
            else iSelection.style.display = 'block';
        }
    }
    else {
        selectionsName[obj.dataset.id - 1] = obj.value;
    }  
}

function valueAdjustmentOfMembers(value) {
    if(value < minNumMembers) return minNumMembers;
    else if(value > maxNumMembers) return maxNumMembers;
    else return value;
}

function valueAdjustmentOfSelections(value) {
    if(value < minNumSelections) return minNumSelections;
    else if(value > maxNumSelections) return maxNumSelections;
    else return value;
}

function goToVote() {
    document.getElementById('settings').style.display = 'none';
    dispVoteScreen();
}

// vote -------------------------------------------------------------------
var iVote = 1;

function dispVoteScreen() {
    document.getElementById('vote').style.display = 'block';
    document.getElementById("vote-state").innerHTML = '1 / ' + numMembers;
 
    // visible or invisible
    for(var i=1; i<=numSelections; i++) {
        var iSelection = document.getElementById('vote-' + i);
        iSelection.style.display = 'block';
        document.getElementById('name-' + i).innerHTML = selectionsName[i-1];
        voteAggregation[i-1] = 0; // init vote state
    }
}

function aVoteFinish() {
    iVote += 1;
    // is there the next person  or not
    if(numMembers >= iVote) {
        document.getElementById("vote-state").innerHTML = iVote + ' / ' + numMembers;
        calcVoteAggregation();
    }
    else {
        goToResult();
    }
}

function calcVoteAggregation() {
    for(var i=1; i<=numMembers; i++) {
            var iSelection = document.getElementById('num-vote-' + i);
            voteAggregation[i-1] += parseInt(iSelection.value);
            iSelection.value = 50; // reset range bar
    }
}

function goToResult() {
    document.getElementById('vote').style.display = 'none';
    dispResultScreen();
}

// result -----------------------------------------------------------------
function dispResultScreen() {
    document.getElementById('result').style.display = 'block';
    maxVoteIndex = getMaxId(voteAggregation);
    document.getElementById('result-selection').innerHTML = selectionsName[maxVoteIndex-1];
}

function getMaxId(arr) {
    if (arr.length == 0) return -1;
    var maxId = 0;
    for (var i=1; i<arr.length; i++) {
        if (arr[i] > arr[maxId]) {
            maxId = i;
        }
    }
    return maxId;
}