const prompt = require('prompt')
const request = require('request')

let movieRoute = () => {

  let schema = {
    properties: {
      searchType: {
        description: 'Would you like to search through "movies", "tv" or "actors"?',
        pattern: /movies|tv|actors/,
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
    } else if (userInput.searchType === 'actors') {
      searchType = 'person'
    }
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
    let outputModel  = (results) => {
      if (searchType === 'movie') {
        results.forEach((result) => {
          console.log('Title: ' + result.title)
          console.log('Viewer Ratings: ' + result.vote_count)
          console.log('Average Viewer Rating: ' + result.vote_average)
          console.log('Overview: ' + result.overview + '\n')
        })
      } else if (searchType === 'tv') {
        results.forEach((result) => {
          console.log('Name: ' + result.name)
          console.log('Viewer Ratings: ' + result.vote_count)
          console.log('Average Viewer Rating: ' + result.vote_average)
          console.log('Overview: ' + result.overview + '\n')
        })
      } else if (searchType === 'person') {
        results.forEach((result) => {
          console.log('Name: ' + result.name)
          console.log('- Known for:')
          let relatedTitles = () => {
            result.known_for.forEach((title) => {
              // console.log(title)
              if (title.media_type === 'movie') {
                console.log('-- Title: ' + title.title)
                console.log('--- Type: ' + title.media_type)
              } else {
                console.log('-- Title: ' + title.name)
                console.log('--- Type: ' + title.media_type)
              }
            })
          }
          console.log(relatedTitles() + '\n')
        })
      }
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
          console.log("Let's try that again...")
        } else if (body.total_results > 0) {
          let results = body.results
          outputModel(results)
        } else {
          console.log('nothing yet')
        }
      })
    }
    movieSearch()
  })
}



module.exports.movieRoute = movieRoute
