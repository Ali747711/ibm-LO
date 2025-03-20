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
function createNode(type, x, y, icon) {
    const node = {
        type: type,
        x: x,
        y: y,
        width: 150, // Increased node width
        height: 70, // Increased node height
        color: getRandomColor(),
        borderRadius: 10, // Increased border radius
        label: type, // Add label property initialized with type
        icon: icon, // Add icon property
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
        ctx.fillStyle = node.color;
        drawRoundedRect(ctx, node.x, node.y, node.width, node.height, node.borderRadius);
        ctx.fillStyle = "white"; // Set text color to white
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "medium 16px Avenir"; // Set font style
        ctx.fillText(node.label, node.x + node.width / 2, node.y + node.height / 2);
    });
}

// Draw rounded rectangle function
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
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
        event.dataTransfer.setData("text/plain", JSON.stringify({
            type: event.target.dataset.type,
            icon: event.target.querySelector(".icon").textContent,
        }));
    });
});

flowchartArea.addEventListener("dragover", (event) => {
    event.preventDefault(); // Allow drop
});

flowchartArea.addEventListener("drop", (event) => {
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    createNode(data.type, event.offsetX - 75, event.offsetY - 35, data.icon); // Adjust for the new size
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
