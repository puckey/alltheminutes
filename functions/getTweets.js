import { lightFormat } from 'date-fns';

export default async function getTweets(twitterClient) {
  try {
    const twentyFourHourTime = lightFormat(new Date(), `HH:mm`);
    const twelveHourTime = lightFormat(new Date(), `h:mm`);
    const amPm = lightFormat(new Date(), `a`);
    const query = `("It's ${twentyFourHourTime} and" OR "It's ${twelveHourTime}${amPm} and" OR "It's ${twelveHourTime} ${amPm} and") lang:en -is:retweet`;
    const results = await twitterClient.v2.search(query);
    return results.data;
  } catch (error) {
    console.error(error);
    console.error(`getTweets Error`);
    return null;
  }
}
