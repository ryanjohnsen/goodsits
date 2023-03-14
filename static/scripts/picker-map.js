let map;
let geocoder;
let curLoc;
const keller = { lat: 44.9742826, lng: -93.2323081 };

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: keller,
    zoom: 17,
    streetViewControl: false,
    mapTypeControl: false,
  });
  geocoder = new google.maps.Geocoder();

  // Taken from https://stackoverflow.com/a/29972553
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var initialLocation = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      map.setCenter(initialLocation);
    },
    function (positionError) {
      /* "Error Handling" */
    }
  );

  let marker = null;

  map.addListener("click", (mapsMouseEvent) => {
    curLoc = mapsMouseEvent.latLng.toJSON();

    // Removes and deletes the current marker
    if (marker != null) {
      marker.setMap(null);
      marker = null;
    }

    marker = new google.maps.Marker({
      position: mapsMouseEvent.latLng,
      map: map,
    });

    // FIXME: is there a better way to do this??
    coord = `${curLoc.lat},${curLoc.lng}`;
    document.getElementById("location").value = coord;

    updateAddress();
  });
}

function updateAddress() {
  geocoder
    .geocode({ location: curLoc })
    .then((response) => {
      if (response.results[0]) {
        document.getElementById("address").textContent =
          response.results[0].formatted_address;
      } else {
        console.log("No Reverse Geocode Result...");
      }
    })
    .catch((e) => console.log("Error While Reverse Geocode..."));
}

window.initMap = initMap;
