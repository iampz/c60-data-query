function DataObject(data) {
  this.data = data.doc;
  this.constitution = data.con;
  this.minutes = data.min[0];
}

  DataObject.prototype.valueOf = function() {
    return this.data;
  };

  DataObject.prototype.toString = function() {
    return JSON.stringify(this.valueOf());
  };

  DataObject.prototype.log = function(...args) {
    console.log(...args, this);
    return this;
  };
  
  
  // Data object functions

  DataObject.prototype.filter = function(columnName, keyword) {
    this.data = this.data.filter(row =>
      row[columnName] == keyword
    );
    return this;
  };

  DataObject.prototype.filters = function(columnName, keywords) {
    this.data = this.data.filter(row =>
      keywords
        .map(keyword => keyword + '')
        .indexOf(row[columnName])
        + 1
    );
    return this;
  };
  
  DataObject.prototype.filterOut = function(columnName, keyword) {
    this.data = this.data.filter(row =>
      row[columnName] != keyword
    );
    return this;
  };

  DataObject.prototype.filterArray = function(columnName, keyword) {
    this.data = this.data.filter(row =>
      row[columnName].includes(keyword)
    );
    return this;
  };

  DataObject.prototype.search = function(columnName, keywords) {

    const regexArr = keywords
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(keyword => new RegExp(keyword, 'g'));

    this.data = this.data
      .reduce((dataRanking, row) => {
      
        const matchScore = regexArr
          // Give 1 score for each matched keyword found.
          .reduce((scoreArr, regex, index) => {
            const matchResult = row[columnName].match(regex);
            if (matchResult)
              scoreArr[index] += matchResult.length;
            return scoreArr;
          }, Array(regexArr.length).fill(0))
          // Give 10 bonus score for each keyword found.
          .map(score => score ? score + 10 : score)
          .reduce((sum, score) => sum + score, 0);
          
        return matchScore
          ? dataRanking.concat([[ matchScore, row ]])
          : dataRanking;
          
      }, [])
      .toSorted((a, b) => b[0] - a[0])
      .map(row => row[1]);
      
    return this;
    
  };
  
  DataObject.prototype.sort = function(columnsObj={หมวด: 'ASC'}) {
    Object
      .keys(columnsObj)
      .toReversed()
      .forEach(columnName => {
        const compareOptions = {
          numeric: true,
          sensitivity: 'base'
        };
        const isDESC = (
          columnsObj[columnName].toUpperCase() === 'DESC'
        );
        this.data = this.data.toSorted((a, b) => {
          const aCol = a[columnName];
          const bCol = b[columnName];
          return isDESC
            ? bCol.localeCompare(aCol, 'th', compareOptions)
            : aCol.localeCompare(bCol, 'th', compareOptions)
        });
        return this.data;
    });
    return this;
  };
  
  DataObject.prototype.reverse = function() {
    this.data = this.data.toReversed();
    return this;
  };
  
  DataObject.prototype.append = function(dataObj) {
    this.data = this.data.concat(dataObj.data);
    return this;
  };
  
  DataObject.prototype.prepend = function(dataObj) {
    this.data = dataObj.data.concat(this.data);
    return this;
  };
  
  
  // UI & Utility functions
  
  DataObject.prototype.getConstitution = function(article) {
    this.data = this.constitution
      .filter(con => con['มาตรา'] == article);
    return this;
  };
  
  DataObject.prototype.getMinutes = function(id) {
    this.data = [ this.minutes[id] ];
    return this;
  };

  DataObject.prototype.list = function(columnName) {
    const dataObj = this.data.reduce((newObj, row) => {
      if (!newObj[row[columnName]]) newObj[row[columnName]] = 1;
      else newObj[row[columnName]] += 1;
      return newObj;
    }, {});
    const keys = Object.keys(dataObj);
    const vals = Object.values(dataObj);
    this.data = keys
      .map((key, index) => {
        const obj = {};
        obj[columnName] = key;
        obj.count = vals[index];
        return obj;
      })
      .sort((a, b) => b.count - a.count);
    return this;
  };
  
  DataObject.prototype.listPanelists = function() {
    const dataObj = this.data.reduce((newObj, row) => {
      const panelists = row['ผู้อภิปราย'];
      if (panelists.length) {
        panelists.forEach(panelist => {
          if (!newObj[panelist]) newObj[panelist] = 1;
          else newObj[panelist] += 1;
        });
      }
      return newObj;
    }, {});
    const keys = Object.keys(dataObj);
    const vals = Object.values(dataObj);
    this.data = keys
      .map((key, index) => {
        return {
          'ผู้อภิปราย': key,
          'count': vals[index],
        };
      })
      .sort((a, b) => b.count - a.count);
    return this;
  };

  DataObject.prototype.render = function(elemId='', tableProps={}) {
  
    const columns = Object.keys(this.data[0]);

    const table = document.createElement('table');
    Object.keys(tableProps).forEach(
      key => table[key] = tableProps[key]
    );
    
    const thead = document.createElement('thead');
    const htr = document.createElement('tr');
    columns.forEach(columnName => {
      htr
        .appendChild(document.createElement('th'))
        .append(columnName);
      return columnName;
    });
    thead.append(htr);

    const tbody = document.createElement('tbody');
    this.data.forEach(row => {
      const tr = document.createElement('tr');
      columns.forEach(columnName => {
        const td = document.createElement('td');
        const column = row[columnName];
        if ( Array.isArray(column) ) {
          const listsHTML = column
            .map(item => `<li>${item}</li>`)
            .join('');
          td.innerHTML = `<ul>${listsHTML}</ul>`;
        } else {
          td.innerHTML = column;
        }
        tr.append(td);
        return column;
      });
      tbody.append(tr);
      return row;
    });

    table.append(thead, tbody);
  
    const elem = document.getElementById(elemId);
    if (elem) {
      elem.textContent = '';
      elem.append(table);
      return this;
    } else {
      return table;
    }

  };

export default function createDataObject(data) {
  const obj = Object.assign({}, data);
  return new DataObject(obj);
}
