import doesARetweetExist from './doesARetweetExist.js';
import addTweetIdToJson from './addTweetIdToJson.js';
import getRetweetId from './getRetweetId.js';

export default async function findExistingRetweets(twitterClient, timeNow) {
  try {
    if (doesARetweetExist(timeNow)) {
      const tweetId = getRetweetId(timeNow);
      await twitterClient.v2.unretweet(process.env.TWITTER_USER_ID, tweetId);
      await twitterClient.v2.retweet(process.env.TWITTER_USER_ID, tweetId);
      addTweetIdToJson(timeNow, tweetId);
      console.log(`Retweeting Existing Retweet For ${timeNow}`);
    } else {
      console.log(`No Existing Retweets Found For ${timeNow}`);
    }
  } catch (error) {
    console.error(error);
    console.error(`findExistingRetweets Error`);
  }
}
