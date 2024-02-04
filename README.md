# [กรธ.60 - Data Query](https://iampz.github.io/c60-data-query/)

### Data object functions
- createDataObject(data) - Create a data object. 
- .filter(columnName, keyword) - Get filtered rows by single keyword.
- .multiFilter(criteria, except) - Get filtered rows by multiple criteria/exception.
- .filterOut(columnName, keyword) - Remove filtered rows by single keyword.
- .filterArray(columnName, keyword) - Get filtered rows contained keyword in array.
- .search(columnName, keywords) - Partial search ordered by ranking.
- .sort(columnsObj{columnName: ASC/DESC}) - Sort data by using selected column.
- .reverse() - Reverse data array.
- .append(dataObj) - Concat another data at the end.
- .prepend(dataObj) - Concat another data at the start.
- 
### UI & Utility functions
- .getConstitution(article) - Get constitution data (call with parameter for filter).
- .getMinutes(id) - Get minutes data (call with parameter for filter).
- .list() - Get all chapters with count.
- .listPanelists() - Get all panelists with count.
- .render(elemId, tableProps{}) - Render data table.
