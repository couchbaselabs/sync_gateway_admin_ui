import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { makeUrlPath } from '../../utils';
import { fetchAllDocs } from '../../actions/Api';
import { Button, ButtonToolbar, Col, Row, Table } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxTools, Icon } from '../ui';

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
          <Link to={makeUrlPath('databases', db, 'documents', 'new')}>
            <Button bsSize="sm"><Icon name="plus"/></Button>
          </Link>
        </BoxTools>
      </BoxHeader>
    );

    const tableHeader = (
      <tr>
        <th><input type="checkbox"/></th>
        <th>ID</th>
        <th>Rev</th>
      </tr>
    );

    const documents = rows.map(row =>
      <tr key={row.id}>
        <td><input type="checkbox"/></td>
        <td>
          <Link to={makeUrlPath('databases', params.db, 'documents', row.id)}>{row.id}</Link>
        </td>
        <td>{row.value.rev}</td>
      </tr>
    );
    
    const boxBody = (
      <div>
        <div className="btn-box-tool pull-right">
          <Link to={makeUrlPath('databases', db, 'documents', 'new')}>
            <Button bsSize="sm"><Icon name="plus"/></Button>
          </Link>
        </div>
        <Table striped>
        <tbody>
          {tableHeader}
          {documents}
        </tbody>
      </Table>
      </div>
    );
    
    return (
      <Row>
        <Col md={12}>
          {boxBody}
        </Col>
      </Row>
    );
  }
}

DocumentList.propTypes = {
  rows: PropTypes.array.isRequired 
}

export default connect(state => { 
  return { rows: (state.documentList.rows || []) }
})(DocumentList);
