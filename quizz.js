'use strict';

let ws;
let maca;
let loesungen;
let richtigeAntwort;
let firstMac;

function init() {
    let clear = document.getElementById("clear");
    clear.addEventListener("click", spielBeenden);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    maca = urlParams.get('maca');

    checkMacAdresse(maca, function (name) {
        if (name.length < 1) {
            console.log("keine gültige mac adresse gefunden");
            window.location.href = "client.html";
        }
    });

    startWebsocket();
    getQuestion();
}

function startWebsocket() {
    firstMac = true;
    ws = new WebSocket('wss://informatik.hs-bremerhaven.de/docker-iot-2021-teamf-websocket/');
    ws.onmessage = function (event) {
        console.log(event.data);
        if (event.data.includes("SPIELSTOPP")) {
            window.location.href = "client.html";
        }

        if (event.data.includes("NEXTROUND")) {
            resetPlayground();
            getQuestion();
        }

        if (event.data.includes(":") && firstMac === true) {

            console.log("Mac-Adresse: " + event.data + " hat gedrückt");
            checkMacAdresse(event.data, function (name) {
                if (name.length > 1) {
                    firstMac = false;
                    nächsterSpielzug(name);
                }
            });
        }

    }
}

function getQuestion() {
    let data;
    let boom = document.getElementById("boom");
    boom.addEventListener("click", amITheFirstOne);

    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            data = this.responseText;
            data = JSON.parse(data);
            //console.log(data);

            data.forEach(element => {
                document.getElementById("frage").innerHTML = element.question;
                let fragen = element.answers;
                console.log(fragen);
                Object.entries(fragen).forEach(value => {
                    if (value[1] !== null ) {
                        let key = value[0];
                        let val = value[1];
                        createAnswerButton(key, val);
                    }
                });

                loesungen = element.correct_answers;
                console.log(loesungen);
                Object.entries(loesungen).forEach(value => {
                    if (value[1] === "true") {
                        richtigeAntwort = value[0];
                    }
                });
                
                //console.log("Richtige Antwort: " + richtigeAntwort);
                richtigeAntwort = richtigeAntwort.replace("_correct", "");
            });

        }
    }
    let timenow = Date.now();
    req.open("GET", "fragen.json?version="+timenow, true);
    req.send();
}

function nächsterSpielzug(name) {
    let boom = document.getElementById("boom");
    boom.removeEventListener("click", amITheFirstOne);
    boom.innerHTML = name + " war am schnellsten";

    setTimeout(function () {
        // Code, der erst nach 5 Sekunden ausgeführt wird
        let richtigerAntwortButton = document.getElementById(richtigeAntwort);
        richtigerAntwortButton.style.backgroundColor = "green";
        boom.innerHTML = "Nächste Runde";
        boom.addEventListener("click", nextRound);
    }, 5000);
}

function resetPlayground() {
    let richtigerAntwortButton = document.getElementById(richtigeAntwort);
    richtigerAntwortButton.style.backgroundColor = "#78c7f5";

    let antworten = document.getElementsByClassName("antwort");
    while (antworten.length > 0) {
        antworten[0].remove();
    }

    let boom = document.getElementById("boom");
    boom.removeEventListener("click", nextRound);
    boom.innerHTML = "Ich weiß es";

    firstMac = true;
}

function amITheFirstOne() {
    // Sende Anfrage an den Server ob ich der erste war
    console.log("Ich habe gedrückt " + maca);
    ws.send(maca);
}

function spielBeenden() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            ws.send("SPIELSTOPP");
            window.location.href = "client.html";
        }
    }
    req.open("GET", "spielBeenden.php", true);
    req.send();
}

function nextRound() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            resetPlayground();
            getQuestion();
            ws.send("NEXTROUND");
        }
    }
    req.open("GET", "ladeFragen.php", true);
    req.send();
}

function checkMacAdresse(maca, resultCallback) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let name = this.responseText;
            resultCallback(name);

        }
    }
    req.open("GET", "checkMacAdresse.php?maca=" + maca, true);
    req.send();
}

function createAnswerButton(answer_X, val) {
    let answer = document.createElement("button");
    answer.setAttribute("id", answer_X);
    answer.setAttribute("class", "button antwort");
         
    let container2 = document.getElementById("container2");
    container2.appendChild(answer);
    document.getElementById(answer_X).innerHTML = val;
}

function remove_X(answer_X) {
    var elem = document.getElementById(answer_X);
    elem.parentNode.removeChild(elem);
}