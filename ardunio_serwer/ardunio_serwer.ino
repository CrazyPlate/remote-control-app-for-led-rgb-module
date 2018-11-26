#include <SPI.h>
#include <Ethernet.h>

const int pinsRGB[] = {3, 5, 6};
const int lightSensor = A0;

int valueRGB[] = {255, 0, 0};
int lightValue = 0;
int postValue = 0;
unsigned int rgbColour[3];

const int prefixValue = 0x5e; //^

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED}; // 222.173.190.239.254.237
IPAddress ip(192, 168, 1, 177); //192.168.1.177
EthernetServer server(80);

void setup()
{
  Ethernet.begin(mac, ip);
  server.begin();
  Serial.begin(9600);
  pinMode(pinsRGB[0], OUTPUT);
  pinMode(pinsRGB[1], OUTPUT);
  pinMode(pinsRGB[2], OUTPUT);
  pinMode(lightSensor, INPUT);
}

void loop()
{
  lightValue = analogRead(lightSensor);
  postValue = map(lightValue, 0, 1023, 0, 100);

  setColourRgb(valueRGB[0] * postValue/100, valueRGB[1] * postValue/100, valueRGB[2] * postValue/100);

  EthernetClient client = server.available();
  if (client)
  {
    boolean currentLineIsBlank = false;
    while (client.connected())
    {
      if (client.available())
      {
        char c = client.read();

        if ((c == '\n') && (currentLineIsBlank))
        {
          int prefix = client.read();

          sendValueToClient(client, postValue);
          
          if (prefix == prefixValue)
          {
            int otype = client.read();
            if (otype == 65)
            {
              int scenery = client.read();
              if (scenery == 66)
                rainbowScenery();
              else if (scenery == 67)
                hotScenery();
              else if (scenery == 68)
                coldScenery();
              client.stop();
            }
            else
            {
              valueRGB[0] = client.read() * 2;
              valueRGB[1] = client.read() * 2;
              valueRGB[2] = client.read() * 2;

              client.stop();
            }
          }
          else
            client.stop();
        }
        if (c == '\n')
          currentLineIsBlank = true;
        else if (c != '\r')
          currentLineIsBlank = false;
      }
    }
  }
}
void sendValueToClient(EthernetClient client, int postValue)
{
  client.println("HTTP/192.168.1.177/ OK");
  client.print("Content-Type: ");
  client.println(postValue);
  client.println("Access-Control-Allow-Origin: *");
}
void rainbowScenery()
{
  rgbColour[0] = 255;
  rgbColour[1] = 0;
  rgbColour[2] = 0;
  for (int decColour = 0; decColour < 3; decColour++)
  {
    int incColour = decColour == 2 ? 0 : decColour + 1;
    for (int i = 0; i < 255; i++)
    {
      rgbColour[decColour]--;
      rgbColour[incColour]++;
      setColourRgb(rgbColour[0], rgbColour[1], rgbColour[2]);
      delay(50);
    }
  }
}
void hotScenery()
{
  rgbColour[0] = 255;
  rgbColour[1] = 0;
  rgbColour[2] = 0;
  for (int i = 0; i < 255; i++)
  {
    rgbColour[1]++;
    setColourRgb(rgbColour[0], rgbColour[1], rgbColour[2]);
    delay(30);
  }
  rgbColour[0] = 255;
  rgbColour[1] = 255;
  rgbColour[2] = 0;
  for (int i = 0; i < 255; i++)
  {
    rgbColour[1]--;
    setColourRgb(rgbColour[0], rgbColour[1], rgbColour[2]);
    delay(30);
  }
}
void coldScenery()
{
  rgbColour[0] = 0;
  rgbColour[1] = 0;
  rgbColour[2] = 255;
  setColourRgb(rgbColour[0], rgbColour[1], rgbColour[2]);
  for (int incColour = 1; incColour < 3; incColour++)
  {
    int decColour = incColour == 1 ? 2 : 1;
    for (int i = 0; i < 255; i++)
    {
      rgbColour[incColour]++;
      setColourRgb(rgbColour[0], rgbColour[1], rgbColour[2]);
      delay(20);
    }
    for (int i = 0; i < 255; i++)
    {
      rgbColour[decColour]--;
      setColourRgb(rgbColour[0], rgbColour[1], rgbColour[2]);
      delay(30);
    }
  }
}
void setColourRgb(unsigned int red, unsigned int green, unsigned int blue)
{
  analogWrite(pinsRGB[0], red);
  analogWrite(pinsRGB[1], green);
  analogWrite(pinsRGB[2], blue);
}