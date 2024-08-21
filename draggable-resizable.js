function makeDraggable(element) {
  const handle = element.querySelector('.handle');
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  handle.addEventListener('mousedown', startDragging);

  function startDragging(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = element.offsetLeft;
    startTop = element.offsetTop;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
  }

  function drag(e) {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      element.style.left = startLeft + deltaX + 'px';
      element.style.top = startTop + deltaY + 'px';
    }
  }

  function stopDragging() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
  }
}

function makeResizable(element) {
  const resizeHandle = element.querySelector('.resize-handle');
  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  resizeHandle.addEventListener('mousedown', startResizing);

  function startResizing(e) {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = element.offsetWidth;
    startHeight = element.offsetHeight;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
  }

  function resize(e) {
    if (isResizing) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      element.style.width = startWidth + deltaX + 'px';
      element.style.height = startHeight + deltaY + 'px';
    }
  }

  function stopResizing() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
  }
}

// Make the functions available globally
window.makeDraggable = makeDraggable;
window.makeResizable = makeResizable;