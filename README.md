# กรธ.60 - Data Query

### Data object functions

createDataObject(data) - Create a data object. 

.filter(columnName, keyword) - Selected filtered rows by single keyword.

.filters(columnName, keywords) - Selected filtered rows by multiple keywords.

.filterOut(columnName, keyword) - Remove filtered rows by single keyword.

.filterArray(columnName, keyword) - Filter rows which have seach keyword in array item.

.search(columnName, keywords) - Partial search and order by ranking.

.sort(columnsObj{columnName: ASC/DESC}) - Sort data by using selected column.

.reverse() - Reverse data array.

.append(dataObj) - Concat another data at the end.

.prepend(dataObj) - Concat another data at the start.

### Utility functions

.getConstitution(article) - Get constitution data with article passed.

.getMinutes(id) - Get minutes data with id passed.

.list() - Get all chapters with count.

.listPanelists() - Get all panelists with count.

.render(elemId, tableProps{}) - Render data table.
