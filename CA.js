// 3-state cellular automata class
class CA {
  
  // coonstructor with 3 arguments
  constructor(x, y, rule) {
    this.generation = 0;
    this.symmetry_x = x;
    this.symmetry_y = y;
    
    // initial configuration of the cells 
    this.cells = new Array(Math.floor(width/_scale));

    for (let i = 0; i < this.cells.length; i++) {
      // random configuration with possible symmetry
      if (i >= this.cells.length/2 && this.symmetry_x) {
        this.cells[i] = this.cells[this.cells.length-i-1]; 
      }
      else {
        this.cells[i] = Math.floor(Math.random()*3);
      }
    }

    // array of rules
    this.rules = this.generate_rules(this.ter_to_dec(rule));
  }
  
  
  // method to generate cells for the next generation
  generate() {

    // variable for next generation
    let next = [];
    for (let i = 0; i < this.cells.length; i++) {
      next[i] = 2;
    }
    
    // left part of canvas
    for (let i = 0; i <= this.cells.length/2; i++) {
      let cell = this.cells[i];
      let right = this.cells[i + 1];
      let left = this.cells[i - 1];
      // middle x cell, not dependent on previous cells
      if (i == this.cells.length/2) {
        next[i] = Math.floor(Math.random()*3);
      } 
      else {
        next[i] = this.final_state(cell, right, left);
      }
    }
    
    // right part
    for (let i = Math.round(this.cells.length/2); i < this.cells.length; i++) {
      let cell = this.cells[i];
      let left = this.cells[i - 1];
      let right = this.cells[i + 1];
      if (this.symmetry_x) {
        next[i] = next[this.cells.length - i - 1];
      } else {
        next[i] = this.final_state(cell, right, left);  
      }
    }
    
    this.display();
    this.cells = next;
    this.generation++;
  }
  
  
  // method for generating the rules from a given rule number (an array for the 27 configurations - containing  numbers in ternary representation)
  generate_rules(rule) {
    let rules = [];
    
    for (let i = 0; i < 27; i++) {
      rules[i] = 2;
    }

    let rule_ter = this.dec_to_ter(rule);
    
    // move the ternary number to the rules array
    for (let i = 0; i < rules.length; i++) {
      rules[i] = (rule_ter % 10) % 3;
      rule_ter = Math.floor(rule_ter / 10);
    }
    // flip the rules array
    return rules.reverse();
  }
  
  
  // method for drawing the row of cells
  display() {
    //noStroke();
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i] == 0) {
        // lightest
        fill(colorPicker1.color());
      } else if (this.cells[i] == 1) {
        // darkest
        fill(colorPicker3.color()); 
      } else if (this.cells[i] == 2) {
        // middle
        fill(colorPicker2.color()); 
      } else {
        continue;
      }
      
      if (this.symmetry_y) {
        rect(i*_scale, height/2 + this.generation*_scale, 
           _scale, _scale);
        rect(i*_scale, height/2 - this.generation*_scale, 
           _scale, _scale);
      } else {
        rect(i*_scale, this.generation*_scale, 
           _scale, _scale);
      }  
    }
  }
  
  
  // method for computing the final state of given cell in the automata (according to the previous cells)
  final_state(a, b, c) {
    let ter_num = this.abc_to_ter(a, b, c);
    let result = this.ter_to_dec(ter_num);
    if (result >= 27) {
      return 0;
    }
    return this.rules[this.ter_to_dec(ter_num)];
  }
  
  
  // method to create one number from 3 numbers
  abc_to_ter(a, b, c) {
    return a * (10 ** 2) + b * (10 ** 1) + c * (10 ** 0); 
  }
  
  
  // method to convert a number in ternary base to decimal base
  ter_to_dec(x) {
    let count = 0;
    let result = 0;
    while (x > 0) {
      result += (x % 10) * (3 ** count);
      x = Math.floor(x / 10);
      count++;
    }
    return result;
  }
  
  
  // method to convert a number in decimal base to ternary base
  dec_to_ter(x) {
    let count = 0;
    let result = 0;
    while (x > 0) {
      let quotient = x % 3;
      x = Math.floor(x / 3);
      result += quotient * (10 ** count);
      count++;
    }
    return result;
  }
}
