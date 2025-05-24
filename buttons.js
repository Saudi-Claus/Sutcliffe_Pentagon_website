// Pause button
function toggleAnimation() {
     _paused = !_paused;
}

// Download button 
function downloadImage() {
    const link = document.createElement("a");
    link.download = "Sutcliffe_Fractal.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// Sides input
function updateSides() {
    _numSides = parseInt(sides_input.value, 10)
}

// Depth slider 
depth_slider.oninput = function() {
  depth_value.innerHTML = this.value;
  _maxLevels = parseInt(this.value,10);
}

// Strut change factor slider 
strutChange_slider.oninput = function() {
  strutChange_value.innerHTML = String(parseInt(this.value,10) / 200000);
  _strutChange = parseInt(this.value,10) / 200000;
}