// const Promise = require('bluebird')
const twitter = require('twitter')
// const fs = require('fs')

console.log('this is loaded');
var config = {
  consumer_key: 'xe11rKjC57Q6qqs0hgGDmi9Mx',
  consumer_secret: 'sHFc6A7YdbOb4fjN7lauUjdXfOTaGOJH7wQ15ih5moxo2phKZl',
  access_token_key: '424546772-z8X7JnIKLJhOvW08WYa02ThK5ejNZrYySI3T0BPG',
  access_token_secret: 'on7ymAZ7UyjmzFo17vfbeEj1y26i7T0h2BHvggsFBbexw',
}
let client = new twitter(config)


function tweetSearch(searchTerm) {
  return new Promise(function(resolve, reject){
    let tag = searchTerm.replace(/\W+/g, "")
    client.get('search/tweets', {q: `#${tag}`, count: 1}, (error, tweets, response) => {
      if (tweets.statuses.length === 0) { res = {
        TWEET_FOR: searchTerm,
        TWEET: 'nothing found for this one',
      }
      console.log('\n ============================== \n')
      resolve(res)
      } else if (tweets.statuses.length > 0) { res = {
        TWEET_FOR: searchTerm,
        TWEET: tweets.statuses[0].text
      }
      console.log('\n ============================== \n')
      resolve(res)
      } else {
        console.log('poop')
        reject()
      }
    })
  })
}


// let searchTerm = 'hotness'
// tweetSearch(searchTerm)
module.exports.tweetSearch = tweetSearch
