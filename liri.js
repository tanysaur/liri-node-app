// Variable declaration(s)
var fs = require("fs");

var command = process.argv[2].toLowerCase();
var entry = process.argv.splice(3).join("-").toLowerCase();

// Twitter variables
var keys = require("./keys.js");
var Twitter = require('twitter');
var client = new Twitter({
	consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret,
}); 

var params = {screen_name: 'tanysaur'};

// Spotify variables
var spotify = require('spotify');

// OMBD variables
var request = require("request");

// Initiates the user entry and pushes the commands entered by the user
runCommand(command, entry);

// Switch statement that picks the command the user entered
function runCommand(command, entry){
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
	    doThis();
	    break;
	}
}

// When "my-tweets" is entered by user, this function will run
function tweetThis(entry){
	
	// Calls the NPM package that takes prints out my twitter statuses
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  // If error occurs, 
	  if (error) {
	    console.log("Error: " + error);
	  }
	  else{
	  	for(i = 0; i < tweets.length; i++){
	  		console.log("==========================================================" + "\n \n" +
	  			tweets[i].user.screen_name + ": " + tweets[i].text + "\n" +
	  			tweets[i].user.created_at + "\n"
	  		);
	  	}
		}
	});
}

// Function that will call the Spotify API that will provide info about the track entered by the user
function spotifyThis(entry){
	
	// console.log("SPOTIFY: " + entry);
	
	// If there was no song provided, the console will push track info of "The Sign" by Ace of Base
	if (entry == "") {
		spotify.search({ type: 'track', query: 'The Sign by Ace of Base' }, function(error, data) {

			// Throw error in the console if it occurs
			if (error){
				console.log("An error occured: " + error);
			}

 			console.log("==========================================================" + "\n \n" +
 			"Artist(s): " + data.tracks.items[0].artists[0].name + "\n" +		// Artist(s)
			"Song name: " + data.tracks.items[0].name + "\n" +							// The song's name
			"Preview link: " + data.tracks.items[0].preview_url + "\n" +		// A preview link of the song from Spotify
			"Album: " + data.tracks.items[0].name + "\n" 										// The album that the song is from
 			);
		});
 	}	

 	// If track is valid, API will log first 10 tracks' info regarding the entry provided by user
	else{
		spotify.search({ type: 'track', query: entry }, function(error, data) {

			// Throw error in the console if it occurs
			if (error){
				console.log("An error occured: " + error);
			}

			// Loops over 10 times to provide the first 10 entries provided by the API regarding user entry
	 		for(i = 0; i < 10; i++){
	 			console.log("==========================================================" + "\n \n" +
	 			"Artist(s): " + data.tracks.items[i].artists[0].name + "\n" +		// Artist(s)
				"Song name: " + data.tracks.items[i].name + "\n" +							// The song's name
				"Preview link: " + data.tracks.items[i].preview_url + "\n" +		// A preview link of the song from Spotify
				"Album: " + data.tracks.items[i].name + "\n" 										// The album that the song is from
	 			);
	 		} 	
		});
	}	
}

// Function that calls the ODBM API that will provided information about the movies entered by user
function movieThis(entry){

	// If the user does not enter a movie title, it will default to show OMDB info about the movie: Mr. Nobody
	if(entry == ""){
		request("http://www.omdbapi.com/?t=mr-nobody&y=&plot=short&tomatoes=true&r=json", function(error, response, body) {

		// Throw error in the console if it occurs
		if (error){
			console.log("An error occured: " + error);
		}

		console.log("\n" + "==========================================================" + "\n \n" +
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
	})
	}else{
		// Otherwise, it will then run a request to the OMDB API with the movie specified
		request("http://www.omdbapi.com/?t=" + entry + "&y=&plot=short&tomatoes=true&r=json", function(error, response, body) {

		// Throw error in the console if it occurs
		if (error){
			console.log("An error occured: " + error);
		}

	  // If the request is successful (i.e. if the response status code is 200)
	  else if (!error && response.statusCode === 200) {
	    console.log("\n" + "==========================================================" + "\n \n" +
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
}

// Runs when command 'do-what-it-says' is typed by the user
function doThis(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		
		// If error occurs, print error
		if (error){
			console.log("Error: " + error);
		}

	  // Take data and push it in to an array that is split by commas
	  var dataArr = data.split(",");
	  
	  // Checks if random.txt file is empty or not
	  if(dataArr[0] == ""){
	  	console.log("random.txt file is empty, please write a valid command.\n");
	  }
	  // If not, run the command + entry provided (i.e. spotify-this-song,i-want-it-that-way)
	  else{
	  	return runCommand(dataArr[0], dataArr[1]);
	  }
	});
}

// Create a log.txt file (if non-existent) and log all the commands + entries entered by the user
fs.appendFile("log.txt", command + "," + entry + "\n", function(error) {

  // If an error was experienced we say it.
  if (error) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "log.txt updated!" to our node console.
  else {
    console.log("log.txt updated!\n");
  }

});
