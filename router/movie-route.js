
const prompt = require('prompt')
const request = require('request')
const co = require('co')

const twitter = require('../twitter/twitter.js')


let movieRoute = () => {

  let schema = {
    properties: {
      searchType: {
        description: 'Would you like to search through "movies", "tv" or "people"?',
        pattern: /movies|tv|people/,
        message: 'Please use one of the terms provided in "" above',
        type: 'string',
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

  prompt.get(schema, (err, userInput) => {

    let searchTerm = userInput.searchTerm
    let searchType
    if (userInput.searchType === 'movies') {
      searchType = 'movie'
    } else if (userInput.searchType === 'tv') {
      searchType = userInput.searchType
    } else if (userInput.searchType === 'people') {
      searchType = 'person'
    }

    let tmdbKey = 'b7f8f796a8bb100d21d60c192c689ac6'
    let tmdbURL = `https://api.themoviedb.org/3/search/${searchType}?api_key=${tmdbKey}&language=en-US&query=${searchTerm}&page=1`

    let movieSearch = () => {
      request({
        url: tmdbURL,
        json: true
      }, (error, response, body) => {
        if (error) {
          console.log("couldn't reach the database :(")
        } else if (body.total_results === 0) {
          console.log("No results... Let's try that again...")
        } else if (body.total_results > 0) {
          let results = body.results
          outputModel(results)
        } else {
          console.log('nothing yet')
        }
      })
    }

    movieSearch()

    let outputModel  = (results) => {
      if (searchType === 'movie') {
        console.log('in the outputModel')
        results.forEach((result) => {
          co(function* () { res = {
              TITLE: result.title,
              AVE_RATING: result.vote_average,
              RATING_COUNT: result.vote_count,
              OVERVIEW: result.overview,
              LATEST_TWEET: yield twitter.tweetSearch(result.title)
            }
          console.log(res)
          }).catch('bummer')
        })
      } else if (searchType === 'tv') {
        results.forEach((result) => {
          co(function* () { res = {
              NAME: result.name,
              AVE_RATING: result.vote_average,
              RATING_COUNT: result.vote_count,
              OVERVIEW: result.overview,
              LATEST_TWEET: yield twitter.tweetSearch(result.name)
            }
          console.log(res)
          }).catch('bummer')
        })
      } else if (searchType === 'person') {
        results.forEach((result) => {
          co(function* () { res = {
              NAME: result.name,
              RELATED_TITLES: yield relatedTitles(result),
              LATEST_TWEET: yield twitter.tweetSearch(result.name)
            }
          console.log(res)
          }).catch('bummer')
        })
      }
    }

    function relatedTitles(result) {
      return new Promise((resolve, reject) => {
        result.known_for.forEach((title) => {
          // console.log(title)
          if (title.media_type === 'movie') { res = {
              TITLE: title.title,
              TYPE: title.media_type
            }
            resolve(res)
          } else if (title.media_type === 'tv'){ res = {
              TITLE: title.name,
              TYPE: title.media_type
            }
            resolve(res)
          } else {
            reject('nada')
          }
        })
      })
    }
  })
}



module.exports.movieRoute = movieRoute




// let omdbURL = `http://www.omdbapi.com/?s=${searchTerm}&type=${searchType}`
// console.log(omdbURL)
//
// let outputModel = (results) => {
//   if (searchType === 'movie' || 'series') {
//     results.forEach((result) => {
//       console.log('Movie Title: ' + result.title)
//       console.log('Year Released: ' + result.year)
//     }
//   } else if (searchType === '')
// }

// testing: https://www.themoviedb.org/settings/api
