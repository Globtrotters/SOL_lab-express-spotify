const express = require('express');
const app = express();

const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

require('dotenv').config();

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const access_token = '';

const spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi
	.clientCredentialsGrant()
	.then((data) => {
		spotifyApi.setAccessToken(data.body['access_token']);
	})
	.catch((err) =>
		console.log('Something went wrong when retrieving an access token', err)
	);

// Our routes go here:

app.get('/', (req, res, next) => res.render('home'));

app.get('/artists', (req, res, next) => {
	spotifyApi
		.searchArtists(req.query.theArtistName) 
		.then((data) => {
			res.render('artists', { allTheArtists: data.body.artists.items });
		})
		.catch((err) => console.log('Error while getting the artists: ', err));
});

//                artistId => this is placeholder, can be any word,
//                            just make sure you use the same word in "req.params.______"
app.get('/albums/:artistId', (req, res, next) => {
	// console.log("Id is: ", req.params);
	spotifyApi
		//               '/albums/:artistId', the second param is optional
		//                            |
		//                            V
		.getArtistAlbums(req.params.artistId, { limit: 5 })
		.then((data) => {
			// console.log(" = = == = == = = = =",data.body);
			res.render('albums', { allTheAlbums: data.body.items });
		})
		.catch((err) => console.log('Error while getting the albums: ', err));
});

// Get tracks in an album
app.get('/tracks/:albumId', (req, res, next) => {
	spotifyApi
		.getAlbumTracks(req.params.albumId)
		.then((data) => {
			//   console.log("++++++++", data.body);
			res.render('tracks', { tracks: data.body.items });
		})
		.catch((err) => console.log('Error while getting the tracks: ', err));
});

app.listen(3000, () =>
	console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
