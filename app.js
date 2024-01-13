var $debug;
const $dataSection = document.getElementById('data-section');

const $column = {
  main: [
    'หมวด'
  , 'ส่วน'
  , 'มาตรา'
  , 'บทบัญญัติ'
  ]
, draft: [
    'หมวด'
  , 'ส่วน'
  , 'มาตรา'
  , 'ร่างมาตรา'
  , 'ร่างบทบัญญัติ'
  , 'ประเด็นการพิจารณา'
  , 'มติที่ประชุม'
  , 'หมายเหตุ'
  , 'ผู้อภิปราย'
  , 'ประชุมครั้งที่'
  , 'วันที่'
  , 'หน้า'
  ]
};


function dataObject(dataContainer) {
  this.dataContainer = dataContainer;
}

  dataObject.prototype.match = function(str, allowList) {
    const regex = new RegExp(`^(${allowList.join('|')})$`);
    if (!str.match(regex)) {
      const allowListWording = allowList
        .map(arr => '"' + arr + '"')
        .join(', ');
      throw new Error(
        `"${str}" cannot be used, only ${allowListWording} allowed.`
      );
    }
    return this;
  }

  dataObject.prototype.require = function(prop) {
    const errorList = {
      source: 'data source'
    , columnIndex: 'column'
    };
    const val = this[prop];
    if (!val) throw new Error(
      `Set ${errorList[prop]} for using this function.`
    );
    return this;
  }

  dataObject.prototype.setSource = function(source) {
    this.match(source, ['draft', 'main']);
    this.source = source;
    this.data = this.dataContainer[source];
    return this;
  };

  dataObject.prototype.getSource = function() {
    this.require('source');
    return this.source;
  };

  dataObject.prototype.setData = function(data) {
    this.data = data;
    return this;
  };

  dataObject.prototype.getData = function() {
    this.require('source');
    return this.data;
  };

  dataObject.prototype.getColumnIndex = function(columnTitle) {
    const source = this.getSource();
    const sourceColumn = $column[source];
    const columnIndex = sourceColumn.indexOf(columnTitle);
    if (columnIndex+1)
      return columnIndex;
    else
      throw new Error(
        `Column "${columnTitle}" cannot be found in "${source}" data source.`
      );
  };

  dataObject.prototype.setColumn = function(column) {
    const index = this.getColumnIndex(column);
    this.columnName = column;
    this.columnIndex = index;
    return this;
  };

  dataObject.prototype.getColumn = function() {
    this.require('columnIndex');
    return this.columnIndex;
  };

  dataObject.prototype.getColumnName = function() {
    this.require('columnName');
    return this.columnName;
  }

  dataObject.prototype.filter = function(val) {
    const column = this.getColumn();
    this.setData(this
      .getData()
      .filter(row =>
        row[column] == val.trim()
      )
    );
    return this;
  };

  dataObject.prototype.search = function(val) {
    const column = this.getColumn();
    const regex = new RegExp(`(${val.trim().replace(/\s+/g, '|')})`, 'g');
    this.setData(this
      .getData()
      .reduce((acc, row) => {
        const matchArr = row[column].match(regex);
        return (matchArr)
          ? acc.concat([[ matchArr.length, row ]])
          : acc;
      }, [])
      .sort((a, b) => b[0] - a[0])
      .map(row => row[1])
    );
    return this;
  };

  dataObject.prototype.filterArray = function(val) {
    const column = this.getColumn();
    this.setData(this
      .getData()
      .filter(row =>
        row[column].includes(val)
      )
    );
    return this;
  };

  dataObject.prototype.render = function(elem) {
    
    const table = document.createElement('table');
    table.id = 'data-table';
    table.border = 1;
    
    const thead = document.createElement('thead');
    const htr = document.createElement('tr');
    $column[this.getSource()].forEach(column => {
      const th = document.createElement('th');
      th.textContent = column;
      htr.appendChild(th);
      return column;
    });
    thead.appendChild(htr);

    const tbody = document.createElement('tbody');
    const data = this.getData();
    data.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(column => {
        const td = document.createElement('td');
        if (Array.isArray(column)) {
          td.innerHTML = `<ul>${column.map(item => `<li>${item}</li>`).join('')}</ul>`;
        } else {
          td.innerHTML = column;
        }
        tr.appendChild(td);
        return column;
      });
      tbody.appendChild(tr);
      return row;
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    elem.textContent = '';
    elem.appendChild(table);

    return this;
  };

function createDataObject(data) {
  return new dataObject(data);
}


(function init(param) {
  
  const code = {
    'query-main':
`$debug = createDataObject($data);

$debug
  .setSource('main')
  .setColumn('บทบัญญัติ')
  .search('พระบรมราชโองการ ประชุมลับ งบประมาณ')
  .render($dataSection);`
  , 'query-draft':
`$debug = createDataObject($data);

$debug
  .setSource('draft')
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
        output.value = JSON.stringify($debug.getData());
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
