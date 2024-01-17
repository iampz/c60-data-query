import { column, data } from './data.js';
import createDataObject from './data-object.js';

let $dataObj;

(function init(param) {
  
  const code = {
    'query-main':
`createDataObject(column.main, data.main)
  .sort({
    หมวด: 'DESC',
    มาตรา: 'ASC'
  })
  .render(
    'data-section',
    { id: 'data-table', border: 1 }
  );
  `
  , 'query-draft':
`createDataObject(column.draft, data.draft)
  .search('ประเด็นการพิจารณา', 'ศาลรัฐธรรมนูญ นิติธรรม รัฐสภา')
  .render(
    'data-section',
    { id: 'data-table', border: 1 }
  );
  `
  };

  addEventListener('load', evt => {
  
    const editor = document.getElementById('query-editor');
    const querySubmit = document.getElementById('query-submit');

    // sample query
    ['query-main', 'query-draft'].forEach(id => {
      document
        .getElementById(id)
        .addEventListener('click', evt => {
          evt.stopPropagation();
          evt.preventDefault();
          editor.value = code[id];
          document.getElementById('query-submit').click();
          return evt;
      });
    });
    
    // run query
    querySubmit.addEventListener('click', evt => {
      const result = document.getElementById('query-result');
      const code = `$dataObj = ${editor.value}`;
      eval(code);
      result.value = JSON.stringify($dataObj.data);
      editor.focus();
      editor.selectionStart = editor.value.length;
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
  
    querySubmit.click();
    return evt;

  });
  
  return true;

})({});
