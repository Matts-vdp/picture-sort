const ipcRenderer = require('electron').ipcRenderer;
const {dialog} = require('electron')
const fs = require('fs');
var Mousetrap = require('mousetrap');

var files;      //contains a array of strings representing the path to each selected file
var pos = 0;    //the position in the files array
const startpath = "pics/logo.png" //location of the placeholder image

//handles initialization when the document is fully loaded
document.onreadystatechange = (event) => {
    if (document.readyState == "complete"){
        document.getElementById("max-button").style.display = "flex";
        document.getElementById("restore-button").style.display = "none";
        windowControls();
        initButtons();
        disableButtons(true);
        document.getElementById("img1").addEventListener("click",loadFiles);
    }
};

//callback for clicking on the placeholder image
//sends a request to main.js to ask for a folder
function loadFiles(){
    document.getElementById("img1").removeEventListener("click", loadFiles);
    document.getElementById("img2").removeEventListener("click",loadFiles);
    ipcRenderer.send("select-dirs");
}

//adds functionality to the left, right, down arrow key
//right = Good
//down = Not sure
//left = Bad
function addKeybinds(){
    Mousetrap.bind('right', function() { 
        moveFile(files[pos-1], "Good");
        left();
    });
    Mousetrap.bind('down', function() { 
        moveFile(files[pos-1], "Not-sure");
        left();
    });
    Mousetrap.bind('left', function() { 
        moveFile(files[pos-1], "Bad");
        left();
    });
}

//remove key functionality 
//used to stop user from trying to sort when no files are loaded
function removeKeybinds(){
    Mousetrap.unbind('left');
    Mousetrap.unbind('up');
    Mousetrap.unbind('right');
}

//adds callbacks to the Good, Not sure and Bad buttons
function initButtons(){
    document.getElementById('Good').addEventListener("click", event => {
        moveFile(files[pos-1], "Good");
        left();
        
    });
    document.getElementById('Bad').addEventListener("click", event => {
        moveFile(files[pos-1], "Bad");
        left();
    });
    document.getElementById('Mid').addEventListener("click", event => {
        moveFile(files[pos-1], "Not-sure");
        left();
    });
}

//enables or disables the Good, Not sure and Bad buttons
//used to stop user from trying to sort when no files are loaded
function disableButtons(val){
    document.getElementById("Good").disabled = val;
    document.getElementById("Mid").disabled = val;
    document.getElementById("Bad").disabled = val;
}

//handles the reply send by main.js on a "select-dirs" request
//when the path is valid it will enable the buttons and key functionality
ipcRenderer.on("send-dir", (event, args) => {
    files = [];
    pos = 0;
    files = getFiles(args);
    disableButtons(false);
    if (files.length > 0){
        left();
        document.getElementById("head").textContent = "Sort your pictures";
        addKeybinds();
    }
    else{
        disableButtons(true);
        document.getElementById("img1").addEventListener("click",loadFiles);
        document.getElementById("img2").addEventListener("click",loadFiles);
    }
});

//handles the custom window controlls these replace the disabeled native title bar
function windowControls(){
    document.getElementById('min-button').addEventListener("click", event => {
        ipcRenderer.send("minimize","");
    });
    document.getElementById('max-button').addEventListener("click", event => {
        ipcRenderer.send("maximize","");
        document.getElementById("max-button").style.display = "none";
        document.getElementById("restore-button").style.display = "flex";
    });
    document.getElementById('restore-button').addEventListener("click", event => {
        ipcRenderer.send("restore","");
        document.getElementById("max-button").style.display = "flex";
        document.getElementById("restore-button").style.display = "none";
    });
    document.getElementById('close-button').addEventListener("click", event => {
        ipcRenderer.send("close","");
    });
}

//loads the next image from the files array to the img object
//returns false when at the end of files
function switchImg (img) {
    if (pos >= files.length) {
        return false;
    }
    img.src = files[pos];
    pos++;
    return true;
}

//plays animation to switch images
//switches the off screen image
async function left (){
    var img1 = document.getElementById("img1");
    var img2 = document.getElementById("img2");
    var newi, oldi;
    var found = false;
    for (i=0;i<img1.classList["length"];i++){
        if ("oright" == img1.classList[i] || "oleft" == img1.classList[i]){
            newi = img2;
            oldi = img1;
            found = true;
        }
    }
    
    if (!found) {
        newi = img1; 
        oldi = img2;
    }
    if (switchImg(oldi)) {
        oldi.classList.remove("oleft");
        oldi.classList.add("iright");
        newi.classList.remove("iright");
        newi.classList.add("oleft");
    }
    else {
        resetApp();
    }
}

//reads a folder path and finds al jpg and png files inside
//returns a array with all found paths
function getFiles(dirpath) {
    var f = [];
    var f2 = [];
    f = fs.readdirSync(dirpath);
    f.forEach(element =>{
        if (element.endsWith(".png") || element.endsWith(".jpg"))
            f2.push(dirpath+"/"+element);
    })
    return f2
}

//copies a file from the src path to src/dest
function moveFile(src, dest){
    var start = src;
    var end = src;
    end = end.split("/");
    end.splice(end.length-1,0,dest);
    end = end.join("/");
    fs.copyFile(start, end, fs.COPYFILE_FICLONE, (err) => {
        if(err){console.error(err);}
    });
}

//resets the app to the choose folder state
function resetApp(){
    files = [startpath];
    pos = 0
    removeKeybinds();
    left();
    disableButtons(true);
    document.getElementById("img1").addEventListener("click",loadFiles);
    document.getElementById("img2").addEventListener("click",loadFiles);
    document.getElementById("head").textContent = "Choose a directory";
}