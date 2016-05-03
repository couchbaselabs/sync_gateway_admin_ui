import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import { fetchDocs, fetchDoc, deleteDoc } from '../../api';
import { Button, Table, Checkbox } from 'react-bootstrap';
import { Box, BoxHeader, BoxTools, BoxBody, BoxFooter, 
  Icon, Space } from '../ui';

class DocumentList extends React.Component {
  constructor(props) {
    super(props);
 
    this.previousOnClick = this.previousOnClick.bind(this);
    this.nextOnClick = this.nextOnClick.bind(this);
    this.allRowsCheckedOnChange = this.allRowsCheckedOnChange.bind(this);
    this.singleRowCheckedOnChange = this.singleRowCheckedOnChange.bind(this);
    this.deleteOnClick = this.deleteOnClick.bind(this);
    this.searchOnKeyPress = this.searchOnKeyPress.bind(this);
    
    this.state = this.getInitState();
  }
  
  getInitState() {
    return {
      pageSize: 10,
      rows: [ ],
      curPage: 0,
      startKeys: [ ],
      isFetching: false,
      isDeleting: false,
      error: undefined,
      searchDocId: undefined,
      allRowsChecked: { },  // { <page-index>: <true|undefined> }
      selectedRows: { }     // { <page-index>: { <row.id> : <row.value.rev> } }
    }
  }

  componentDidMount() {
    this.fetchDocuments(0);
  }
  
  componentWillReceiveProps(nextProps) {
    this.reload();
  }
  
  reload() {
    this.setState(state => {
      return this.getInitState();
    }, () => {
      this.fetchDocuments(0)  
    });
  }

  fetchDocuments(pageOffset) {
    const { db } = this.props.params;
    const { pageSize, curPage, startKeys } = this.state;
    const page = curPage + pageOffset;
    const startKey = (startKeys && page) && startKeys[page];

    this.setFetchStatus(true);
    fetchDocs(db, pageSize, curPage, startKey)
      .then(result => {
        this.setFetchStatus(false);
        this.updateRows(page, result.data.rows);
      }).catch(error => {
        this.setFetchStatus(false, error);
      });
  }
  
  setFetchStatus(isFetching, error) {
    this.setState(state => {
      return Object.assign({ }, state, { isFetching, error });
    });
  }
  
  updateRows(page, rows) {
    const {pageSize, startKeys } = this.state;
    let displayRows = rows;
    let newStartKeys = [ ];
    if (displayRows) {
      if (page === 0) {
        if (displayRows.length > 0)
          newStartKeys = [ undefined ];
      } else {
        newStartKeys = startKeys.slice(0, page);
        if (displayRows.length > 0)
          newStartKeys.push(displayRows[0].id);
      }
      
      if (displayRows.length > pageSize) {
        newStartKeys.push(displayRows[pageSize].id);
        displayRows = displayRows.slice(0, -1);
      }
    }
    
    this.setState(state => {
      return Object.assign({ }, state, { 
        rows: displayRows, 
        curPage: page, 
        startKeys: newStartKeys });
    });
    
    this.validateSelectedRows(page, displayRows);
  }
  
  validateSelectedRows(curPage, rows) {
    let { selectedRows, allRowsChecked } = this.state;
    let selectedMap = selectedRows[curPage] || { };
     
    const curSelectedRowIds = Object.getOwnPropertyNames(selectedMap);
    if (curSelectedRowIds.length > 0) {
      const rowIds = new Set();
      rows.forEach(row => {
        rowIds.add(row.id);
      });
      
      let newSelectedMap;
      
      // Remove the selected rows that do not exist on the page anymore:
      curSelectedRowIds.forEach(selectedRowId => {
        if (!rowIds.has(selectedRowId)) {
          if (!newSelectedMap)
            newSelectedMap = Object.assign({ }, selectedMap);
          newSelectedMap[selectedRowId] = undefined;
        }
      });
      
      if (newSelectedMap) {
        selectedRows = Object.assign({ }, selectedRows, { 
          [curPage]: newSelectedMap 
        });
        
        // Reset all-row-checked status:
        if (allRowsChecked[curPage] !== undefined) {
          allRowsChecked = Object.assign({ }, allRowsChecked, { 
            [curPage]: undefined 
          })
        }
        
        this.setState(state => {
          return Object.assign({ }, state, { selectedRows, allRowsChecked } );
        }); 
      }
    }
  }
  
  previousOnClick() {
    this.fetchDocuments(-1);
  }

  nextOnClick() {
    this.fetchDocuments(+1);
  }

  hasNext() {
    const { curPage, startKeys, rows } = this.state;
    return (rows && curPage + 1 < startKeys.length);
  }

  hasPrevious() {
    const { curPage, rows } = this.state;
    return (rows && curPage > 0);
  }
  
  searchOnKeyPress(event) {
    if (event.key === 'Enter') {
      const docId = event.target.value;
      this.setSearchDocId(docId);
      this.fetchDocument(docId);
    }
  }
  
  setSearchDocId(searchDocId) {
    this.setState(state => {
      return Object.assign({ }, state, { searchDocId });
    })
  }
  
  fetchDocument(docId) {
    if (!docId || docId.length == 0) {
      this.reload();
    } else {
      const { db } = this.props.params;
      this.setFetchStatus(true);
      fetchDoc(db, docId)
        .then(result => {
          this.setFetchStatus(false);
          const rows = this.createRowsFromDoc(result.data);
          this.updateRows(0, rows);
        }).catch(error => {
          debugger;
          this.setState(state => {
            return Object.assign({ }, this.getInitState())
          });
          this.setFetchStatus(false, error);
        });
    }
  }
  
  createRowsFromDoc(doc) {
    const row = {
      key: doc._id,
      id: doc._id,
      value: {
        rev: doc._rev,
        doc  
      }
    }
    return [ row ];
  }
  
  allRowsCheckedOnChange(event) {
    this.updateAllRowsChecked(event.target.checked);
  }
  
  updateAllRowsChecked(checked) {
    let { curPage, rows, allRowsChecked, selectedRows } = this.state;
    
    if (checked) {
      const selectedMap = { };
      for (const row of rows) {
        selectedMap[row.id] = row.value.rev;
      }
      
      selectedRows = Object.assign({ }, selectedRows, { 
        [curPage]: selectedMap 
      });
    } else {  
      selectedRows = Object.assign({ }, selectedRows, { 
        [curPage]: undefined 
      });
    }
    
    allRowsChecked = Object.assign({ }, allRowsChecked, {
      [curPage]: (event.target.checked ? true : undefined)
    });
    
    this.setState(state => {
      return Object.assign({ }, this.state, { allRowsChecked, selectedRows });
    });
  }
  
  singleRowCheckedOnChange(event) {
    let { curPage, rows, selectedRows } = this.state;
    
    const row = rows[event.target.value]
    let selectedMap = Object.assign({ }, selectedRows[curPage], {
      [row.id]: (event.target.checked ? row.value.rev : undefined)
    });
    
    selectedRows = Object.assign({ }, selectedRows, { 
      [curPage]: selectedMap  
    });
    
    this.setState(state => {
      return Object.assign({ }, this.state, { selectedRows });
    });
  }
  
  isAllRowsChecked() { 
    let { curPage, allRowsChecked } = this.state;
    return allRowsChecked[curPage] !== undefined;
  }
  
  isRowChecked(rowId) {
    let { curPage, selectedRows } = this.state;
    const selectedMap = selectedRows[curPage];
    return selectedMap && selectedMap[rowId] !== undefined;
  }
  
  hasSelectedRows() {
    const { curPage, selectedRows } = this.state;
    const selectedMap = selectedRows[curPage];
    return selectedMap && Object.getOwnPropertyNames(selectedMap).length > 0;
  }
  
  deleteOnClick() {
    const { db } = this.props.params;
    const { curPage, selectedRows } = this.state;
    const selectedMap = selectedRows[curPage];
    
    let deleteDocs = Object.keys(selectedMap).map(docId => {
      const revId = selectedMap[docId];
      return deleteDoc(db, docId, revId);
    });
    
    this.setDeleteStatus(true);
    Promise.all(deleteDocs)
      .then(results => {
        this.setDeleteStatus(false);
        this.fetchDocuments(0);
      }).catch(error => {
        this.setDeleteStatus(false, error);
      });
  }
  
  setDeleteStatus(isDeleting, error) {
    this.setState(state => {
      return Object.assign({ }, state, { isDeleting, error });
    });
  }

  render() {
    const { rows, curPage, pageSize, searchDocId } = this.state;
    const { db } = this.props.params;

    const boxHeader = (
      <BoxHeader title="Documents">
        <BoxTools>
          <div>
            <input type="text" className="form-control input-sm" 
              placeholder="Document ID" value={searchDocId} 
              onKeyPress={this.searchOnKeyPress}/>
            <span className="glyphicon glyphicon-search form-control-feedback"/>
          </div>
        </BoxTools>
      </BoxHeader>
    );

    let paginationLabel = '';
    if (rows.length > 0) {
      const start = (curPage * pageSize) + 1;
      const end = start + rows.length - 1; 
      paginationLabel = `${start} - ${end}`;
    }

    const previousEnabled = this.hasPrevious();
    const nextEnabled = this.hasNext();
    
    const toolbar = (
      <div className="box-controls">
        <Link to={makePath('databases', db, 'documents', 'new')}>
          <Button bsSize="sm"><Icon name="plus"/></Button>
        </Link><Space/>
        <Button bsSize="sm" disabled={!this.hasSelectedRows()} 
          onClick={this.deleteOnClick}><Icon name="trash-o"/></Button>
        <div className="pull-right">
          {paginationLabel}<Space/>
          <div className="btn-group">
            <Button bsSize="sm" disabled={!previousEnabled} 
              onClick={this.previousOnClick}><Icon name="chevron-left"/>
            </Button>
            <Button bsSize="sm" disabled={!nextEnabled} 
              onClick={this.nextOnClick}><Icon name="chevron-right"/>
            </Button>
          </div>
        </div>
      </div>
    );

    const tableHeader = (
      <tr>
        <th>
          <input type="checkbox" checked={this.isAllRowsChecked()} 
            onChange={this.allRowsCheckedOnChange}/>
        </th>
        <th>ID</th>
        <th>Rev</th>
      </tr>
    );

    const tableRows = rows.map((row, index) =>
      <tr key={row.id}>
        <td>
          <input type="checkbox" checked={this.isRowChecked(row.id)} 
            value={index} onChange={this.singleRowCheckedOnChange}/>
        </td>
        <td>
          <Link to={makePath('databases', db, 'documents', row.id)}>
            {row.id}
          </Link>
        </td>
        <td>{row.value.rev}</td>
      </tr>
    );

    const table = (
      <Table striped>
        <tbody>
          {tableHeader}
          {tableRows}
        </tbody>
      </Table>
    );
    
    const boxBody = (
      <BoxBody withPadding={false}>
        {toolbar}
        {table}
      </BoxBody>
    );

    const boxFooter = (
      <BoxFooter withPadding={false}>
        <div className="box-controls">
          <Button bsSize="sm" style={{visibility: 'hidden'}}>noops</Button>
          <div className="pull-right">
            {paginationLabel}<Space/>
            <div className="btn-group">
              <Button bsSize="sm" disabled={!previousEnabled} 
                onClick={this.previousOnClick}><Icon name="chevron-left"/>
              </Button>
              <Button bsSize="sm" disabled={!nextEnabled} 
                onClick={this.nextOnClick}><Icon name="chevron-right"/>
              </Button>
            </div>
          </div>
        </div>
      </BoxFooter>
    );
    
    return (
      <Box topLine={false}>
        {boxHeader}
        {boxBody}
        {boxFooter}
      </Box>
    );
  }
}

export default DocumentList;
