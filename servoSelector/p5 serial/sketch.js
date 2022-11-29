//control of servo using p5 speech

//arduino code found here: https://github.com/ratemypraxis/chuchero/blob/main/servoSelector/servoControl.ino

var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
var myVoice = new p5.Speech(); // new P5.Speech object

myRec.continuous = true; // do continuous recognition
//myRec.interimResults = true; // allow partial recognition (faster, less accurate)

let serial; // variable for the serial object
let position = 0; // variable to hold the data we're sending
let piano, guitar, voice, synthesizer; // variables to hold the position values

function setup() {
  // graphics stuff:
  createCanvas(windowWidth, windowHeight);
  background("grey");
  fill(0, 0, 0, 255);
  // instructions:
  textSize(32);
  textAlign(CENTER);
  myRec.onResult = selectInstrument;
  myRec.start();
  text("select an instrument", width / 2, height / 2);

  myVoice.speak(
    "select an instrument. the options are piano, guitar, voice and synthesizer. say 'repeat' to hear the options again"
  );
  
//add an option to repeat options
  
  console.log("listening");

  // define the position values
  piano = 22.5;
  guitar = 67.5;
  voice = 112.5;
  synthesizer = 157.5;

  // serial constructor
  serial = new p5.SerialPort();

  // serial port to use - you'll need to change this
  //ask yeseul how i find this on my device?
  serial.open("/dev/tty.usbmodem143201");
}

function selectInstrument() {
  if (myRec.resultValue === true) {
    background("gray");
    text(myRec.resultString, width / 2, height / 2);
    console.log(myRec.resultString);
  }

  if (myRec.resultString === "piano") {
    position = piano;
    serial.write(position);
    console.log(position);
    myVoice.speak("piano selected"); // debug printer for voice options
  }

  if (myRec.resultString === "guitar") {
    position = guitar;
    serial.write(position);
    console.log(position);
    myVoice.speak("guitar selected"); // debug printer for voice options
  }

  if (myRec.resultString === "voice") {
    position = voice;
    serial.write(position);
    console.log(position);
    myVoice.speak("voice selected"); // debug printer for voice options
  }

  if (myRec.resultString === "synthesizer") {
    position = synthesizer;
    serial.write(position);
    console.log(position);
    myVoice.speak("synthesizer selected"); // debug printer for voice options
  }
  
    if (myRec.resultString === "repeat") {
    console.log("repeat");
    myVoice.speak("the options are piano, guitar, voice and synthesizer."); // debug printer for voice options
  }
}

//credits:

//speech recognition: https://editor.p5js.org/ziyu/sketches/rJCJtGTMx
//serial to arduino: https://editor.p5js.org/jlimetc/sketches/rkqur51Mx
