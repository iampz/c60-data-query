import data from './data.js?v=0.2.1';
import createDataObject from './data-object.js?v=0.2.1';

let $dataObj;
const defaultTable = { id: 'data-table', border: 1 }

const queries = {
  
'filter':
`createDataObject(data)
  .filter('หมวด', 1)
  .render('data-section', defaultTable);`,

'filters':
`createDataObject(data)
  .filters('มาตรา', [2, 3])
  .render('data-section', defaultTable);`,

'filterOut':
`createDataObject(data)
  .filterOut('หมวด', 0)
  .filterOut('หมวด', 1)
  .render('data-section', defaultTable);`,

'filterArray':
`createDataObject(data)
  .filterArray('ผู้อภิปราย', 'นายอัชพร จารุจินดา')
  .render('data-section', defaultTable);`,
  
'search':
`createDataObject(data)
  .search('ประเด็นการพิจารณา', 'ศาลรัฐธรรมนูญ นิติธรรม รัฐสภา')
  .render('data-section', defaultTable);`,
  
'sort':
`createDataObject(data)
  .filter('หมวด', 1)
  .sort({
    หมวด: 'ASC',
    มาตรา: 'DESC'
  })
  .render('data-section', defaultTable);`,
  
'reverse':
`createDataObject(data)
  .reverse()
  .render('data-section', defaultTable);`,
  
'append':
`createDataObject(data)
  .filter('มาตรา', 2)
  .append(
    createDataObject(data)
      .filter('มาตรา', 5)
  )
  .render('data-section', defaultTable);`,
  
'prepend':
`createDataObject(data)
  .filter('มาตรา', 2)
  .prepend(
    createDataObject(data)
      .filter('มาตรา', 5)
  )
  .render('data-section', defaultTable);`,
  
'log':
`// Data object log during chain.
createDataObject(data)
  .filter('หมวด',  'บทเฉพาะกาล')
  .log('%c $dataObj log -> ', 'color: lime; background: black; ')
  .filter('มาตรา', 274)
  .render('data-section', defaultTable);
  
// Array log during chain
$dataObj
  .valueOf()  // get array of objects
  .toReversed()
  .log('%c Native array log -> ', 'color: lime; background: black; ')
  .join('\\n');
  
// $dataObj.toString() return JSON
console.log(
  '%c $dataObj.toString() -> ',
  'color: lime; background: black; ',
  $dataObj+'');

window.$debug = $dataObj

/**
 * Open console to see logs.
 * Use $debug variable in console for further testing.
 **/`,
  
'getConstitution':
`createDataObject(data)
  .getConstitution(112)
  .render('data-section', defaultTable);`,
  
'getMinutes':
`createDataObject(data)
  .getMinutes(112)
  .render('data-section', defaultTable);`,

'list1':
`createDataObject(data)
  .list('หมวด')
  .render('data-section', defaultTable);`,

'list2':
`createDataObject(data)
  .filters('หมวด', ['คำปรารภ', 'บทเฉพาะกาล'])
  .list('มาตรา')
  .render('data-section', defaultTable);`,

'listPanelists':
`createDataObject(data)
  .listPanelists()
  .render('data-section', defaultTable);`,

};

const editor = document.getElementById('query-editor');
const querySubmit = document.getElementById('query-submit');
const queryCopy = document.getElementById('query-copy');
const result = document.getElementById('query-result');
const resultCopy = document.getElementById('result-copy');
const querySampleIds = Array.from(
  document.querySelectorAll('.query-sample')
).map(elem => elem.id);

querySampleIds.forEach(id => {
  document
    .getElementById(id)
    .addEventListener('click', evt => {
      evt.stopPropagation();
      evt.preventDefault();
      editor.value = queries[id.substring(6)];
      document.getElementById('query-submit').click();
      return evt;
  });
});

// run query
querySubmit.addEventListener('click', evt => {
  if (editor.value) {
    const query = `$dataObj = ${editor.value}`;
    eval(query);
    result.value = JSON.stringify($dataObj.data);
  }
  editor.focus();
  editor.selectionStart = editor.value.length;
  return evt;
});

// copy query
queryCopy.addEventListener('click', evt => {
  editor.select();
  document.execCommand('copy');
});

// copy json
resultCopy.addEventListener('click', evt => {
  result.select();
  document.execCommand('copy');
});

// back to top
document
  .getElementById('btt')
  .addEventListener('click', evt => {
    evt.stopPropagation();
    evt.preventDefault();
    document
      .querySelector('h1')
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
    return evt;
});
