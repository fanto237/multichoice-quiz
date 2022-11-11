var ws;
var name;
var maca;

function init() {
    var beitretenButton = document.getElementById("Button");
    beitretenButton.addEventListener("click", beitreten);

    document.getElementById("h1").innerHTML = "Lobby ist startklar";
   // var ws = new WebSocket('wss://informatik.hs-bremerhaven.de/docker-jbehling2-websocket/');
    
}

function beitreten() {
    name = document.getElementById("name").value;
    maca = document.getElementById("maca").value;
    if (validateName(name) && validateMacAdresse(maca)) {
        document.getElementById("eingabe").innerHTML="";
        document.getElementById("h1").innerHTML = "Hallo "+name;

        document.getElementById("tabelle").innerHTML = "<tr><th>ID</th><th>Name</th><th>MAC-Adresse</th></tr>";

        //Ajax
        let req  = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var spielerListe = this.responseText.split(";");
                console.log(spielerListe);
                spielerListe.forEach(element => {
                    if (element.length > 3) { 
                        var spielerObj = element.split("-");
                        tableUpdate(spielerObj[0], spielerObj[1]);
                    }
                });

                // document.getElementById("h1").innerHTML = this.responseText;
            }
        }

        req.open("GET", "client.php?name="+name+"&maca="+maca, true);
        req.send();

        tableUpdate(name, maca);
        startWebsocket();
    } else {
        document.getElementById("h1").innerHTML = "Bitte valide Eingaben tätigen";
    }
}

function moreThenOnePlayer() {
    var tabelle = document.getElementById("tabelle");
    var spielerAnzahl = (tabelle.rows.length)-1;
    console.log("Anz Spieler yo: " + spielerAnzahl);
   
    if (spielerAnzahl > 1) {
        document.getElementById("h1").innerHTML = "Mehr als 2 Spieler";
        return true;
    }
    return false;

}

function startWebsocket() {
    ws = new WebSocket('wss://informatik.hs-bremerhaven.de/docker-iot-2021-teamf-websocket/');
    ws.onmessage = function (event) {
        console.log(event.data);
        if (event.data.includes("-")) {
            var dataObj = event.data.split("-");
            tableUpdate(dataObj[0], dataObj[1]);
        }

        if (event.data.includes("SPIELSTART")) {
            window.location.href = "game.html?maca="+maca;
        }

    }
}

function tableUpdate(name, maca) {
    // Tabelle updaten
    var table = document.getElementById("tabelle");
    var spielerAnzahl = (table.rows.length)-1;
  
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = ++spielerAnzahl;
    cell2.innerHTML = name;
    cell3.innerHTML = maca; 

    if (moreThenOnePlayer()) {
        console.log("ich habe nach playern geschaut");
        document.getElementById("container2").innerHTML = "<button id='Button2' class='button'>Spiel starten</button>";
        var startButton = document.getElementById("Button2");
        startButton.addEventListener("click", starten);
    }
}

function starten() {
    //Ajax
    let req  = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            ws.send("SPIELSTART");
            window.location.href = "game.html?maca="+maca;
        }
    }
    req.open("GET", "ladeFragen.php", true);
    req.send();
}

function validateName(str) {
    return /^[A-Za-z\s]+$/.test(str); 
}

function validateMacAdresse(str) {
    return /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/.test(str); 
}



