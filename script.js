const flowchartArea = document.getElementById("flowchart");
const canvas = document.getElementById("flowchartCanvas");
const ctx = canvas.getContext("2d");
const nodes = [];
const connections = [];
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let selectedNode = null;
const history = [];
let historyIndex = -1;

// Function to save the current state
function saveState() {
    const state = {
        nodes: nodes.map((node) => ({ ...node })),
        connections: connections.map((conn) => ({ ...conn })),
    };
    if (historyIndex < history.length - 1) {
        history.splice(historyIndex + 1);
    }
    history.push(state);
    historyIndex = history.length - 1;
}

// Function to restore a state
function restoreState(state) {
    nodes.length = 0;
    connections.length = 0;
    nodes.push(...state.nodes);
    connections.push(...state.connections);
    draw();
}

// Node creation function
function createNode(type, x, y) {
    const node = {
        type: type,
        x: x,
        y: y,
        width: 20, // Set node width to 20px
        height: 20, // Set node height to 20px
        color: getRandomColor(), // Assign random background color
    };
    nodes.push(node);
    if (nodes.length > 1) {
        connections.push({
            from: nodes[nodes.length - 2],
            to: node,
            color: getRandomColor(),
            lineWidth: Math.random() * 3 + 1,
        });
    }
    saveState();
    draw();
}

// Draw function (draws nodes and connections)
function draw() {
    canvas.width = flowchartArea.offsetWidth;
    canvas.height = flowchartArea.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    drawNodes();
}

// Draw nodes function
function drawNodes() {
    nodes.forEach((node) => {
        ctx.fillStyle = node.color; // Use node's color
        ctx.fillRect(node.x, node.y, node.width, node.height);
        ctx.fillStyle = "black"; // Set text color to black
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "8px Arial"; // Set font size
        ctx.fillText(node.type, node.x + node.width / 2, node.y + node.height / 2);
    });
}

// Draw connections function
function drawConnections() {
    connections.forEach((conn) => {
        const from = conn.from;
        const to = conn.to;
        if (from && to) {
            drawArrow(from.x + from.width / 2, from.y + from.height / 2, to.x + to.width / 2, to.y + to.height / 2, conn.color, conn.lineWidth);
        }
    });
}

// Draw arrow function
function drawArrow(fromX, fromY, toX, toY, color = "black", lineWidth = 2) {
    const headLength = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

// Get random color function
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Add event listeners for drag and drop
document.querySelectorAll(".node").forEach((node) => {
    node.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", event.target.dataset.type);
    });
});

flowchartArea.addEventListener("dragover", (event) => {
    event.preventDefault(); // Allow drop
});

flowchartArea.addEventListener("drop", (event) => {
    const type = event.dataTransfer.getData("text/plain");
    createNode(type, event.offsetX - 10, event.offsetY - 10); // Adjust for the new size
    document.getElementById("flowchartPlaceholder").style.display = "none";
});

// Add event listeners to the canvas
canvas.addEventListener("mousedown", (event) => {
    nodes.forEach((node) => {
        if (event.offsetX >= node.x && event.offsetX <= node.x + node.width &&
            event.offsetY >= node.y && event.offsetY <= node.y + node.height) {
            isDragging = true;
            selectedNode = node;
            dragOffsetX = event.offsetX - node.x;
            dragOffsetY = event.offsetY - node.y;
        }
    });
});

canvas.addEventListener("mousemove", (event) => {
    if (isDragging && selectedNode) {
        selectedNode.x = event.offsetX - dragOffsetX;
        selectedNode.y = event.offsetY - dragOffsetY;
        saveState();
        draw();
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    selectedNode = null;
});

// Reset button functionality
document.getElementById("reset").addEventListener("click", () => {
    nodes.length = 0;
    connections.length = 0;
    saveState();
    draw();
});

// Undo button functionality
document.getElementById("undo").addEventListener("click", () => {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState(history[historyIndex]);
    }
});

// Redo button functionality
document.getElementById("redo").addEventListener("click", () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        restoreState(history[historyIndex]);
    }
});

// Export functionality (if needed)
document.getElementById("exportBtn").addEventListener("click", function () {
    // ... export code
});

document.getElementById("exportPdfBtn").addEventListener("click", function () {
    // ... export pdf code
    });

// Save initial state
saveState();
