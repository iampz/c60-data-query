async function fetchJSON(title) {
  const env = (location.hostname === '127.0.0.1')
    ? 'dev' : 'prod';
  const path = {
    dev: './',
    prod: 'https://iampz.github.io/c60-data-query/',
  };
  const response = await fetch(
    `${path[env]}data/${title}.json?v=0.2.5`
  );
  const json = await response.json();
  return json;
}

function getJSON(titleArr) {
  const promiseArr = titleArr
    .map(title => fetchJSON(title));
  return Promise
    .all(promiseArr)
    .then(arr => arr.flat());
}

/**
 * doc = Drafting of Constitution 60
 * con = Constitution 60
 * min = Minutes
 **/
const data = {
  doc: await getJSON([
    'chapter-01', 'chapter-10',
    'chapter-11', 'chapter-12',
    'chapter-13', 'chapter-14',
    'chapter-15', 'chapter-16',
    'transitory-provisions'
  ]),
  con: await getJSON(['constitution']),
  min: await getJSON(['minutes']),
}

export default data;
