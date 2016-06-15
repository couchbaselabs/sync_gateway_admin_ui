import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import UserListStore from '../../stores/UserListStore';
import { Row, Col, Button, FormControl, Nav, NavItem } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxFooter, WinDiv } 
  from '../ui';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.userFilterOnChange = this.userFilterOnChange.bind(this);
    this.usersOnSelect = this.usersOnSelect.bind(this);
    this.state = UserListStore.getData();
  }
  
  componentWillMount() {
    UserListStore.addChangeListener(this.dataStoreOnChange);
  }
  
  componentDidMount() {
    this.reloadUserList();
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, error, isStale } = nextState;
    AppStore.setActivityIndicatorVisible(isFetching, 'UserList');
    AppStore.setAlert(error && { type: 'error', message: error.message });
    
    if (isStale && !isFetching && !error)
      setTimeout(() => { this.reloadUserList() }, 0);
  }
  
  componentWillUnmount() {
    UserListStore.cancelFetch();
    UserListStore.removeChangeListener(this.dataStoreOnChange);
    
    AppStore.setActivityIndicatorVisible(false, 'UserList');
    AppStore.setAlert(undefined);
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return Object.assign({ }, state, UserListStore.getData());
    })
  }
  
  reloadUserList() {
    UserListStore.fetchUserList();
  }
  
  userFilterOnChange(event) {
    const filter = event.target.value;
    UserListStore.setFilter(filter);
  }
  
  usersOnSelect(index) {
    const { users } = this.state;
    const user = index < users.length ? users[index] : undefined;
    if (user) {
      const { db } = this.props.params;
      const { router } = this.context;
      router.push(makePath('databases', db, 'users', user));
    }
  }
  
  render() {
    let { db, userId } = this.props.params;
    
    let users;
    if (this.state.filter)
      users = this.state.filteredUsers; 
    else
      users = this.state.users;
    
    let selectedIndex;
    let userList;
    if (users) {
      const userItems = users.map((user, index) => {
        if (user === userId)
          selectedIndex = index;
        return <NavItem key={index} eventKey={index}>{user}</NavItem>;
      })
      userList = (
        <Nav bsStyle="pills" stacked={true} activeKey={selectedIndex} 
          onSelect={this.usersOnSelect}>
          {userItems}
        </Nav>
      );
    }
    
    return (
      <Box topLine={false} bottomMargin={false} 
        style={{borderTopRightRadius: "0px", borderBottomRightRadius: "0px"}}>
        <BoxHeader>
          <Row>
            <Col xs={12}>
              <FormControl type="text" placeholder="Username" 
                onChange={this.userFilterOnChange}/>
            </Col>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Col xs={12}>
              <Link to={makePath('databases', db, 'users', '_new')}>
                <Button 
                  bsClass="btn btn-block btn-default btn-flat" 
                  style={{width: '100%'}}>
                  Create New User
                </Button>
              </Link>
            </Col>
          </Row>
        </BoxHeader>
        <BoxBody withPadding={false}>
          <WinDiv offset={268} style={{overflow: 'auto'}}>
            {userList}
          </WinDiv>
        </BoxBody>
      </Box>
    );
  }
}

UserList.contextTypes = {
  router: PropTypes.object.isRequired
};

export default UserList;
