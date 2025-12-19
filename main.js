const inActivityThreshold = 3000;
let timerId = null;

let state = localStorage.getItem('state');

if (state == null) {
    state = {value: 0, undoStack: [], redoStack: [], lastActionAt: null}
    localStorage.setItem('state', JSON.stringify(state))
} else {
    state = JSON.parse(state);
}

function increment() {
    let currentValue = state.value;
    state.undoStack.push(currentValue);
    currentValue += 1;
    state.value = currentValue;
    state.redoStack = [];
    commitState();
}

function decrement() {
    let currentValue = state.value;
    state.undoStack.push(currentValue);
    currentValue -= 1;
    state.redoStack = [];
    state.value = currentValue;
    commitState();
}

function resetState() {
    state = {value: 0, undoStack: [], redoStack: [], lastActionAt: null}
    localStorage.setItem("state", JSON.stringify(state));
    renderValue();
}

function undo() {
    let currentValue = state.value;
    state.redoStack.push(currentValue);
    let prevValue = state.undoStack.pop();
    state.value = prevValue == undefined ? currentValue : prevValue;
    commitState();
}

function redo() {
    let currentValue = state.value;
    state.undoStack.push(currentValue);
    let val = state.redoStack.pop();
    state.value = val == undefined ? currentValue : val;
    commitState();
}

function commitState() {
    state.lastActionAt = Date.now();
    localStorage.setItem("state", JSON.stringify(state));
    resetInactivityTimer();
    renderValue();
}

function resetInactivityTimer() {
    clearTimeout(timerId);
    timerId = setTimeout(resetState, inActivityThreshold);
}


document.getElementById("increment").addEventListener("click", increment);
document.getElementById("decrement").addEventListener("click", decrement);
document.getElementById("mr").addEventListener("click", resetState);
document.getElementById("undo").addEventListener("click", undo);
document.getElementById("redo").addEventListener("click", redo);

function renderValue() {
    let currentValue = state.value;
    document.getElementById("value").innerText = currentValue;
    console.log("Current state:", state);
}

const lastActionAt = state.lastActionAt;
if (lastActionAt !== null && (Date.now() - lastActionAt) > inActivityThreshold) {
    resetState();
}

renderValue();
