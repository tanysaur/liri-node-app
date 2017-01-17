var fs = require("fs");

var command = process.argv[2];
var entry = process.argv[3];

// Twitter
var keys = require("./keys.js");
var Twitter = require('twitter');
var client = new Twitter({
	consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret,

}); 

var params = {screen_name: 'tanysaur'};

// Spotify
var spotify = require('spotify');


// OMBD
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");


switch (command) {
  case "my-tweets":
    tweetThis(entry);
    break;

  case "spotify-this-song":
    spotifyThis(entry);
    break;

  case "movie-this":
    movieThis(entry);
    break;

  case "do-what-it-says":
    doThis(entry);
    break;
}

function tweetThis(entry){
	
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (error) {
	    console.log(error);
	  }
	  else{
	  	for(i = 0; i < tweets.length; i++){
	  		console.log("===========================" + "\n" +
	  			tweets[i].user.screen_name + ": " + tweets[i].text + "\n" +
	  			tweets[i].user.created_at + "\n"
	  			);
	  	}
		}
	});
}

function spotifyThis(entry){
	spotify.search({ type: 'track', query: entry }, function(err, data) {
	  if ( err ) {
	      console.log('Error occurred: ' + err);
	      return;
	  }
 		
 		for(i = 0; i < data.length; i++){
 			console.log("\n" +
 			"Artist(s): " + data.tracks.items[i].artists[0].name + "\n" +		// Artist(s)
			"Song name: " + data.tracks.items[i].name + "\n" +							// The song's name
			"Preview link: " + data.tracks.items[i].preview_url + "\n" +		// A preview link of the song from Spotify
			"Album: " + data.tracks.items[i].name + "\n" 										// The album that the song is from
 			);
 		}


// if no song is provided then your program will default to
// "The Sign" by Ace of Base
	});

console.log("spotify");
}

function movieThis(entry){

	// Then run a request to the OMDB API with the movie specified
	request("http://www.omdbapi.com/?t=" + entry + "&y=&plot=short&tomatoes=true&r=json", function(error, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
	  if (!error && response.statusCode === 200) {

	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    console.log("===========================" + "\n" +
	    	"Title: " + JSON.parse(body).Title + "\n" + 						// Title of the movie.
	    	"Year: " + JSON.parse(body).Year + "\n" +								// Year the movie came out.
	    	"IMBD Rating: " + JSON.parse(body).imdbRating + "\n" +	// IMDB Rating of the movie.
	    	"Country: " + JSON.parse(body).Country + "\n" +					// Country where the movie was produced.
	    	"Language: " + JSON.parse(body).Language + "\n" +				// Language of the movie.
	    	"Plot: " + JSON.parse(body).Plot + "\n" +								// Plot of the movie.
	    	"Actors: " + JSON.parse(body).Actors + "\n" +						// Actors in the movie.
	    	"Rotten Tomatoes rating: " + JSON.parse(body).tomatoUserRating + "\n" +		// Rotten Tomatoes Rating.
	    	"Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + "\n"								// Rotten Tomatoes URL.

	    	);
	  }
	});
}


function doThis(entry){
	fs.readFile("random.txt", "utf8", function(error, data) {

	  // We will then print the contents of data
	  console.log(data);

	  // Then split it by commas (to make it more readable)
	  var dataArr = data.split(",");

	  // We will then re-display the content as an array for later use.
	  console.log(dataArr[0]);
	  console.log(dataArr[1]);

	});
}
