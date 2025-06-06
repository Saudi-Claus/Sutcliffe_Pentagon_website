// Lots of refactoring needed

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let sides_input = document.getElementById("numSidesInput")
let _numSides = parseInt(sides_input.value, 10)


let depth_slider = document.getElementById("depthSlider")
let depth_value = document.getElementById("depthValueDisplay")
depth_value.innerHTML = depth_slider.value;
let _maxLevels = depth_slider.Value

let strutChange_slider = document.getElementById("strutChangeSlider")
let strutChange_value = document.getElementById("strutChangeDisplay")
strutChange_value.innerHTML = strutChange_slider.value / 100000;

let _strutFactor = 0.2; // Factor that determines length of inner connections
let _strutChange = 0
let _paused = false;

// Represents a point in 2D space
class PointObj {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function calcMidPoints(point_list) {
    const modulus = point_list.length
    let midpoint_array = []
    let next_i = 0

    point_list.forEach((point, i) => {
        next_i = (i + 1) % modulus
        let average_x = (point.x + point_list[next_i].x)/2
        let average_y = (point.y + point_list[next_i].y)/2
        midpoint_array.push(new PointObj(average_x, average_y))
    })

    return midpoint_array
}

function calcStrutPoints(midpoints, outer_points) {
    const modulus = midpoints.length
    let strut_array = []
    let next_i = 0

    if (modulus % 2 === 0) {
        midpoints.forEach((point, i) => {
        next_i = (i + ((modulus + 1)/2 | 0)) % modulus 
        strut_point = calcProjPoint(point, midpoints[next_i])
        strut_array.push(strut_point)
    })
    } else {
        midpoints.forEach((point, i) => {
        next_i = (i + (modulus + 1)/2) % modulus 
        strut_point = calcProjPoint(point, outer_points[next_i])
        strut_array.push(strut_point)
    })
    }
    return strut_array
}

function calcProjPoint(midpoint, op_point) {
    let px = midpoint.x + (op_point.x - midpoint.x) * _strutFactor
    let py = midpoint.y + (op_point.y - midpoint.y) * _strutFactor
    return new PointObj(px,py)
}


// Class to generate and draw the fractal pentagon pattern
class FractalRoot {
    constructor() {
        this.points = [];
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        let angleStep = (2 * Math.PI) / _numSides;

        // Generate the corner points for the main polygon
        for (let i = 0; i < _numSides; i++) {
            let x = centerX + 200 * Math.sin(i * angleStep);
            let y = centerY - 200 * Math.cos(i * angleStep);
            this.points.push(new PointObj(x, y));
        }
        this.rootBranch = new Branch(0,0,this.points);
    }

    // Clears the canvas and redraws the whole object
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.rootBranch.drawMe();
    }
}

class Branch {
    constructor(level, num, points) {
        this.level = level
        this.num = num

        this.outerPoints = points
        this.midPoints = calcMidPoints(points)
        this.projPoints = calcStrutPoints(this.midPoints, points)
        this.myBranches = []
        // TODO set Stroke width
        // this.stroke = (_maxlevels - level - 1)/4

        if ((this.level + 1) < _maxLevels) {
            let childBranch = new Branch(level+1,0,this.projPoints)
            this.myBranches.push(childBranch)
            
            for (let k = 0; k < this.outerPoints.length; k++) {
                let nextk = k-1
                if (nextk < 0) { nextk += this.outerPoints.length}
                let newPoints = [this.projPoints[k], this.midPoints[k], this.outerPoints[k], this.midPoints[nextk], this.projPoints[nextk]]
                childBranch = new Branch(level+1,k+1,newPoints)
                this.myBranches.push(childBranch)
            }
        }
    }

    drawMe(){
        let next_i = 0

        this.outerPoints.forEach((outer_point, i) => {
            next_i = (i+1) % this.outerPoints.length
            ctx.beginPath()
            ctx.moveTo(outer_point.x, outer_point.y)
            ctx.lineTo(this.outerPoints[next_i].x , this.outerPoints[next_i].y)
            // TODO add change to line width depending on level
            // ctx.lineWidth = 
            ctx.stroke()
        })

        this.myBranches.forEach((branch) => {
            branch.drawMe()
        })
    }
}


// Animation loop to continuously redraw the fractal
function animate() {
    let fractal = new FractalRoot();
    if (!_paused) {
        _strutFactor += _strutChange; // Slightly alter strut factor for animation
    }
    fractal.draw();
    requestAnimationFrame(animate); // Request next frame
}

// Start animation loop
animate();
