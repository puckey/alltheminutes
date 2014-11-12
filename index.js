var util = require('util'),
    twitter = require('twit'),
    request = require('request'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    path = require('path'),
    JsonStore = require('./lib/JsonStoreSync'),
    config = require('./config.json');

var store = new JsonStore(path.resolve(__dirname, './tweeted.json')),
	tweeted = store.data;

var twit = new twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
});

var query, hour, minute;
function getTweet(callback) {
    var date = new Date();
	hour = date.getHours(),
    minute = date.getMinutes();

    if (('' + minute).length == 1)
        minute = '0' + minute;

    var amPm = hour >= 12 ? 'pm' : 'am',
    	shortHour = hour > 12 ? hour - 12 : hour;

    query = encodeURIComponent(
        '"its ' + shortHour + ':' + minute + '' + amPm + ' and"' +
        ' OR ' +
        '"its ' + shortHour + ':' + minute + ' ' + amPm + ' and"'
    );

    var url = 'http://otter.topsy.com/search.js?q=' + query + '&offset=0&perpage=100&window=a&apikey=' + config.topsy_key;

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			var tweets = data.response.list.filter(function(tweet) {
	            // Filter out tweets that contain hashtags
	            // and tweets that do not start with 'It'
	            // and tweets longer than 100 characters:
	            return !/#|http/.test(tweet.content)
	            		&& /^It/i.test(tweet.content)
	            		&& (tweet.content.length < 100);
	        });
			if (!tweets.length)
				return new Error('No tweets found for:' + hour + ':' + minute);

			// Find out which tweets we haven't retweeted yet:
			var unTweeted = tweets.filter(function(tweet) {
				var id = getTweetId(tweet);
				return !!id && !tweeted[id];
			});
			if (unTweeted.length)
				tweets = unTweeted;

			var tweet = tweets[Math.floor(Math.random() * tweets.length)],
				id = getTweetId(tweet);
			// First try unretweeting:
			unRetweet(id, function(err) {
				if (err)
					return callback(err);
				retweet(id, callback);
			});
			archiveResults(body);
		} else {
			callback(error);
		}
	})
};

function archiveResults(json, callback) {
	var directory = './tweets/' + hour + '/';
	mkdirp(directory, function (err) {
		if (err)
			console.log(err);
		fs.writeFile(directory + minute + '.json', json, function(err) {
			if (err)
				console.log(err);
		}); 
	});
}

function getTweetId(tweet) {
	var matches = tweet.trackback_permalink.match(/([0-9]+)$/);
	return matches && matches[1];
}


function retweet(id, callback) {
	console.log('Retweeting', id);
	twit.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
		if (err) {
			tweeted[id] = 'error';
			store.persist();
			callback(err);
		}
		if (data && data.id) {
			tweeted[id] = data.id_str;
			store.persist();
		}
	})	
}

function unRetweet(id, callback) {
	if (!tweeted[id])
		return callback();
	console.log('Unretweeting', id, tweeted[id]);
	twit.post('statuses/destroy/:id', { id: tweeted[id] }, function(err) {
		delete tweeted[id];
		store.persist();
		callback(err);
	})
}

function postMinuteTweet() {
	getTweet(function(error) {
		if (error)
			return console.log(error);
	});
}

setInterval(postMinuteTweet, 60000);
postMinuteTweet();
