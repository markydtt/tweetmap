// Declare map variable here for to keep inside scope
var map;
// Create the empty keyword array
var keywords = new Array();

var badKeywords = "<h2>Error!</h2> Please make sure that you have entered at least one keyword";

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


// Get socket.io connected and emitting tweets
var socket = io.connect('http://localhost:3000');
socket.on('newTwitt', function (data) {

    // Setup some variables for each tweet to make life easier
    var lat = data.geo.coordinates[0];
    var lng = data.geo.coordinates[1];
    var name = data.user.name;
    var screen_name = data.user.screen_name;
    var tweetText = data.text;
    var displayPicture = data.user.profile_image_url;

    // Post a marker for each new tweet
    var myLatlng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Hello World!'
    });

    // Creating an info window with the tweet content
    var contentString = "<img class='displaypic' src='" + displayPicture + "'><strong>@" + screen_name + "</strong>: " + tweetText;
    // Assign content to the window
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    // Open the tweet info window
    infowindow.open(map, marker);

    // move our map to focus on the new tweet
    var newFocus = new google.maps.LatLng(lat, lng);
    map.setCenter(newFocus);
});




/*
* showKeywords is used to handle user input validation, creation of the 'Active Keywords' box,
* and compiling the array of keywords, before sending off a request to socket.io to get 
* tweets matching the keywords entered.
*
*/
function showKeywords() {
    var data = '';


    var locationInput = document.getElementById('locationSearch').value;
    var keywordInput = document.getElementById('keywordSearch').value;
    var wordList = document.getElementById('words');

    if (keywordInput == '' | keywordInput == null){
      document.getElementById('alert').style.visibility = "visible";
      document.getElementById('alert').innerHTML = badKeywords;
      return false;
    }

    // Keywords weren't empty, so make the keyword display visible and hide any error messages
    document.getElementById('keywordDisplay').style.visibility = "visible";
    document.getElementById('alert').style.visibility = "hidden";
    
    // create second array for any new keywords
    var newkeywords = new Array();
    // Separate the keywords 
    newkeywords = keywordInput.split(' ');
    // Append all keywords into the original array
    keywords = keywords.concat(newkeywords);

    // Iterate through the array and add the keywords to the display
    // also remove any empty keywords
    words.innerHTML = '';
    for (var i = 0; i < keywords.length; i++) {
        // Remove any additional spaces that a user may have entered
        if (keywords[i] == " " | keywords[i] == "") {
            keywords.splice(i, 1);
        }
        // Create an <li> and remove link for each keyword
        else {
            words.innerHTML += "<li>" + keywords[i] + " <a href=''>[Remove]</a></li>";
        }
    }
    // Clear the textbox so users can enter more keywords
    document.getElementById('keywordSearch').value = '';
    // Send user's keywords to get some tweets!
    socket.emit('getTweets', keywords);

    console.log(keywords);

}