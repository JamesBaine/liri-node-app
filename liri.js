var fs = require("fs");

var request = require("request");

var Twitter = require("twitter");

var Spotify = require("node-spotify-api");

var spotify = new Spotify({
  id: "7638b62a01c64c0ea21da8a01af99cc9",
  secret: "b0b09469e3e547339f4b0800226d53ed"
});

var keys = require("./keys.js");

var command = process.argv[2];

var input = process.argv[3];

switch(command){

  case "my-tweets":
    myTweets();
  break;

  case "spotify-this-song":
    spotifySong(input);
  break;

  case "movie-this":
    getMovie(input);
  break;

  case "do-what-it-says":
    console.log("do it");
  break;

  default:
    console.log("something went wrong");
  return;
}

function myTweets() {
  var client = new Twitter(keys.twitterKeys);

  var params = {
    screen_name: "arrogantswami66"
  };

  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if(!error) {
      var max = 20;
      for (var i=0; i<tweets.length; i++) {
        console.log(tweets[i]);
        if(i>max) {
          break;
        }
      }
    } else if (error) {
      console.log(error);
    }
  });
}

function spotifySong(input){
  spotify.search({ type: "track", query: input }, function(err, data) {
    if(err) {
      spotifyErr();
    } else if (!err) {
      console.log("Song: " + input);
      console.log("Artist: " + JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));
      console.log("Preview Link: " + JSON.stringify(data.tracks.items[0].album.artists[0].external_urls.spotify, null, 2));
      console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
    }
  });
}

function spotifyErr(){
  spotify.search({ type: "track", query: "The Sign" }, function(err, data) {
    if ( err ) {
      console.log("Error occurred: " + err);
    } else if (!err) {
      console.log("Song: The Sign");
      console.log("Artist: " + JSON.stringify(data.tracks.items[3].album.artists[0].name, null, 2));
      console.log("Preview Link: " + JSON.stringify(data.tracks.items[3].album.artists[0].external_urls.spotify, null, 2));
      console.log("Album: " + JSON.stringify(data.tracks.items[3].album.name, null, 2));
    }
  });
}

function getMovie(movieTitle) {
  if (movieTitle === undefined ){
    movieTitle = "Mr Nobody";
  }

  var url = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=full&tomatoes=true&apikey=40e9cece";

  request(url, function(error, response, body){
    if(!error && response.statusCode === 200){
      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMBD Rating:" + jsonData.imbdRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes URL: " + jsonData.tomatoURL);
    }
  });
};
