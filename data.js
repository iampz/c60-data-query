async function fetchJSON(title) {
  const response = await fetch(`./data/${title}.json`);
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
    'chapter-01', 'transitory-provisions'
  ]),
  con: await getJSON(['constitution']),
  min: await getJSON(['minutes']),
}

export default data;
