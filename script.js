// Allow dropping elements
function allowDrop(event) {
    event.preventDefault();
}

// Handle dragging elements
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Handle dropping elements
function drop(event) {
    event.preventDefault();
    
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data).cloneNode(true);
    
    // Remove any existing ID to prevent duplication
    draggedElement.removeAttribute("id");

    // Set size and position for the dropped element
    draggedElement.style.width = "80px";
    draggedElement.style.height = "80px";
    draggedElement.style.position = "absolute";
    draggedElement.style.left = (event.clientX - 40) + "px";
    draggedElement.style.top = (event.clientY - 40) + "px";

    // Append to canvas
    document.getElementById("canvas").appendChild(draggedElement);
}

// Export flowchart as PNG
document.getElementById("exportBtn").addEventListener("click", function() {
    html2canvas(document.getElementById("canvas")).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "flowchart.png";
        link.click();
    });
});

// Export flowchart as PDF
document.getElementById("exportPdfBtn").addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    html2canvas(document.getElementById("canvas")).then(canvas => {
        let pdf = new jsPDF("landscape");
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 280, 150);
        pdf.save("flowchart.pdf");
    });
});
