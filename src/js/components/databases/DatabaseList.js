import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import DatabaseListStore from '../../stores/DatabaseListStore';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxTools, Icon} from '../ui';

class DatabaseList extends React.Component {
  constructor(props) {
    super(props);
    
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.state = DatabaseListStore.getData();
  }

  componentWillMount() {
    DatabaseListStore.addChangeListener(this.dataStoreOnChange);
  }
  
  componentDidMount() {
    DatabaseListStore.fetchDatabases();
  }
  
  componentWillReceiveProps(nextProps) {
    DatabaseListStore.reset();
    DatabaseListStore.fetchDatabases();
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, error } = nextState;
    AppStore.setActivityIndicatorVisible(isFetching, 'DatabaseList');
    AppStore.setAlert(error && { type: 'error', message: error.message });
  }
  
  componentWillUnmount() {
    DatabaseListStore.cancelFetchDatabases();
    DatabaseListStore.removeChangeListener(this.dataStoreOnChange);
    AppStore.setActivityIndicatorVisible(false, 'DatabaseList');
    AppStore.setAlert(undefined);
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return DatabaseListStore.getData();
    })
  }
  
  render() {
    const { dbNames, dbInfo } = this.state;
    
    const boxHeader = (
      <BoxHeader title="All Databases"/>
    );

    const tableHeader = (
      <tr>
        <th>Name</th>
        <th>Update Seq</th>
        <th>Start Time</th>
      </tr>
    );
    
    const dbList = dbNames.map(db => {
      const { update_seq = '', instance_start_time } = dbInfo[db] || { };
      
      let startTime;
      if (instance_start_time) {
        const date = new Date((instance_start_time / 1000));
        startTime = date.toUTCString();
      } else
        startTime = '';
      
      return (
        <tr key={db}>
          <td><Link to={makePath('databases', db)}>{db}</Link></td>
          <td>{update_seq}</td>
          <td>{startTime}</td>
        </tr>
      );
    });
    
    const boxBody = (
      <BoxBody withPadding={false}>
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

export default DatabaseList;
