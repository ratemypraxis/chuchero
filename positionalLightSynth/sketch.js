//positional control of LED strip

let video;
let poseNet;
let pose;
let skeleton;
let mid;

let osc, playing, freq, vol;

let note = 0;
// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();

// port chooser button:
let portButton;

// CUSTOMIZE: change/add variable for incoming serial data:
let inData;

function setup() {
  // check to see if serial is available:
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  } else {
    alert("WebSerial is supported. Enjoy!");
  }
  // check to see if serial is available:
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
  // check for any ports that are available:
  serial.getPorts();
  // if there's no port chosen, choose one:
  serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);

  // add serial connect/disconnect listeners from WebSerial API:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
  init_ui();
  osc = new p5.Oscillator("square");
  oscY = new p5.Oscillator("sine");
  delay = new p5.Delay();

  //add an option to repeat options

  console.log("listening");

  // define the position values
  allOff = 0;
  allOn = 5;
  // left = 1;
  // right = 2;
  // up = 10;
  // down = 20;
  leftUp = 11;
  rightDown = 21;
  rightUp = 12;
  leftDown = 22;

  outByte = byte(0);
  console.log(outByte);
  serial.write(outByte);
}

// if there's no port selected,
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
  if (portButton) portButton.show();
  serial.requestPort();
}

// open the selected port, and make the port
// button invisible:
function openPort() {
  // wait for the serial.open promise to return,
  // then call the initiateSerial function
  let options = { baudrate: 9600 };
  serial.open().then(initiateSerial);

  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
  }
  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}

// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}
// read any incoming data as a string
// (assumes a newline at the end of it):
function serialEvent() {
  // CUSTOMIZE: add your code for receiving/sending data over serial
}

// try to connect if a new serial port
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");   
  serial.getPorts();
}

// if a port is disconnected:
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

function closePort() {
  serial.close();
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  print("poseNet ready");
}

function draw() {
  // translate(-1,0)
  imageMode(CORNER);
  //mirror video
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  //pop();
  if (!pose) return;
  show_fps();

  //finding point between two shoulders
  m1 = (pose.leftShoulder.x + pose.rightShoulder.x) / 2;
  m2 = (pose.leftShoulder.y + pose.leftShoulder.y) / 2;
  mid = ellipse(m1, m2, 25);

  //starting the synth
  osc.start();
  playing = true;

  //setting the frequency and volume values to follow position on the X and Y axes
  osc.freq(freq, 0.001);
  osc.amp(vol);
  freq = map(m1, 0, width, 500, 50);
  vol = map(m2, height, 0, 0, 1);

  //sending serial sata based on which quadrant the user is positioned in at any moment
  if ((m1 > 320) & (m2 < 240)) {
    outByte = byte(leftUp);
    console.log(outByte);
    serial.write(outByte);
  } else if ((m1 < 320) & (m2 < 240)) {
    outByte = byte(rightUp);
    console.log(outByte);
    serial.write(outByte);
  } else if ((m1 > 240) & (m2 > 240)) {
    outByte = byte(leftDown);
    console.log(outByte);
    serial.write(outByte);
  } else if ((m1 < 240) & (m2 > 240)) {
    outByte = byte(rightDown);
    console.log(outByte);
    serial.write(outByte);
  } else {
    outByte = byte(0);
    console.log(outByte);
    serial.write(outByte);
  }
}

//CREDITS:

// serial
//https://editor.p5js.org/hafferty/sketches/2A0mlT9Ea

//Gestural command integration adapted from JHT's "PoseNet Example 1"
//https://editor.p5js.org/jht1493/sketches/xKSDq-w4H

//synth
//https://p5js.org/examples/sound-note-envelope.html
//https://editor.p5js.org/mbardin/sketches/YpGORZt9c
