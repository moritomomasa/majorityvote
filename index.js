const minNumMembers = 2;
const maxNumMembers = 10;
const minNumSelections = 2;
const maxNumSelections = 10;

var numMembers = 2;
var numSelections = 2;
var selectionsName = new Array(maxNumSelections);
var voteAggregation = new Array(maxNumSelections);

// SETTINGS ---------------------------------------------------------------
window.addEventListener('load', function () {
    initSelection();
    updateSelection();
});

// Save Input value
function saveInputValue(obj) {
    if(obj.id == 'member') {          
        // input num member
        numMembers = valueAdjustmentOfMembers(obj.value);
        obj.value = numMembers;
    }
    else if(obj.id == 'num-selection') {  
        // input num selection
        numSelections = valueAdjustmentOfSelections(obj.value);
        obj.value = numSelections;
        updateSelection();
    }
    else {  
        // input selection name
        selectionsName[obj.dataset.id - 1] = obj.value;
    }  
}

// Init selection part
function initSelection() {
    for(i=1; i<=maxNumSelections; i++) {
        document.getElementById('name-selection').innerHTML += 
                `<div id="selection-` + i + `">
                    <input id="name-input" class="input is-primary is-small" data-id="` + i + `" type="text" onchange="saveInputValue(this)" placeholder="選択肢` + i + `" maxlength="10">
                </div>`;
    }
}

// Update selection part
function updateSelection() {
    for(var i=1; i<=maxNumSelections; i++) {
        var iSelection = document.getElementById('selection-' + i);
        if(i > numSelections) iSelection.style.display = 'none';
        else iSelection.style.display = 'block';
    }
}

// Regulate input member
function valueAdjustmentOfMembers(value) {
    if(value < minNumMembers) return minNumMembers;
    else if(value > maxNumMembers) return maxNumMembers;
    else return value;
}

// Regulate input selection
function valueAdjustmentOfSelections(value) {
    if(value < minNumSelections) return minNumSelections;
    else if(value > maxNumSelections) return maxNumSelections;
    else return value;
}

// Settings to Vote
function goToVote() {
    // hidden settings screen
    document.getElementById('settings').style.display = 'none';
    // go to vote
    dispVoteScreen();
}

// VOTE -------------------------------------------------------------------
var iVote = 1;

// Display vote screen
function dispVoteScreen() {
    // visualize vote screen
    document.getElementById('vote').style.display = 'block';
    // init vote selections
    initVoteSelection();
}

// Init vote status
function initVoteSelection() {
    document.getElementById("vote-state").innerHTML = '1 / ' + numMembers;

    for(var i=1; i<=numSelections; i++) {
        document.getElementById('vote-selection').innerHTML += 
                `<div id="vote-` + i + `">                       
                    <span id="name-` + i + `"></span> 
                    <input id="num-vote-` + i + `" type="range" name="speed" min="0" max="100">
                </div>`;
        document.getElementById('name-' + i).innerHTML = selectionsName[i-1];
        voteAggregation[i-1] = 0; // init vote state
    }
}

// Go to next member
function aVoteFinish() {
    iVote += 1;
    // is there the next person  or not
    document.getElementById("vote-state").innerHTML = iVote + ' / ' + numMembers;
    calcVoteAggregation();
    if(numMembers < iVote) {
        goToResult();
    }
}

// Sum vote
function calcVoteAggregation() {
    for(var i=1; i<=numSelections; i++) {
            var iSelection = document.getElementById('num-vote-' + i);
            voteAggregation[i-1] += parseInt(iSelection.value);
            iSelection.value = 50; // reset range bar
    }
}

// Vote to Result
function goToResult() {
    // hidden vote screen
    document.getElementById('vote').style.display = 'none';
    // go to result
    dispResultScreen();
}

// RESULT -----------------------------------------------------------------

// Display result screen
function dispResultScreen() {
    // visualize result screen
    document.getElementById('result').style.display = 'block';
    // disp the most popular one
    maxVoteIndex = getMaxId(voteAggregation);
    document.getElementById('top1').innerHTML = selectionsName[maxVoteIndex];
    // disp graph and run animation
    dispGraph();
    setTimeout(graphAnim(voteAggregation[maxVoteIndex]), 500);
}

// Get the most choices
function getMaxId(arr) {
    if(arr.length == 0) return -1;
    var maxId = 0;
    for(var i=1; i<arr.length; i++) {
        if(arr[i] > arr[maxId]) {
            maxId = i;
        }
    }
    return maxId;
}

// Display result in a graph
function dispGraph() {
    for(i=0; i<numSelections; i++) {
        total = voteAggregation[i];
        document.getElementById('result-graph').innerHTML += 
                `<div class="result-selection">
                    <div class="name">` + selectionsName[i] + `</div>
                    <div class='bar'>   
                        <div class='bar-info result' data-total='` + total + `'>
                            <span class='percent'>` + total + `</span>
                        </div>
                    </div>
                </div>`;
    }
}

// Play animation
function graphAnim(numMaxVote) {
    $('.bar-info').each(function() {
        total = $(this).data("total");
        width = (total/numMaxVote) * 100;
        $(this).css("width", width + "%");
    });
      
    $('.percent').each(function() {
        var $this = $(this);
        $({
          Counter: 10
        }).animate({
          Counter: $this.text()
        }, {
          duration: 1000,
          easing: 'swing',
          step: function() {
            $this.text(Math.ceil(this.Counter));
          }
        });
    });
};

//
function reload() {
    document.location.reload();
}