// document.querySelectorAll('td').forEach(box => {
//     box.addEventListener('click', event => {
//         box.innerHTML += '<span class="dot"></span>'
//     })
// })


/*
    Convert the grid into an JS array
*/

let grid_arr = []  // global variable for the 2d array that is the playing grid 
let grid = document.querySelectorAll('tr')

grid.forEach(row => {
    let row_arr = []

    row = row.querySelectorAll('td')
    row.forEach(box => {
        row_arr.push(box)
    })
    grid_arr.push(row_arr)
})


// vars that will control turns
let colors = ["red", "blue"]
let current_color = "red"
let turn_number = 0

/*
    Handle adding of dots
*/
for (let row = 0; row < grid_arr.length; row++){
    for (let col = 0; col < grid_arr[row].length; col++){
        grid_arr[row][col].setAttribute('data-numdots', 0)
        grid_arr[row][col].setAttribute('data-color', '')

        grid_arr[row][col].addEventListener('click', event => {
            /*
            // add dot
            
            // recursive split moves
                // if corner && currently 1 dot
                    // split corner
                // else if edge && currently 2 dots
                    // split edge
                // else if middle && currently 3 dots
                    // split middle
            */


            // add dot
            
            // check that color is valid for this dot to be placed in this square
            let this_color = grid_arr[row][col].getAttribute('data-color')
            if ((this_color != '') && (this_color != current_color)){
                alert('You can only place dots on squares that are empty or are your color. Try again.')
                return
            }

            // add dot if color is valid
            addDot(row, col, current_color)
            turn_number += 1

            /*
            SPLIT MOVES
            */
            split(row, col, current_color)  // will recursively split or do nothing if split not neccessary
            


            // change color for nex turn
            current_color = switchColor(current_color)                     // switch colors for next turn
        })
    }
}

// ============================================================================================================

// returns true if there is at least 1 dot with the given color, false otherwise
function gridContainsColor(color){
    for (let row = 0; row < grid_arr.length; row++){
        for (let col = 0; col < grid_arr[row].length; col++){
            let thisColor = grid_arr[row][col].getAttribute('data-color')
            if (thisColor == color){  // at least one dot
                return true
            }
        }
    }
    // else, no dots
    return false
}


// JS is pass by value, so must return the new color
function switchColor(current_color){
    let turn_box = document.getElementById('turn_box')
    
    if (current_color == "red") {
        current_color = "blue"
        for (let row = 0; row < grid_arr.length; row++){
            for (let col = 0; col < grid_arr[row].length; col++){
                grid_arr[row][col].setAttribute('style', 'border-color: blue;')
            }
        }
    } 

    else if (current_color == "blue") {
        current_color = "red"
        for (let row = 0; row < grid_arr.length; row++){
            for (let col = 0; col < grid_arr[row].length; col++){
                grid_arr[row][col].setAttribute('style', 'border-color: red;')
            }
        }
    }

    document.getElementById('turn_box').innerHTML = "It is " + current_color + "'s turn"

    return current_color
}


function split (row, col, color){
    let corner = checkCorner(row, col)
    let edge = checkEdge(row, col)

    // check if there is a winner before you split (don't want endless recursive splitting)
    if (!gridContainsColor("red") && (turn_number > 2)){
        alert("blue wins")
        return
    }
    else if (!gridContainsColor("blue") && (turn_number > 2)){
        alert("red wins")
        return
    }


    if ((corner) && (grid_arr[row][col].getAttribute('data-numdots') == 2)){
        splitCorner(row, col, corner, color)
    }                
    // else if edge && currently 2 dots
    else if ((edge) && (grid_arr[row][col].getAttribute('data-numdots') == 3)){
        splitEdge(row, col, edge, color)
    }
    // else if middle && currently 3 dots
    else if (grid_arr[row][col].getAttribute('data-numdots') == 4){
        splitMiddle(row, col, color)
    }
    // else: do nothing
}


function changeDotColors(row, col, color){
    let dots = grid_arr[row][col].querySelectorAll('span')
    dots.forEach(dot => {
        dot.setAttribute('class', 'dot ' + color)
    })
}


function up(row, col, color){
    addDot(row - 1, col, color)  // up
    changeDotColors(row - 1, col, color)
    split(row - 1, col, color)  // up
}


function down(row, col, color){
    addDot(row + 1, col, color)  // down
    changeDotColors(row + 1, col, color)
    split(row + 1, col, color)  // down
}


function left(row, col, color) {
    addDot(row, col - 1, color)  // left
    changeDotColors(row, col - 1, color)
    split(row, col - 1, color)  // left
}


function right (row, col, color){
    addDot(row, col + 1, color)  // right
    changeDotColors(row, col + 1, color)
    split(row, col + 1, color)  // right
}


function removeDots(row, col){
    grid_arr[row][col].innerHTML = ""
    grid_arr[row][col].setAttribute('data-numdots', 0)
    grid_arr[row][col].setAttribute('data-color', '')
}

/*
split function for corners
location options:
- top left
- top right
- bottom left
- bottom right
- false (if not a corner)
*/
function splitCorner(row, col, location, color){
    /*
    Remove all dots from current box
    */
    removeDots(row, col)

    /*
    Put 2 dots in appropriate locations
    */
    if (location == "top left"){
        down(row, col, color)
        right(row, col, color)
    }
    else if (location == "top right"){
        down(row, col, color)
        left(row, col, color)
    }
    else if (location == "bottom left"){
        up(row, col, color)
        right(row, col, color)
    }
    else if (location == "bottom right"){
        up(row, col, color)
        left(row, col, color)
    }
    else {
        console.error("error, splitCorner should not be called on a box that is not a corner")
        return
    }
}


/*
split function for edges
location options:
- top
- bottom
- left
- right  
*/
function splitEdge(row, col, location, color){
    removeDots(row, col)

    if (location == "top"){
        left(row, col, color)
        down(row, col, color)
        right(row, col, color)
    }
    else if (location == "bottom") {
        left(row, col, color)
        up(row, col, color)
        right(row, col, color)
    }
    else if (location == "left") {
        up(row, col, color)
        right(row, col, color)
        down(row, col, color)
    }
    else if (location == "right") {
        down(row, col, color)
        left(row, col, color)
        up(row, col, color)
    }
}


function splitMiddle(row, col, color){
    removeDots(row, col)

    up(row, col, color)
    down(row, col, color)
    left(row, col, color)
    right(row, col, color)
}


function addDot(row, col, color){
    grid_arr[row][col].setAttribute('data-color', color)   // set current box to current color
    grid_arr[row][col].innerHTML += '<span class="dot ' + color + '"></span>'

    let old_count = grid_arr[row][col].getAttribute('data-numdots')
    grid_arr[row][col].setAttribute('data-numDots', parseInt(old_count) + 1)
}


function checkCorner(row, col){
    // corners
    if ((row == 0) && (col == 0)){  // top left corner
        return "top left"
    }
    else if ((row == 0) && (col == grid_arr[0].length - 1)){ // top right corner
        return "top right"
    }  
    else if ((row == grid_arr.length - 1) && (col == 0)){ // bottom left corner
        return "bottom left"
    }  
    else if ((row == grid_arr.length - 1) && (col == grid_arr[0].length - 1)){ // bottom right corner
        return "bottom right"
    }
    else {  // not a corner
        return false
    }
}

function checkEdge(row, col){
    if ((row == 0) && (col != 0) && (col != grid_arr[0].length - 1)){ // top edge
        return "top"
    }
    else if ((row == grid_arr.length - 1) && (col != 0) && (col != grid_arr[0].length - 1)){ // bottom edge
        return "bottom"
    }
    else if ((col == 0) && (row != 0) && (row != grid_arr.length - 1)){  // left edge
        return "left"
    }
    else if ((col == grid_arr[0].length - 1) && (row != 0) && (row != grid_arr.length - 1)){  // right edge
        return "right"
    }
    else {  // not an edge
        return false
    }
}