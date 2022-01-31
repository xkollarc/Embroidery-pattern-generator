// gui params
var button;
var bgcolor;

// color pickers
let colorPicker1;
let colorPicker2;
let colorPicker3;

// checkboxes
let symmetry_x;
let symmetry_y;

// rule selector
let sel;

// slider for the size of the tiles
let slider;

// button for refreshing
let refresh;
let ref = false;

// button for saving the canvas
let save_but;

// canvas params
let _scale;
let size = 600;
let canvas;

// cellular automata class instance
let ca;

function setup() {
  canvas = createCanvas(size, size);
  
  // color picker for the 3 colors
  colorPicker1 = createColorPicker('#a8dadc');
  colorPicker1.position(size + 20, 0);
  colorPicker2 = createColorPicker('#457b9d');
  colorPicker2.position(size + 80, 0);
  colorPicker3 = createColorPicker('#1d3557');
  colorPicker3.position(size + 140, 0);
  
  // checkboxes to set the symmetries
  symmetry_x = createCheckbox('Horizontal symmetry', true);
  symmetry_x.position(size + 20, 50);
  symmetry_y = createCheckbox('Vertical symmetry', true);
  symmetry_y.position(size + 20, 90);
  
  // selector for the rules
  textAlign(CENTER);
  sel = createSelect();
  sel.position(size + 40, 140);
  sel.option('rule number 1');
  sel.option('rule number 2');
  sel.option('rule number 3');
  let rule = ruleSelectEvent();
  
  // slider for the size of the tiles
  slider = createSlider(4, 30, 10, 2);
  slider.position(size + 20, 180);
  slider.style('width', '160px');
  _scale = slider.value();

  // button for refreshing / generating new pattern
  refresh = createButton('generate');
  refresh.position(size + 20, 220);
  refresh.mousePressed(changeRefresh);
  
  // button for saving the current canvas
  save_but = createButton('save image');
  save_but.position(size + 100, 220);
  save_but.mousePressed(saveImage);
  
  // create new instance of cellular automata class with  symmetry values and rule number
  ca = new CA( symmetry_x.value,  symmetry_y.value, rule);
  
  frameRate(30);
}

function ruleSelectEvent() {
  let item = sel.value();
  if (item == 'rule number 1') {
    return 210201020202102012000;
  } else if (item == 'rule number 2') {
    return 210202010202102012000;
  } else if (item == 'rule number 3') {
    return 220102010101201021020;
  }
}


function checkEvent(axis) {
  if (axis == 'x') {
    return symmetry_x.checked();
  } else if (axis == 'y') {
    return symmetry_y.checked();
  }
}

function changeRefresh() {
  ref = true
}

function saveImage() {
  saveCanvas(canvas, 'myCanvas', 'jpg');
}


function draw() { 
  // update scale value
  _scale = slider.value();
  
  // save image if the button was pressed
  save_but.mousePressed(saveImage);

  if (ca.generation < ca.cells.length) {
    ca.display();
    ca.generate();
  }
  else if (ca.generation > ca.cells.length + 60 && ref){
    background(250);
    let rule = ruleSelectEvent();
    let x = checkEvent('x');
    let y = checkEvent('y');
    ca = new CA(x, y, rule);
    // reset refresh button
    ref = false;
    refresh.mousePressed(changeRefresh);
  } else {
    ca.generation++;
  }
}
