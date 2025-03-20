const flowchartArea = document.getElementById("flowchart");
const canvas = document.getElementById("flowchartCanvas");
const ctx = canvas.getContext("2d");
const nodes = [];
const connections = [];
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let selectedNode = null;

// Node creation function
function createNode(type, x, y) {
    const node = {
        type: type,
        x: x,
        y: y,
        width: 80,
        height: 80,
    };
    nodes.push(node);
    if (nodes.length > 1) {
        // Connect the new node to the previous one
        connections.push({ from: nodes[nodes.length - 2], to: node });
    }
    draw();
}

// Draw function (draws nodes and connections)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    drawNodes();
}

// Draw nodes function
function drawNodes() {
    nodes.forEach((node) => {
        ctx.fillStyle = "#3498db";
        ctx.fillRect(node.x, node.y, node.width, node.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.type, node.x + node.width / 2, node.y + node.height / 2);
    });
}

// Draw connections function
function drawConnections() {
    connections.forEach((conn) => {
        const from = conn.from;
        const to = conn.to;
        if (from && to) {
            drawArrow(from.x + from.width / 2, from.y + from.height / 2, to.x + to.width / 2, to.y + to.height / 2);
        }
    });
}

// Draw arrow function
function drawArrow(fromX, fromY, toX, toY) {
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
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
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
    createNode(type, event.offsetX - 40, event.offsetY - 40);
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
        draw();
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    selectedNode = null;
});

// Export functionality (if needed)
document.getElementById("exportBtn").addEventListener("click", function () {
    // ... export code
});

document.getElementById("exportPdfBtn").addEventListener("click", function () {
    // ... export pdf code
});
