import JSONdb from 'simple-json-db';

// Stores tweet in json file
export default function addTweetIdToJson(timeNow, tweetId) {
  try {
    const db = new JSONdb(`db/storage.json`);
    db.set(timeNow, tweetId);
  } catch (error) {
    console.error(error);
    console.error(`CheckIfEntryExists Error`);
  }
}
