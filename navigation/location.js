var lat_long = document.getElementById("lat_long");
var address = document.getElementById("address");
var direction = document.getElementById("direction");
var distance = document.getElementById("distance");
var lat;
var long;
var prev_lat;
var prev_long;
const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
};
const directions = {
    0: "Forward",
    1: "Right",
    2: "Backward",
    3: "Left"
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
    const reverseGeocodingUrl = "https://api.geoapify.com/v1/geocode/reverse?lat=" + lat + "&lon=" + long + "&apiKey=8e30ef8a19f04b3eb34988e2353a12ac";
  
    // call Reverse Geocoding API - https://www.geoapify.com/reverse-geocoding-api/
    fetch(reverseGeocodingUrl).then(result => result.json())
    .then(featureCollection => {
        address.innerHTML = "Address: " + featureCollection.features[0].properties.formatted;
    });
}

var socket = new WebSocket("ws://localhost:1300/");
socket.onopen = function (e) {
    console.log("Connected");
    setInterval(sendLocation, 1000);
};

socket.onmessage = function (e) {
    const msg = JSON.parse(e.data);
    console.log(msg);
    switch (msg.type) {
        case "movement":
            direction.innerHTML = "Direction: " + directions[msg.message.direction];
            distance.innerHTML = "Distance: " + msg.message.distance + " meters";
            break;
        default:
            console.log("Unknown message type: " + msg.type);
    }
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
        const msg = JSON.stringify({"type": "loading"});
        socket.send(msg);
    }

    /*
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
    */

    // If the user has moved then send the new location
    if (lat != prev_lat || long != prev_long) {
        const msg = JSON.stringify(
            {
                "type": "location",
                "message": {
                    "latitude": lat,
                    "longitude": long
                }
            }
        );
        socket.send(msg);
    }

    // Update the previous location
    prev_lat = lat;
    prev_long = long;
}