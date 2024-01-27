# กรธ.60 - Data Query

### Data object functions

createDataObject(data) - Create data object. 

.filter(columnName, keyword) - Selected filtered rows by exact value.

.filterOut(columnName, keyword) - Remove filtered rows by exact value.

.filterArray(columnName, keyword) - Filter rows which have seach value in array item.

.search(columnName, keywords) - Partial search and order by ranking.

.sort(columnsObj{columnName: ASC/DESC}) - Sort data by using selected column.

.reverse() - Reverse data array.

.append(dataObj) - Concat another data at the end.

.prepend(dataObj) - Concat another data at the start.

### Utility functions

.getConstitution(article) - Get constitution data with article passed.

.getMinutes(id) - Get minutes data with id passed.

.render(elemId, tableProps{}) - Render data table.
