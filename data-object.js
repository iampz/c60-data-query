function DataObject(column=[], data=[]) {
  if ( !Array.isArray(column)
    || !Array.isArray(data)
  ) throw Error('Column and Data should be array.');
  this.column = column;
  this.data = data;
}

  DataObject.prototype.toString = function() {
    return JSON.stringify({
      column: this.column
    , data: this.data
    });
  };

  DataObject.prototype.require = function(prop) {
    const errorList = {
      columnName: 'column'
    , columnIndex: 'column'
    };
    const val = this[prop];
    if (!val) throw new Error(
      `Set ${errorList[prop]} before using this function.`
    );
    return this;
  }

  DataObject.prototype.findColumnIndex = function(columnName) {
    const columnIndex = this.column.indexOf(columnName) + 1;
    if (columnIndex) return columnIndex;
    else throw new Error(
      `Column "${columnName}" cannot be found.`
    );
  };

  DataObject.prototype.setColumn = function(columnName) {
    const columnIndex = this.findColumnIndex(columnName);
    this.columnName = columnName;
    this.columnIndex = columnIndex;
    return this;
  };

  DataObject.prototype.getColumnIndex = function() {
    this.require('columnIndex');
    return this.columnIndex - 1;
  };

  DataObject.prototype.getColumnName = function() {
    this.require('columnName');
    return this.columnName;
  }

  DataObject.prototype.filter = function(val) {
    const columnIndex = this.getColumnIndex();
    this.data = this.data.filter(row =>
      row[columnIndex] == val
    );
    return this;
  };

  DataObject.prototype.filterOut = function(val) {
    const columnIndex = this.getColumnIndex();
    this.data = this.data.filter(row =>
      row[columnIndex] != val
    );
    return this;
  };

  DataObject.prototype.search = function(val) {
    const columnIndex = this.getColumnIndex();
    const regex = new RegExp(`(${val.trim().replace(/\s+/g, '|')})`, 'g');
    this.data = this.data
      .reduce((acc, row) => {
        const matchArr = row[columnIndex].match(regex);
        return (matchArr)
          ? acc.concat([[ matchArr.length, row ]])
          : acc;
      }, [])
      .sort((a, b) => b[0] - a[0])
      .map(row => row[1]);
    return this;
  };

  DataObject.prototype.filterArray = function(val) {
    const columnIndex = this.getColumnIndex();
    this.data = this.data.filter(row =>
      row[columnIndex].includes(val)
    );
    return this;
  };
  
  DataObject.prototype.sort = function(isDecrement) {
    const columnIndex = this.getColumnIndex();
    this.data = this.data.sort((a, b) =>
      (isDecrement)
      ? b[columnIndex] - a[columnIndex]
      : a[columnIndex] - b[columnIndex]
    );
    return this;
  };

  DataObject.prototype.render = function(elem) {
  
    if (!elem || !elem.tagName)
      throw new Error('Element is needed for render.');

    const table = document.createElement('table');
    table.id = 'data-table';
    table.border = 1;
    
    const thead = document.createElement('thead');
    const htr = document.createElement('tr');
    this.column.forEach(columnName => {
      const th = document.createElement('th');
      th.textContent = columnName;
      htr.appendChild(th);
      return columnName;
    });
    thead.appendChild(htr);

    const tbody = document.createElement('tbody');
    this.data.forEach(row => {
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

function createDataObject(column, data) {
  return new DataObject(column, data);
}

export default createDataObject;
