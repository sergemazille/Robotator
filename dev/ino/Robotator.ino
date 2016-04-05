#include <Wire.h>
#include <AFMotor.h>
#include <Servo.h> 

// Initialisation des moteurs
AF_DCMotor motor1(1, MOTOR12_64KHZ); // Arrière Droit
AF_DCMotor motor2(2, MOTOR12_64KHZ); // Avant Droit
AF_DCMotor motor3(3, MOTOR34_64KHZ); // Avant Gauche
AF_DCMotor motor4(4, MOTOR34_64KHZ); // Arrière Gauche

Servo servoMotor;
int servoMotorPosition = 45; // Direction : tout droit

// Constantes
char STOP_MOTORS = '0';
char FORWARD_DIRECTION = '1';
char BACKWARD_DIRECTION = '2';
char SPIN_RIGHT = '3';
char SPIN_LEFT = '4';
char TURN_RIGHT = '5';
char TURN_LEFT = '6';
char STRAIGHT = '7';
char TURBO_SPEED = 't';
char NORMAL_SPEED = 'n';
int TURBO_ON = 255; // 255/255
int TURBO_OFF = 180; // 180/255

// Initialisation
void setup() {
    Serial.begin(9600); // écoute à 9600 bps

    motor1.setSpeed(TURBO_OFF);
    motor2.setSpeed(TURBO_OFF);
    motor3.setSpeed(TURBO_OFF);
    motor4.setSpeed(TURBO_OFF);

    // Les moteurs ne tournent pas au démarrage
    motor1.run(RELEASE); // Arrière Droit
    motor2.run(RELEASE); // Avant Droit
    motor3.run(RELEASE); // Avant Gauche
    motor4.run(RELEASE); // Arrière Gauche

    servoMotor.attach(10); // 9 ou 10 en fonction des pins
}

// Reception des messages
void loop() {
    char msg = Serial.read();

    // AVANCE
    if(msg == FORWARD_DIRECTION){
        moveForward();
    }

    // RECULE
    else if(msg == BACKWARD_DIRECTION){
        moveBackward();
    }

    // SPIN A DROITE
    else if(msg == SPIN_RIGHT){
        spinRight();
    }

    // SPIN A GAUCHE
    else if(msg == SPIN_LEFT){
        spinLeft();
    }

    // TOURNE A DROITE (pas de else pour pouvoir tourner tout en avançant)
    if(msg == TURN_RIGHT){
        turnRight();
    }

    // TOURNE A GAUCHE (pas de else pour pouvoir tourner tout en avançant)
    if(msg == TURN_LEFT){
        turnLeft();
    }

    // Remet le servomotor droit
    if(msg == STRAIGHT){
        straight();
    }

    // Arrête les moteurs
    else if(msg == STOP_MOTORS){
        stopMotors();
    }

    // Passe les moteurs à la vitesse turbo
    if(msg == TURBO_SPEED){
        setMotorSpeed(TURBO_ON);
    }

    // Passe les moteurs à la vitesse normale
    if(msg == NORMAL_SPEED){
        setMotorSpeed(TURBO_OFF);
    }
}

// Fonctions
void setMotorSpeed(int speed){
    motor1.setSpeed(speed); // 180 ou 255 - Arrière Droit
    motor2.setSpeed(speed); // 180 ou 255 - Avant Droit
    motor3.setSpeed(speed); // 180 ou 255 - Avant Gauche
    motor4.setSpeed(speed); // 180 ou 255 - Arrière Gauche
}

void moveForward(){
    motor1.run(FORWARD); // Arrière Droit
    motor2.run(FORWARD); // Avant Droit
    motor3.run(FORWARD); // Avant Gauche
    motor4.run(FORWARD); // Arrière Gauche
}

void moveBackward(){
    motor1.run(BACKWARD); // Arrière Droit
    motor2.run(BACKWARD); // Avant Droit
    motor3.run(BACKWARD); // Avant Gauche
    motor4.run(BACKWARD); // Arrière Gauche
}

void spinRight(){
    motor1.run(BACKWARD); // Arrière Droit
    motor2.run(BACKWARD); // Avant Droit
    motor3.run(FORWARD); // Avant Gauche
    motor4.run(FORWARD); // Arrière Gauche

    servoMotorPosition = 90;
    servoMotor.write(servoMotorPosition);
}

void spinLeft(){
    motor1.run(FORWARD); // Arrière Droit
    motor2.run(FORWARD); // Avant Droit
    motor3.run(BACKWARD); // Avant Gauche
    motor4.run(BACKWARD); // Arrière Gauche

    servoMotorPosition = 0;
    servoMotor.write(servoMotorPosition);
}

void turnRight(){
    servoMotorPosition = 90;
    servoMotor.write(servoMotorPosition);
}

void turnLeft(){
    servoMotorPosition = 0;
    servoMotor.write(servoMotorPosition);
}

void straight(){
    servoMotorPosition = 45;
    servoMotor.write(servoMotorPosition);
}

void stopMotors(){
    motor1.run(RELEASE); // Arrière Droit
    motor2.run(RELEASE); // Avant Droit
    motor3.run(RELEASE); // Avant Gauche
    motor4.run(RELEASE); // Arrière Gauche

    servoMotorPosition = 45;
    servoMotor.write(servoMotorPosition);
}