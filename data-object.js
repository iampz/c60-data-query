function DataObject(column=[], data=[]) {
  if ( !Array.isArray(column)
    || !Array.isArray(data)
  ) throw new TypeError('Column and Data should be array.');
  this.column = column;
  this.data = data;
}

  DataObject.prototype.toString = function() {
    return JSON.stringify({
      column: this.column
    , data: this.data
    });
  };

  DataObject.prototype.log = function(...args) {
    console.log(this, ...args);
    return this;
  };

  DataObject.prototype.getColumnIndex = function(columnName) {
    const columnIndex = this.column.indexOf(columnName);
    if (!(columnIndex+1)) throw new RangeError(
      `There is no column with name "${columnName}".`
    );
    return columnIndex;
  };

  DataObject.prototype.filter = function(columnName, keyword) {
    const columnIndex = this.getColumnIndex(columnName);
    this.data = this.data.filter(row =>
      row[columnIndex] == keyword
    );
    return this;
  };

  DataObject.prototype.filterOut = function(columnName, keyword) {
    const columnIndex = this.getColumnIndex(columnName);
    this.data = this.data.filter(row =>
      row[columnIndex] != keyword
    );
    return this;
  };

  DataObject.prototype.filterArray = function(columnName, keyword) {
    const columnIndex = this.getColumnIndex(columnName);
    this.data = this.data.filter(row =>
      row[columnIndex].includes(keyword)
    );
    return this;
  };

  DataObject.prototype.search = function(columnName, keywords) {

    const columnIndex = this.getColumnIndex(columnName);
    const regexArr = keywords
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .log('Keywords')
      .map(keyword => new RegExp(keyword, 'g'));

    this.data = this.data
      .reduce((dataRanking, row) => {
      
        const matchScore = regexArr
          // Give 1 score for each matched keyword found.
          .reduce((scoreArr, regex, index) => {
            const matchResult = row[columnIndex].match(regex);
            if (matchResult)
              scoreArr[index] += matchResult.length;
            return scoreArr;
          }, Array(regexArr.length).fill(0))
          // Give 10 bonus score for each keyword found.
          .map(score => score ? score + 10 : score)
          .log('Search ranking score for each keyword.')
          .reduce((sum, score) => sum + score, 0);
          
        return matchScore
          ? dataRanking.concat([[ matchScore, row ]])
          : dataRanking;
          
      }, [])
      .toSorted((a, b) => b[0] - a[0])
      .log('Founded records sorted with sum of ranking score.')
      .map(row => row[1]);
      
    return this;
    
  };
  
  DataObject.prototype.sort = function(columnsObj={หมวด: false}) {
    const columnsArr = Object.keys(columnsObj).map(
      columnName => [columnName, this.getColumnIndex(columnName)]
    );
    this.data = this.data.toSorted((a, b) => {
      return columnsArr.reduce((position, columnArr) => {
        const [columnName, columnIndex] = columnArr;
        const isDESC =
          (columnsObj[columnName].toUpperCase() === 'DESC')
          ? true : false;
        return position || isDESC
          ? b[columnIndex] - a[columnIndex]
          : a[columnIndex] - b[columnIndex];
      }, 0);
    });
    return this;
  };

  DataObject.prototype.render = function(elemId='', tableProps={}) {

    const table = document.createElement('table');
    Object.keys(tableProps).forEach(
      key => table[key] = tableProps[key]
    );
    
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
        if ( Array.isArray(column) ) {
          const listsHTML = column
            .map(item => `<li>${item}</li>`)
            .join('');
          td.innerHTML = `<ul>${listsHTML}</ul>`;
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
  
    const elem = document.getElementById(elemId);
    if (elem) {
      elem.textContent = '';
      elem.appendChild(table);
      return this;
    } else {
      return table;
    }

  };

export default (column, data) => {
  return new DataObject(column, data);
}
