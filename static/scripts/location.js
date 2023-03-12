function getAddy() {  
    let address = document.getElementById('addy').innerText;
    let myLatitude	= address.split(",")[0];
    myLatitude = parseFloat(myLatitude.split("(")[1]);
    let myLongitude	= address.split(",")[1];
    myLongitude = parseFloat(myLongitude.split(")")[0]);
    var geocoder = new google.maps.Geocoder();							
    var location = new google.maps.LatLng(myLatitude, myLongitude);		
        
    geocoder.geocode({'latLng': location}, function (results, status) {
        if(status == google.maps.GeocoderStatus.OK) {		
            let addy = results[0].formatted_address;
            let addyContainer = document.getElementById('addy');				
            addyContainer.innerText = addy;
            addyContainer.style.display = 'block';
        } else {
            alert("Geocode failure: " + status);
            return false;
        }
    });
}