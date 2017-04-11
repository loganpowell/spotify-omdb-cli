const prompt = require('prompt')
const request = require('request')
const co = require('co')

const twitter = require('../twitter/twitter.js')

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
          co(function* () { res = {
            ALBUM: result.name,
            ARTIST: result.artists[0].name,
            PLAY: result.artists[0].external_urls.spotify,
            TWEETS: yield twitter.tweetSearch(result.name)
          }
          console.log(res)
          }).catch('bummer')
        })
      } else if (searchType === 'artist') {
        results.forEach((result) => {
          co(function* () { res = {
            ARTIST: result.name,
            FOLLOWERS: result.followers.total,
            PLAY: result.external_urls.spotify,
            TWEETS: yield twitter.tweetSearch(result.name)
          }
          console.log(res)
          }).catch('bummer')
        })
      } else if (searchType === 'track') {
        results.forEach((result) => {
          co(function* () { res = {
            TRACK: result.name,
            ARTIST: result.artists[0].name,
            PLAY: result.external_urls.spotify,
            TWEETS: yield twitter.tweetSearch(result.name)
          }
          console.log(res)
          }).catch('bummer')
        })
      } else if (searchType === 'playlist') {
        results.forEach((result) => {
          co(function* () { res = {
            PLAYLIST: result.name,
            DJ: result.owner.id,
            TRACK_COUNT: result.tracks.total,
            PLAY: result.external_urls.spotify,
            TWEETS: yield twitter.tweetSearch(result.name)
          }
          console.log(res)
          }).catch('bummer')
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
