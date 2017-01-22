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

// Pushes the commands entered by the user
runCommand(command, entry);

// This will write the command + entry on the log.txt file and doThis will read any commands written except for "do-what-it-says"
// if(command != "do-what-it-says"){
// 	// It will print the command & entry in the file random.txt
// 	fs.writeFile("random.txt", command + "," + entry, function(error) {

// 	  // If the code experiences any errors it will log the error to the console.
// 	  if (error) {
// 	    return console.log(err);
// 	  }
// 	  // Otherwise, it will print: "random.txt was updated!"
// 	  console.log("random.txt was updated! \n");

// 	  runCommand(command, entry);
// 	});

// 	// Bypass writing the command and entry for do-what-it-says command
// }else{
// 	doThis();
// }


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
	
	// If there was no song provided, the console will push info 'I saw the sign' by Ace of Base
	if (entry == "") {
		console.log("I SAW THE SIGN");
	// 	spotify.lookup({type: 'track', id: '3AkdHnSTgdBY8FeRCzjfHN'}, function(error, data) { 
	// 		// spotify.get('I saw the sign', function(error, data) {
	// 			console.log(data);
	// 		if (error){
	// 			console.log("An error occured: " + error);
	// 			return;
	// 		} 
	// 	});
 	}	

 	// If track is valid, API will log first 10 tracks' info regarding the entry provided by user
	else{
		spotify.search({ type: 'track', query: entry }, function(error, data) {

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
	
	// Then run a request to the OMDB API with the movie specified
	request("http://www.omdbapi.com/?t=" + entry + "&y=&plot=short&tomatoes=true&r=json", function(error, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
	  if (!error && response.statusCode === 200) {

	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
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
