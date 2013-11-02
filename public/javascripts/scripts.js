
// Declare map variable here for to keep inside scope
var map;
// Create the empty keyword array
var keywords = new Array();

var badKeywords = "<h2>Error!</h2> Please make sure that you have entered at least one keyword";
var badLocation = "<h2>Error!</h2> Please ensure that you've entered a valid location!"

// Get the map setup with our map-canvas div
function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);


function getLocation(){
    geocoder = new google.maps.Geocoder();
    var locationInput = document.getElementById('locationSearch').value;
    geocoder.geocode( { 'address': locationInput}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      document.getElementById('alert').style.visibility = "hidden";
      map.setCenter(results[0].geometry.location);
    } else {
      document.getElementById('alert').style.visibility = "visible";
      document.getElementById('alert').innerHTML = badLocation;
    }
  });
}

function checkRadius(lat, lng){
    // import geocoder
    geocoder = new google.maps.Geocoder();
    var locationInput = document.getElementById('locationSearch').value;
    geocoder.geocode( { 'address': locationInput}, function(results, status){

       var searchedLat = results[0].geometry.location.lb;
       var searchedLng = results[0].geometry.location.mb;

       // LatLng object for the search
       var searchedLocation = new google.maps.LatLng(searchedLat,searchedLng);
       var tweetLocation = new google.maps.LatLng(lat,lng);
       console.log('lat: ' + searchedLat + ' lng: ' + searchedLng + ' and... ' + lat + ',  ' + lng);
       // computeDistanceBetween returns distance in metres - so 100km = 100,000m
       if (google.maps.geometry.spherical.computeDistanceBetween(searchedLocation, tweetLocation) <= 100000){
            return true;
       }
       else{
            return false;
       }
       console.log(google.maps.geometry.spherical.computeDistanceBetween(searchedLocation, tweetLocation));
    });
}
