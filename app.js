import { $column, $data } from './data.js';
import createDataObject from './data-object.js';

var $dataObj;
const $dataSection = document.getElementById('data-section');

(function init(param) {
  
  const code = {
    'query-main':
`$dataObj = createDataObject($column.main, $data.main);

$dataObj
  .setColumn('บทบัญญัติ')
  .search('พระบรมราชโองการ ประชุมลับ งบประมาณ')
  .render($dataSection);`
  , 'query-draft':
`$dataObj = createDataObject($column.draft, $data.draft);

$dataObj
  .setColumn('ผู้อภิปราย')
  .filterArray('นายมีชัย ฤชุพันธุ์')
  .render($dataSection);`
  };

  addEventListener('load', evt => {
  
    // sample query
    ['query-main', 'query-draft'].forEach(id => {
      document
        .getElementById(id)
        .addEventListener('click', evt => {
          evt.stopPropagation();
          evt.preventDefault();
          const input = document.getElementById('query-editor');
          input.value = code[id];
          document.getElementById('query-submit').click();
          return evt;
      });
    });
    
    // run query
    document
      .getElementById('query-submit')
      .addEventListener('click', evt => {
        const input = document.getElementById('query-editor');
        const output = document.getElementById('query-result');
        const code = input.value;
        eval(code);
        output.value = JSON.stringify($dataObj.data);
        return evt;
    });
    
    // back to top
    document
      .getElementById('btt')
      .addEventListener('click', evt => {
        evt.stopPropagation();
        evt.preventDefault();
        document
          .querySelector('h1')
          .scrollIntoView({ behavior: 'smooth', block: "start" });
        return evt;
    });
  
    return evt;
  });
  
  return true;
})({});
