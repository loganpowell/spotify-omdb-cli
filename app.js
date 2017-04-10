// const Promise = require('bluebird')
const prompt = require('prompt')
const request = require('request')

const spotify = require('./router/spotify-route.js')
const movies = require('./router/movie-route.js')

let schema = {
  properties: {
    channel: {
      description: 'Would you like to search for music or movies?',
      pattern: /music|Music|movies?|Movies?/,
      message: 'Please choose either "music" or "movies"',
      type: 'string',
      required: true
    }
  }
}
prompt.start()

prompt.get(schema, (err, UserInput) => {
  let channel = UserInput.channel
  if (channel === 'music') {
    spotify.spotifyRoute()
  } else if (channel === 'movies') {
    movies.movieRoute()
  } else {
    console.log('please try again...')
  }
})
