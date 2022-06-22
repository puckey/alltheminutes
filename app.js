import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';
import { scheduleJob } from 'node-schedule';
import { lightFormat } from 'date-fns';

import { addTweetIdToJson, filterTweets, findExistingRetweets, getTweets } from './functions/index.js';

async function main(timeNow) {
  try {
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_KEY_SECRET,
      accessToken: process.env.ACCESS_TOKEN,
      accessSecret: process.env.ACCESS_TOKEN_SECRET
    });

    const results = await getTweets(twitterClient);
    // If there are no results
    if (results.meta.result_count === 0 || results === null) {
      console.log(`No Tweets Results For ${timeNow}`);
      // find a retweet and if it exists, unretweet it and retweet it
      findExistingRetweets(twitterClient, timeNow);
    } else {
      //   filter tweets that don't start with It's
      const filteredTweets = await filterTweets(results);
      if (filteredTweets === null) {
        console.log(`No Applicable Filtered Results For ${timeNow}`);
        // find a retweet and if it exists, unretweet it and retweet it
        findExistingRetweets(twitterClient, timeNow);
      } else {
        // retweet the tweet that matches It's xx:xx and
        console.log(`Found Original Tweet To Retweet At ${timeNow}`);
        await twitterClient.v2.retweet(process.env.TWITTER_USER_ID, filteredTweets[0].id);
        addTweetIdToJson(timeNow, filteredTweets[0].id);
        // retweet the tweet
      }
    }
  } catch (error) {
    console.error(`error ${error}`);
  }
}

scheduleJob('* * * * *', () => {
  const timeNow = lightFormat(new Date(), `HH:mm`);
  console.log(`Running Job for ${timeNow}`);
  main(timeNow);
});
