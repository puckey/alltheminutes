export default function filterTweets({ data }) {
  const regex = /^It['’]s\s\d.+$/gi;
  const filteredResults = data.filter((item) => regex.test(item.text));

  if (filteredResults.length === 0) {
    return null;
  }
  return filteredResults;
}
