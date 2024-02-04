async function fetchJSON(title) {
  const response = await fetch(`./data/${title}.json?v=0.2.1`);
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
    'chapter-01', 'chapter-12',
    'chapter-13', 'chapter-14',
    'chapter-15', 'chapter-16',
    'transitory-provisions'
  ]),
  con: await getJSON(['constitution']),
  min: await getJSON(['minutes']),
}

export default data;
