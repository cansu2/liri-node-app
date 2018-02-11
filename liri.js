var song = "";
var movie = "";
var twitterAcc = "";

//fs

const fse = require('fs-extra');

const file = './random.txt';


//twitter

var twitterKey = require("./key.js");
var Twitter = require('twitter');

var client = new Twitter(twitterKey);


//spotify

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id:"c747cb6d066d4198980607a2c6992938",
    secret:"91594d0036014233b41c34f509fa7bed"
})


// request & inquirer

var request = require("request");
var inquirer = require("inquirer");



//functions 


function getTweets() {
    var params = {screen_name: twitterAcc};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) throw error; 
        if (!error) {
        for (var i in tweets) {
            console.log(tweets[i].created_at);
            console.log(tweets[i].text);
            
        }
      }
    });
}


function getSpotify() {
    console.log("songsonsgonsglallal")
    
    spotify.search({ type:'track', query: song}, function(err,data){
        if (err){
            return console.log('Error occurred: ' + err);
        }
      
        object = JSON.stringify(data, null, 2);

        console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
        console.log("Song: " + JSON.stringify(data.tracks.items[0].name, null, 2));
        console.log("Spotify Link: " + JSON.stringify(data.tracks.items[0].external_urls, null, 2));
        console.log("Album name: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
    

        fse.writeFile("spotifyapi.txt", object, function(err) {

            if (err) {
              return console.log(err);
            }
            // console.log("check spotifyapi.txt");
          
          });
    });
}

function getMovie() {
    console.log(movie)

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {

    
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("imdb Rate: " + JSON.parse(body).imdbRating);
    // console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log("Languages: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors)
  
    }
   });
}

function getRandom(){
    
   fse.readFile(file, "utf8" ,function(error, data){
         if (error){
            return console.log("fs error" + error);
        }  
        console.log(data); 
    })

}

inquirer
     .prompt([
         {
            type: "list",
            message: "What do you wanna do?",
            choices: ["my-tweets", "spotify-this-song", "movie-this","do-what-it-says"],
            name: "command"
         }
     ])
     .then(function(inquirerResponse){

         //twitter

         if (inquirerResponse.command === "my-tweets"){
            inquirer 
            .prompt([{
                type: "input",
                message: "Whose tweets do you wanna see ? Make sure its his/her username.",
                name: "tweet"
            }])
            .then(function(inquirerResponse){
                if (inquirerResponse.tweet){
                    twitterAcc = inquirerResponse.tweet;
                    getTweets();
                }
            }); 
         }

         //spotify

         if (inquirerResponse.command === "spotify-this-song"){
            inquirer 
            .prompt([{
                type: "input",
                message: "What song do you wanna spotify?",
                name: "searchSong"
            }])
            .then(function(inquirerResponse){
                if (inquirerResponse.searchSong){
                    song = inquirerResponse.searchSong;
                    getSpotify();
                } if (inquirerResponse.searchSong === "") {
                    song = "The Sign Ace Base";
                    getSpotify();
                }
            }); 
         } 

         //ombd

         if (inquirerResponse.command === "movie-this"){
            inquirer 
            .prompt([{
                type: "input",
                message: "What movie you are looking for?",
                name: "searchMovie"
            }])
            .then(function(inquirerResponse){
                if (inquirerResponse.searchMovie){
                    movie = inquirerResponse.searchMovie;
                    getMovie();
                } if (inquirerResponse.searchMovie === ""){
                    movie = "Mr.Robot";
                    getMovie();
                }
            }); 
         }

         //random

         if (inquirerResponse.command === "do-what-it-says"){
          getRandom();
         }
    
     })




