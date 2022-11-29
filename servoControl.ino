#include "Servo.h"      // include the servo library
 
Servo servoMotor;       // creates an instance of the servo object to control a servo
int servoPin = 9;       // Control pin for servo motor

void setup() {
  Serial.begin(9600);       // initialize serial communications
  servoMotor.attach(servoPin);  // attaches the servo on pin 9 to the servo object
  
  // initialize the servoPin as an output:
  pinMode(servoPin, OUTPUT);
}

void loop() {
  int position;
  
  // check if data has been sent from the computer:
  if (Serial.available() > 0) {
    // read the most recent byte (which will be from 0 to 255):
    position = Serial.read();
    // set the position of the servo:
    digitalWrite(servoPin, position);
  }
}

