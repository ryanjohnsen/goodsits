let map;
let markers;
let points;
const keller = { lat: 44.9742826, lng: -93.2323081 };

const mockPoints = [{lat: 34.39911, lng: 51.10105}, {lat: -45.88115, lng: 108.45094}, {lat: -7.55853, lng: 69.49165}];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: keller,
        zoom: 17,
        streetViewControl: false,
        mapTypeControl: false,
    });

    // Taken from https://stackoverflow.com/a/29972553
    navigator.geolocation.getCurrentPosition(function (position) {
        var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(initialLocation);
    }, function (positionError) { /* "Error Handling" */ } );

    updateMarkers();
}

function removeMarkers() {
    if (markers != null) {
        markers.array.forEach(e => {
            e.setMap(null);
        });

        points = null;
        markers = null;
    }
}

function updateMarkers() {
    if (points == null) {
        return;
    }

    markers = new Array(points.length);

    for (i = 0; i < points.length; i++) {
        let id = i + 1;
        marker = new google.maps.Marker({
            position: points[i],
            label: "" + id,
            map: map,
        });

        // TODO: Add a listener to hear when one of these markers are clicked and open that location page
        marker.addListener("click", () => {
            console.log("" + id + ": clicked");
        });

        markers[i] = marker;
    }
}

function displayPoints(markerPoints) {
    removeMarkers();
    points = markerPoints;
    if (map != null) {
        updateMarkers();
    }
}

window.initMap = initMap;

displayPoints(mockPoints);