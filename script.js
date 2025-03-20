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
    drawNodes();
}

// Draw nodes function
function drawNodes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach((node) => {
        ctx.fillStyle = "#3498db";
        ctx.fillRect(node.x, node.y, node.width, node.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.type, node.x + node.width / 2, node.y + node.height / 2);
    });
}
// Add event listeners for drag and drop
document.querySelectorAll(".node").forEach((node) => {
    node.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", event.target.dataset.type);
    });
});
flowchartArea.addEventListener("dragover", (event) => {
    event.preventDefault();
});
flowchartArea.addEventListener("drop", (event) => {
    const type = event.dataTransfer.getData("text/plain");
    createNode(type, event.offsetX - 40, event.offsetY - 40);
    document.getElementById("flowchartPlaceholder").style.display = "none";
});

//Add event listeners to the canvas
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
        drawNodes();
    }
});
canvas.addEventListener("mouseup", () => {
    isDragging = false;
    selectedNode = null;
});

// Export functionality
document.getElementById("exportBtn").addEventListener("click", function () {
    //...export code
});
document.getElementById("exportPdfBtn").addEventListener("click", function () {
    //...export pdf code
});
