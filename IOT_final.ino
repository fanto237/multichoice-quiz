#include <WebSocketsClient.h>
#include <WiFi.h>
#include <esp32fota.h>

#define PIN_BUTTON 4                     // Pin, an dem der Taster angeschlossen ist.
#define PIN_LED 5                        // Pin, an dem die LED angeschlossen ist.
#define WS_Server "informatik.hs-bremerhaven.de"
#define Port 443
#define WS_url "/docker-iot-2021-teamf-websocket/"
#define myLED 4 

WebSocketsClient webSocket;
WiFiClientSecure clientForOta;
secureEsp32FOTA esp32FOTA("esp32", 2);

byte abbruch = 60;
boolean toogle=true;
boolean taster=false;
const String macstring = WiFi.macAddress();  
const char* mac = const_cast<char*>(macstring.c_str());
const char* ssid = "";
const char* password = "";

void websocketEvent(WStype_t type, uint8_t * payload, size_t length)
{
	switch (type)
	{
		case WStype_ERROR: 
			Serial.println("Error");
			break;
		case WStype_DISCONNECTED: 
			Serial.println("Disconnected");
			break;
		case WStype_CONNECTED:
			Serial.println("Connected");
			//webSocket.sendTXT("Hallo, ich bin online");
			break;
		case WStype_TEXT:
			Serial.printf("Nachricht erhalten: %s\n", payload);
			break;
		default:
			break;
	}
}


void setup()
{
	Serial.begin(115200);
	pinMode(PIN_LED, OUTPUT);               // Pin, an dem die LED angeschlossen ist, als Ausgang festlegen.
	pinMode(PIN_BUTTON, INPUT);      // Pin, an dem der Taster angeschlossen ist, als Eingang mit aktiviertem Pull-Up-Widerstand festlegen.

	WiFi.begin(ssid, password);
	while (WiFi.status() != WL_CONNECTED) {
		digitalWrite(PIN_LED, toogle);
		toogle=!toogle;
		delay(500);
		abbruch--;
		if (abbruch == 0)
			ESP.restart();
	}
	Serial.println(WiFi.localIP());
	digitalWrite(PIN_LED, true);

	esp32FOTA._host="informatik.hs-bremerhaven.de";
	esp32FOTA._descriptionOfFirmwareURL="/docker-flignitz-web/fota/firmware.json";


	esp32FOTA.clientForOta=clientForOta;
	esp32FOTA.clientForOta.setInsecure();
	bool shouldExecuteFirmwareUpdate=esp32FOTA.execHTTPSCheck();
	if(shouldExecuteFirmwareUpdate)
	{
		Serial.println("Firmware update available!");
		esp32FOTA.executeOTA();
	}
	Serial.print("Verbinde zum WebSocket");
	webSocket.beginSSL(WS_Server, Port, WS_url);
	webSocket.onEvent(websocketEvent);

	//	attachInterrupt(PIN_BUTTON, isr, RISING);

}



void loop()
{
	webSocket.loop();	
	if (digitalRead(PIN_BUTTON) == HIGH && taster == false) {  // Wenn auf der Eingangsleitung des Tasters HIGH anliegt ...
		digitalWrite(PIN_LED, HIGH);          // LED anschalten,
		webSocket.sendTXT(mac);
		taster = true;
	} 
	if (digitalRead(PIN_BUTTON) == LOW)  {                                // sonst ...
		digitalWrite(PIN_LED, LOW);           // LED ausschalten.
		taster = false;
		delay(50);
	}

}
