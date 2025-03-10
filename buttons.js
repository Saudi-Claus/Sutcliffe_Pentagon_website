
// Pause button
function toggleAnimation() {
     _paused = !_paused;
}

// Depth slider 
depth_slider.oninput = function() {
  depth_value.innerHTML = this.value;
  _maxLevels = this.value;
}

// Download button 
function downloadImage() {
    const link = document.createElement("a");
    link.download = "Sutcliffe_Fractal.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}