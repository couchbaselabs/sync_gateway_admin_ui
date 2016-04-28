import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { makePath } from '../../utils';
import { fetchAllDocs } from '../../actions/Api';
import { Button, Table } from 'react-bootstrap';
import { Box, BoxHeader, BoxTools, BoxBody, BoxFooter, 
  Icon, Space } from '../ui';

class DocumentList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(fetchAllDocs(params.db));
  }

  render() {
    const { rows, params } = this.props;
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

    const toolbar = (
      <div className="box-controls">
        <Link to={makePath('databases', db, 'documents', 'new')}>
          <Button bsSize="sm"><Icon name="plus"/></Button>
        </Link><Space/>
        <Link to={makePath('databases', db, 'documents', 'new')}>
          <Button bsSize="sm"><Icon name="trash-o"/></Button>
        </Link>
        <div className="pull-right">
          {'1 - 100 '}<Space/>
          <div className="btn-group">
            <Button bsSize="sm"><Icon name="chevron-left"/></Button>
            <Button bsSize="sm"><Icon name="chevron-right"/></Button>
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
            {'1 - 100 '}<Space/>
            <div className="btn-group">
              <Button bsSize="sm"><Icon name="chevron-left"/></Button>
              <Button bsSize="sm"><Icon name="chevron-right"/></Button>
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
  rows: PropTypes.array.isRequired 
}

export default connect(state => { 
  return { rows: (state.documentList.rows || []) }
})(DocumentList);
