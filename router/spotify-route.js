const prompt = require('prompt')
const request = require('request')

let spotifyRoute = () => {

  let schema = {
    properties: {
      searchType: {
        description: 'Would you like to search for an "album", "artist", "track", or "playlist"?',
        message: 'Please use one of the terms provided in "" above',
        type: 'string',
        pattern: /album|artist|track|playlist/,
        required: true
      },
      searchTerm: {
        description: 'Enter your search term(s)',
        type: 'string',
        required: true
      }
    }
  }
  prompt.start()


  prompt.get(schema, (err, UserInput) => {
    let searchTerm = UserInput.searchTerm.split(' ').join('+')
    let searchType = UserInput.searchType
    // spotify key: 6181defd84ac4c488a5f6aad9f94a4f4

    let outputModel = (results) => {
      if (searchType === 'album') {
        results.forEach((result) => {
          console.log(result.name)
          console.log('Artist: ' + result.artists[0].name)
          console.log('Play it!: ' + result.artists[0].external_urls.spotify +
          '\n\n--------------------------------------------------------------- \n')
        })
      } else if (searchType === 'artist') {
        results.forEach((result) => {
          console.log(result.name)
          console.log('Follower Count: ' + result.followers.total)
          console.log("Check'em out: " + result.external_urls.spotify +
          '\n\n---------------------------------------------------------------- \n')
        })
      } else if (searchType === 'track') {
        results.forEach((result) => {
          console.log(result.name)
          console.log('Artist: ' + result.artists[0].name)
          console.log('Play it!: ' + result.external_urls.spotify +
          '\n\n--------------------------------------------------------------- \n')
        })
      } else if (searchType === 'playlist') {
        results.forEach((result) => {
          console.log('Playlist: ' + result.name)
          console.log('Owner: ' + result.owner.id)
          console.log('Track Count: ' + result.tracks.total)
          console.log('Play it!: ' + result.external_urls.spotify +
          '\n\n--------------------------------------------------------------------------------- \n')
        })
      }
    }

    let spotifyURL = `https://api.spotify.com/v1/search?q=${searchTerm}&type=${searchType}`
    console.log(spotifyURL)

    let spotifySearch = () => {
      request({
        url: spotifyURL,
        json: true
      }, (error, response, body) => {
        if (error) {
          console.log("Couldn't reach Spotify :(")
        } else if (body[`${searchType}s`].total === 0) {
          console.log("No results... Let's try that again...")
        } else if (body[`${searchType}s`].total > 0) {
          let results = body[`${searchType}s`].items
          outputModel(results)
        } else {
          console.log('nothing yet')
        }
      })
    }
    spotifySearch()

  })
}
// spotifyRoute()

module.exports.spotifyRoute = spotifyRoute
