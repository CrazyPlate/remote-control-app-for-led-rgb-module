#include <SPI.h>
#include <Ethernet.h>

const int ledR = 3;
const int ledG = 5;
const int ledB = 6;
const int lightSensor = A0;

int lightValue = 0;
int responseValue = 0;

int valueR = 255;
int valueG = 255;
int valueB = 255;

const int prefixValue = 0x5e; //^

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip( 192, 168, 1, 177 ); //192.168.1.177
EthernetServer server( 80 );

void setup()
{
  Ethernet.begin( mac, ip );
  server.begin();
  Serial.begin( 9600 );
  pinMode( ledR, OUTPUT );
  pinMode( ledG, OUTPUT );
  pinMode( ledB, OUTPUT );
  pinMode( lightSensor, INPUT );
}

void loop(){
  lightValue = analogRead( lightSensor );
  responseValue = map( lightValue, 0, 1023, 0, 100 );

  if ( responseValue >= 75 ) {
    analogWrite( ledR, valueR );
    analogWrite( ledG, valueG );
    analogWrite( ledB, valueB );
  } else if ( ( responseValue >= 30 ) && ( responseValue < 75 ) ) {
    analogWrite( ledR, valueR * 0.6 );
    analogWrite( ledG, valueG * 0.6 );
    analogWrite( ledB, valueB * 0.6 );
  } else if ( responseValue < 30 ) {
    analogWrite( ledR, valueR * 0.3 );
    analogWrite( ledG, valueG * 0.3 );
    analogWrite( ledB, valueB * 0.3 );
  }

  EthernetClient client = server.available();
  if ( client ) {
    boolean currentLineIsBlank = false;
    Serial.write( client.read() );
    while ( client.connected() ) {
      if ( client.available() ) {
        char c = client.read();

        if ( ( c == '\n' ) && ( currentLineIsBlank ) ) {      
          int prefix = client.read();

          client.println( "HTTP/192.168.1.177/ OK" );
          client.print( "Content-Type: " );
          client.println( responseValue );
          client.println( "Access-Control-Allow-Origin: *" ); 
          
          if ( prefix == prefixValue ) {

            valueR = client.read() * 2;
            valueG = client.read() * 2;
            valueB = client.read() * 2;
                           
            client.stop();
          } else {
            client.stop();
          }
        }   
        if ( c == '\n' ) {
          currentLineIsBlank = true;
        } else if ( c != '\r' ) {
          currentLineIsBlank = false;
        }   
      }
    }
  }
}