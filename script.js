// Allow drag over
function allowDrop(event) {
  event.preventDefault();
}

// Handle dropping of the dragged element
function drop(event) {
  event.preventDefault();
  const draggedElementId = event.dataTransfer.getData("text");
  const draggedElement = document.getElementById(draggedElementId);

  // Create a new element to place inside the canvas
  const newElement = draggedElement.cloneNode(true);
  newElement.style.position = 'absolute';
  newElement.style.left = `${event.clientX - 100}px`;
  newElement.style.top = `${event.clientY - 50}px`;
  newElement.classList.add("dropped-element");

  // Add event listeners for repositioning the element
  newElement.addEventListener("mousedown", function(e) {
    const offsetX = e.clientX - newElement.offsetLeft;
    const offsetY = e.clientY - newElement.offsetTop;

    function moveElement(moveEvent) {
      newElement.style.left = `${moveEvent.clientX - offsetX}px`;
      newElement.style.top = `${moveEvent.clientY - offsetY}px`;
    }

    function stopMove() {
      document.removeEventListener("mousemove", moveElement);
      document.removeEventListener("mouseup", stopMove);
    }

    document.addEventListener("mousemove", moveElement);
    document.addEventListener("mouseup", stopMove);
  });

  // Append the new element to the canvas
  document.getElementById('canvas').appendChild(newElement);
}

// Allow draggable elements to be dragged
const draggableItems = document.querySelectorAll('.draggable');
draggableItems.forEach(item => {
  item.addEventListener('dragstart', function(e) {
    e.dataTransfer.setData('text', e.target.id);
  });
});

// Export the flowchart as PNG
document.getElementById('exportBtn').addEventListener('click', function() {
  html2canvas(document.getElementById('canvas')).then(function(canvas) {
    const link = document.createElement('a');
    link.download = 'flowchart.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

// Export the flowchart as PDF
document.getElementById('exportPdfBtn').addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  html2canvas(document.getElementById('canvas')).then(function(canvas) {
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 10, 180, 160);
    doc.save('flowchart.pdf');
  });
});
