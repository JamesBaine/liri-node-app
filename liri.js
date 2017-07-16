var fs = require("fs");

var request = require("request");

var twitter = require("twitter");

var spotify = require("node-spotify-api");

var keys = require("./keys.js");

var params = 20;

var client = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var command = process.argv[2];

var input = process.argv[3];

switch(command){

  case "my-tweets":
    myTweets();
  break;

  case "spotify-this-song":
    spotifySong(input);
  break;

  case "do-what-it-says":
    console.log("do it");
  break;

  default:
    console.log("something went wrong");
  return;
}

function myTweets() {
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
  spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
    if ( err ) {
      console.log('Error occurred: ' + err);
    } else if (!err) {
      console.log("Song: The Sign");
      console.log("Artist: " + JSON.stringify(data.tracks.items[3].album.artists[0].name, null, 2));
      console.log("Preview Link: " + JSON.stringify(data.tracks.items[3].album.artists[0].external_urls.spotify, null, 2));
      console.log("Album: " + JSON.stringify(data.tracks.items[3].album.name, null, 2));
    }
  });
}
