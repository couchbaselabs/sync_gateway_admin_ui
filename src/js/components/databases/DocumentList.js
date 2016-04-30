import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import { fetchDocs } from '../../api';
import { Button, Table } from 'react-bootstrap';
import { Box, BoxHeader, BoxTools, BoxBody, BoxFooter, 
  Icon, Space } from '../ui';

class DocumentList extends React.Component {
  constructor(props) {
    super(props);
 
    this.previousOnClick = this.previousOnClick.bind(this);
    this.nextOnClick = this.nextOnClick.bind(this);

    this.state = {
      pageSize: 10,
      rows: [ ],
      curPage: 0,
      startKeys: [ ],
      isFetching: false,
      error: undefined
    }
  }

  componentDidMount() {
    this.fetchDocuments(0);
  }

  setFetchStatus(isFetching, error) {
    this.setState(state => {
      return Object.assign({ }, state, { isFetching, error });
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
      }).catch((error) => {
        this.setFetchStatus(false, error);
      });
  }

  updateRows(page, rows) {
    const {pageSize, startKeys } = this.state;
    let displayRows = rows;
    let newStartKeys = [ ];
    if (displayRows && displayRows.length > 0) {
      if (page === 0)
        newStartKeys = [ undefined ];
      else {
        newStartKeys = startKeys.slice(0, page);
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

  render() {
    const { rows, curPage, pageSize } = this.state;
    const { db } = this.props.params;

    const boxHeader = (
      <BoxHeader title="Documents">
        <BoxTools>
          <div>
            <input type="text" className="form-control input-sm" 
              placeholder="Document ID"/>
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
        <Link to={makePath('databases', db, 'documents', 'new')}>
          <Button bsSize="sm"><Icon name="trash-o"/></Button>
        </Link>
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
        <th><input type="checkbox"/></th>
        <th>ID</th>
        <th>Rev</th>
      </tr>
    );

    const tableRows = rows.map(row =>
      <tr key={row.id}>
        <td><input type="checkbox"/></td>
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
