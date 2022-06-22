import JSONdb from 'simple-json-db';

export default function doesARetweetExist(timeNow) {
  try {
    const db = new JSONdb(`db/storage.json`);
    if (db.has(timeNow)) {
      // entry exists so send true (unretweet)
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    console.error(`CheckIfEntryExists Error`);
    return true;
  }
}
