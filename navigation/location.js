var lat_long = document.getElementById("lat_long");
var lat;
var long;
var prev_lat;
var prev_long;
const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
};

const watchID = navigator.geolocation.watchPosition(success, error, options);

function error() {
    alert('Unable to retrieve your location');
}

function success(data) {
    lat = data.coords.latitude;
    long = data.coords.longitude;
    lat_long.innerHTML = "Latitude: "
    + lat
    + "<br>Longitude: "
    + long;
}

var socket = new WebSocket("ws://localhost:1300/");
socket.onopen = function (e) {
    console.log("Connected");
    setInterval(sendLocation, 1000);
};

socket.onmessage = function (e) {
    console.log(e.data);
};

socket.onerror = function (e) {
    console.log(e);
}

socket.onclose = function (e) {
    console.log("Disconnected");
};


function sendLocation() {
    // If the location is undefined then send "loading..."
    if (lat == undefined || long == undefined) {
        socket.send("loading...");
    }

    // If lat or long is negative then make it positive to compare
    if (Math.sign(lat) == -1) {
        var temp_lat = -lat;
    }
    else {
        var temp_lat = lat;
    }
    if (Math.sign(long) == -1) {
        var temp_long = -long;
    }
    else {
        var temp_long = long;
    }
    // If the user has moved more than 0.001 degrees then assume the info is wrong and don't send it because the user can't move that fast
    if (prev_lat <= temp_lat <= prev_lat + 0.001 || prev_long <= temp_long <= prev_long + 0.001) {
        return;
    }

    // If the user has moved then send the new location
    if (lat != prev_lat || long != prev_long) {
        socket.send(lat + " " + long);
    }

    // Update the previous location
    prev_lat = lat;
    prev_long = long;
}