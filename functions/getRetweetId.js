import JSONdb from 'simple-json-db';

export default function getRetweetId(timeNow) {
  const db = new JSONdb(`db/storage.json`);
  const result = db.get(timeNow);
  return result;
}
