import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import DatabaseListStore from '../../stores/DatabaseListStore';
import { fetchAllDatabases, fetchDatabase } from '../../api';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxTools, Icon} from '../ui';

class DatabaseList extends React.Component {
  constructor(props) {
    super(props);

    const dbNames = DatabaseListStore.getNames();
    const dbInfo = DatabaseListStore.getInfo();

    this.state = {
      dbNames,
      dbInfo,
      isFetching: false,
      error: undefined
    };
  }

  componentDidMount() {
    this.fetchDatabases();
  }

  setFetchStatus(isFetching, error) {
    this.setState(state => {
      return Object.assign({ }, state, { isFetching, error });
    });
  }

  setDatabaseNames(dbNames) {
    DatabaseListStore.setNames(dbNames);
    this.setState(state => {
      return Object.assign({ }, state, { dbNames });
    });
  }

  setDatabaseInfo(dbInfo) {
    DatabaseListStore.setInfo(dbInfo);
    this.setState(state => {
      return Object.assign({ }, state, { dbInfo });
    });
  }

  fetchDatabases() {
    this.setFetchStatus(true);
    fetchAllDatabases()
      .then(result => {
        this.setDatabaseNames(result.data);
        this.fetchDatabasesInfo(result.data)
      }).catch(error => {
        this.setFetchStatus(false, error);
      });
  }

  fetchDatabasesInfo(dbNames) {
    let fetches = dbNames.map(db => fetchDatabase(db));
    Promise.all(fetches)
      .then(results => {
        this.setFetchStatus(false);
        const dbInfo = { };
        for (const { data } of results) {
          dbInfo[data.db_name] = data;
        }
        this.setDatabaseInfo(dbInfo);
      }).catch(error => {
        this.setFetchStatus(false, error);
      });
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
