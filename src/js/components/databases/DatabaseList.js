import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { setAppContentHeader } from '../../actions/Api';
import { fetchAllDatabases, fetchDatabase } from '../../actions/Api';
import { makePath } from '../../utils';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxTools, Icon} from '../ui';

class DatabaseList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchToken = dispatch(fetchAllDatabases());
  }
  
  componentDidUpdate() {
    if (this.props.dbInfoStale) {
      const { dbNames, dispatch } = this.props;
      for (let db of this.props.dbNames) {
        dispatch(fetchDatabase(db));
      }
    }
  }

  componentWillUnmount() {
    this.fetchToken.abort();
  }
  
  render() {
    const { dbNames, dbInfo } = this.props;
    
    const boxHeader = (
      <BoxHeader title="All Databases"/>
    );

    const tableHeader = (
      <tr>
        <th>Name</th>
        <th>Update Seq</th>
        <th>Start Time (Micro Secs)</th>
      </tr>
    );
    
    const dbList = dbNames.map(db => {
      const { update_seq = '', instance_start_time = '' } = dbInfo[db] || { };
      return (
        <tr key={db}>
          <td><Link to={makePath('databases', db)}>{db}</Link></td>
          <td>{update_seq}</td>
          <td>{instance_start_time}</td>
        </tr>
      );
    });
    
    const boxBody = (
      <BoxBody>
        <Table striped>
          <tbody>
            {tableHeader}
            {dbList}
          </tbody>
        </Table>
      </BoxBody>
    );
    
    return (
      <Row>
        <Col md={12}>
          <Box>
            {boxHeader}
            {boxBody}
          </Box>
        </Col>
      </Row>
    );
  }
}

DatabaseList.propTypes = { 
  dbNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  dbInfo: PropTypes.object,
  fetchProgress: PropTypes.object
}

export default connect((state) => {
  const { dbNames, dbInfo, dbInfoStale } = state.database;
  return { dbNames, dbInfo, dbInfoStale };
})(DatabaseList);
