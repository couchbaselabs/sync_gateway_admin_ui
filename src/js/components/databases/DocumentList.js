import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { makePath } from '../../utils';
import { Keys, fetchDocs } from '../../actions/Api';
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
      refreshing: false
    }
  }

  componentWillMount() {
    this.refresh();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.refresh()) {
      const { dispatch, documentListProgress } = nextProps;
      if (documentListProgress)
        documentListProgress.mayReset(dispatch);
      else 
        this.updateRefreshingState(false);  
    }
  }

  updateRefreshingState(refreshing) {
    if (refreshing !== this.state.refreshing) {
      this.setState(Object.assign({ }, this.state, { 
        refreshing 
      }));
    }
  }

  refresh() {
    const { refreshing, pageSize } = this.state;
    if (!refreshing) {
      const { dispatch, params, rows, curPage, startKeys } = this.props;
      const startKey = (startKeys && curPage) && startKeys[curPage];
      updateRefreshingState(true);
      dispatch(fetchDocs(params.db, pageSize, curPage, startKey));
      return true;
    }
    return false;
  }

  previousOnClick() {
    const { pageSize } = this.state;
    const { dispatch, params, curPage, startKeys } = this.props;
    const page = curPage - 1;
    dispatch(fetchDocs(params.db, pageSize, page, startKeys[page]));
  }

  nextOnClick() {
    const { pageSize } = this.state;
    const { dispatch, params, curPage, startKeys } = this.props;
    const page = curPage + 1;
    dispatch(fetchDocs(params.db, pageSize, page, startKeys[page]));
  }

  hasNext() {
    const { curPage, startKeys=[ ], rows =[] } = this.props;
    return (rows && curPage + 1 < startKeys.length);
  }

  hasPrevious() {
    const { curPage, rows =[] } = this.props;
    return (rows && curPage > 0);
  }

  render() {
    const { rows=[], params, curPage, pageSize } = this.props;
    const { db } = params;

    const boxHeader = (
      <BoxHeader title="Documents">
        <BoxTools>
          <div>
            <input type="text" className="form-control input-sm" placeholder="Document ID"/>
            <span className="glyphicon glyphicon-search form-control-feedback"></span>
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

DocumentList.propTypes = {
  rows: PropTypes.array,
  curPage: PropTypes.number,
  startKeys: PropTypes.array,
  pageSize: PropTypes.number,
  documentListProgress: PropTypes.object
}

export default connect(state => { 
  const { rows, curPage, startKeys, pageSize, progress } = state.documentList;
  const documentListProgress = progress[Keys.FETCH_DOCS];
  const timestamp = new Date().getMilliseconds();
  return { rows, curPage, startKeys, pageSize, documentListProgress, timestamp }
})(DocumentList);
