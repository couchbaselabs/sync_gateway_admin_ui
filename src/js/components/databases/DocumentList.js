import React from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import DocumentListStore from '../../stores/DocumentListStore';
import { Button, Table, Checkbox } from 'react-bootstrap';
import { Box, BoxHeader, BoxTools, BoxBody, BoxFooter, 
  Icon, Space } from '../ui';

class DocumentList extends React.Component {
  constructor(props) {
    super(props);
    
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.previousOnClick = this.previousOnClick.bind(this);
    this.nextOnClick = this.nextOnClick.bind(this);
    this.allRowsSelectedOnChange = this.allRowsSelectedOnChange.bind(this);
    this.singleRowCheckedOnChange = this.singleRowCheckedOnChange.bind(this);
    this.deleteOnClick = this.deleteOnClick.bind(this);
    this.searchOnKeyPress = this.searchOnKeyPress.bind(this);
    
    this.state = DocumentListStore.getData();
  }
  
  componentWillMount() {
    DocumentListStore.addChangeListener(this.dataStoreOnChange);
  }
  
  componentDidMount() {
    this.fetchDocuments(0);
  }
  
  componentWillReceiveProps(nextProps) {
    this.resetAndReload();
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching } = nextState;
    AppStore.setActivityIndicatorVisible(isFetching, 'DocumentList');
  }
  
  componentWillUnmount() {
    DocumentListStore.cancelFetchDocuments();
    AppStore.setActivityIndicatorVisible(false, 'DocumentList');
    DocumentListStore.removeChangeListener(this.dataStoreOnChange);
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return DocumentListStore.getData();
    })
  }
  
  resetAndReload() {
    DocumentListStore.reset();
    this.fetchDocuments(0);
  }

  fetchDocuments(pageOffset) {
    const { db } = this.props.params;
    DocumentListStore.fetchDocuments(db, pageOffset);
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
      if (docId.length === 0) {
        this.resetAndReload();
      } else {
        const { db } = this.props.params;
        DocumentListStore.searchDocumentById(db, docId);
      }
    }
  }
  
  allRowsSelectedOnChange(event) {
    DocumentListStore.selectAllRows(event.target.checked);
  }
    
  singleRowCheckedOnChange(event) {
    const rowIndex = event.target.value;
    const checked = event.target.checked;
    DocumentListStore.selectRow(rowIndex, checked);
  }
  
  isAllRowsSelected() { 
    let { curPage, allRowsSelected } = this.state;
    return allRowsSelected[curPage] !== undefined;
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
    DocumentListStore.deleteSelectedRows(db);
  }

  render() {
    const { rows, curPage, pageSize, searchDocId } = this.state;
    const { db } = this.props.params;

    const boxHeader = (
      <BoxHeader title="Documents">
        <BoxTools>
          <div className="has-feedback">
            <input type="text" className="form-control input-sm" 
              placeholder="Document ID"
              defaultValue={searchDocId}
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
          <input type="checkbox" checked={this.isAllRowsSelected()} 
            onChange={this.allRowsSelectedOnChange}/>
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
