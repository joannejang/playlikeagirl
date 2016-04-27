
var global_lat;
var global_lon;

function initParse() { 
  Parse.initialize("sRLbnydTQeK22Vuwtduri11cTKYgteCs1IJDFGTM", "hi9NPEa6jobeRyQkXohCS8vAoCu5U0MRD3TwdMIH");
}

// var Game = Parse.Object.extend("Game", {}, {
//       // Class methods
//       create: function(sport, time, duration, geoloc, skill, numppl) {
//         var game = new Game();
//         game.set("sport", sport);
//         game.set("time", time);
//         game.set("duration", duration);
//         game.set("lat", lat);
//         game.set("lon", lon);
//         game.set("skill", skill);
//         game.set("numppl", numppl);
//         return game;
//       }
//     });

function createGame() {
  // sport, time, duration, geo, skill, numppl
  var Game = Parse.Object.extend("Game", {}, {
      // Class methods
      create: function(sport, time, duration, geoloc, skill, numppl) {
        var game = new Game();
        game.set("sport", sport);
        game.set("time", time);
        game.set("duration", duration);
        game.set("lat", lat);
        game.set("lon", lon);
        game.set("skill", skill);
        game.set("numppl", numppl);
        return game;
      }
    });

  var sport = $("#sport").text()
  var time = $("#text").text()
  var duration = 1.5 // default
  var loc = $("#geolocation").text()

  //fun(loc)
  // var response = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA" + "&key=AIzaSyApQNttRT0dBuQhCDAFfwlhVTfhCLrMcsY";


  var lat = global_lat 
  var lon = global_lon
  alert("lat, lon: " + lat + ", " + lon)
  var skill = 1 // default
  var numppl = 1 // default
	var game = Game.create(sport,time,duration,lat,lon,skill,numppl);
  console.log("Sport type: " + sport)
  console.log("Time: " + time)
  console.log("Location: " + loc)
  // alert(loc)
  // console.log(game.get("sport"))
	game.save();
  initMap();


}



function joinGame(id) {
  alert("joining game")
  var Game = Parse.Object.extend("Game", {}, {
      // Class methods
      create: function(sport, time, duration, geoloc, skill, numppl) {
        var game = new Game();
        game.set("sport", sport);
        game.set("time", time);
        game.set("duration", duration);
        game.set("lat", lat);
        game.set("lon", lon);
        game.set("skill", skill);
        game.set("numppl", numppl);
        return game;
      }
    });
  var query = new Parse.Query(Game);
  console.log(id)
    query.get(id, {
      success: function(game) {
        var curNum = game.get("numppl")
        game.set("numppl",curNum+1)
        game.save().then(
          function(object) {
            document.location.reload(true)
          },
          function(error) {
    // saving the object failed.
          });
    // The object was retrieved successfully.
    },
      error: function(object, error) {
        console.log('BAD')
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
    }
  });
}

function popup() {
	alert("hello")
	console.log('fuck')
}

var allGames = []	

function loadMap() {
  var locations_array = [];
  for (var i = 0; i < allGames.length; i++) {
    var game = allGames[i];
    var game_map = {}
      game_map['lat'] = game["lat"]
      game_map['lon'] = game["lon"]
      htmlStr = "<div class=\"info\"><b>" + game["sport"] + "</b><br/><br/>" + game["time"] + "<br/> Duration (hrs): " + game["duration"] + "<br/> People attending: " + game["numppl"]// inside info window
      htmlStr += "<br/><br/><input type=\"button\" value=\"Join Game\" onClick=\"joinGame(" + "'"+game.id +"'" +");\"></div>"
      game_map['html'] = htmlStr
      game_map['title'] = "" + game["sport"] + "<br/>" + game["time"]

      locations_array.push(game_map)
  }
    
  console.log(locations_array.length);
    
    new Maplace({
        //locations: [{lat: 37.383, lon: -122.041, html: "Soccer", title: 'Soccer 4:30 PM'}, {lat: 37.392, lon: -122.037, html: "Rock Climbing", title: 'Rock Climbing 8:30 PM'}, {lat: 37.398, lon: -122.129, html: "Volleyball", title: 'Volleyball 6:45 PM'}],
        locations: locations_array,
        map_div: '#gmap-menu',
        controls_type: 'list',
        controls_on_map: false
    }).Load(); 
}

function getAllGames() {
  var Game = Parse.Object.extend("Game", {}, {
      // Class methods
      create: function(sport, time, duration, geoloc, skill, numppl) {
        var game = new Game();
        game.set("sport", sport);
        game.set("time", time);
        game.set("duration", duration);
        game.set("lat", lat);
        game.set("lon", lon);
        game.set("skill", skill);
        game.set("numppl", numppl);
        return game;
      }
    });
	alert("Getting all games")
	var query = new Parse.Query(Game);
    // query.equalTo("sport", "basketball");
    query.find({
    success: function(results) {
      // The object was retrieved successfully.
      console.log(results.length);
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
//         object.destroy({
//         success: function(myObject) {
//     console.log("deleted");
//   },
//   error: function(myObject, error) {
//     // The delete failed.
//     // error is a Parse.Error with an error code and message.
//   }
// });
        var gameData = {}
    	gameData['sport'] = object.get('sport')
    	gameData['time'] = object.get('time')
    	gameData['duration'] = object.get('duration')
    	gameData['lat'] = object.get('lat')
      gameData['lon'] = object.get('lon')
    	gameData['skill'] = object.get('skill')
    	gameData['numppl'] = object.get('numppl')
      gameData['id'] = object.id

        console.log(object.id + ' - ' + gameData);
        allGames.push(gameData)
      }
      // console.log(object.foo);
    },
    error: function(error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
      console.log("error");
    }
    });
}

// sanity check
function printOutGames() {
	console.log("Length of all games: " + allGames.length)

     for (var i = 0; i < allGames.length; i++) {
      	var curGame = allGames[i]
      	console.log("Game " + i)
      	for (var k in curGame) {
      		console.log(curGame[k])
      	}
      }
}

function initMap() {
	getAllGames()
	setTimeout(loadMap, 500)
  //loadMap()

    console.log("HALLLLO")
 
	alert("initialized map")
	console.log("FUCK");
}

// Katherine's stuff
function reply_click(img, clicked_id) {
  img.src = "assets/"+clicked_id+"selected.png";
  localStorage.setItem('sport', clicked_id);
  // console.log(localStorage.getItem('sport'));
}

function getSportName() { 
  // console.log(localStorage.getItem('sport'));
  document.getElementById("sport").innerHTML = localStorage.getItem('sport');
}

function getTime() { 
  // console.log(localStorage.getItem('sport'));
  document.getElementById("time").innerHTML = document.getElementById('start-times').value;
}

function getLocation() {
  document.getElementById("geolocation").innerHTML = document.getElementById('autocomplete').value;
}

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};
function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});
  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}




// [START region_fillform]
function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  global_lat = place.geometry.location.lat();
  global_lon = place.geometry.location.lng();
  for (var component in componentForm) {
    document.getElementById(component).value = "Default";
    document.getElementById(component).disabled = false;
  }
  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  };
}
// [END region_fillform]
// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
// [END region_geolocation]


