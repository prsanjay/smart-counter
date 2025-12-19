let state = localStorage.getItem('state');

if (state == null) {
    state = {value: 0, undoStack: [], redoStack: [], lastActionAt: null}
    localStorage.setItem('state', JSON.stringify(state))
} else {
    state = JSON.parse(state);
}


function increment() {
    let currentValue = state["value"];
    state["undoStack"].push(currentValue);
    currentValue += 1;
    state["value"] = currentValue;
    state["lastActionAt"] = Date.now();
    localStorage.setItem("state", JSON.stringify(state));
    renderValue();
}

function decrement() {
    let currentValue = state["value"];
    state["undoStack"].push(currentValue);
    currentValue -= 1;
    state["value"] = currentValue;
    state["lastActionAt"] = Date.now();
    localStorage.setItem("state", JSON.stringify(state));
    renderValue();
}

function manualReset() {
    state = {value: 0, undoStack: [], redoStack: [], lastActionAt: null}
    localStorage.setItem("state", JSON.stringify(state));
    renderValue();
}

function undo() {
    let currentValue = state["value"];
    state["redoStack"].push(currentValue);
    let prevValue = state["undoStack"].pop();
    state["value"] = prevValue == undefined ? currentValue : prevValue;
    state["lastActionAt"] = Date.now();
    localStorage.setItem("state", JSON.stringify(state));
    renderValue();
}

function redo() {
    let currentValue = state["value"];
    state["undoStack"].push(currentValue);
    let val = state["redoStack"].pop();
    state["value"] = val == undefined ? currentValue : val;
    state["lastActionAt"] = Date.now();
    localStorage.setItem("state", JSON.stringify(state));
    renderValue();
}


document.getElementById("increment").addEventListener("click", increment);
document.getElementById("decrement").addEventListener("click", decrement);
document.getElementById("mr").addEventListener("click", manualReset);
document.getElementById("undo").addEventListener("click", undo);
document.getElementById("redo").addEventListener("click", redo);

function renderValue() {
    let currentValue = state["value"];
    document.getElementById("value").innerText = currentValue;
    console.log("Current state:", state);
}

renderValue();
