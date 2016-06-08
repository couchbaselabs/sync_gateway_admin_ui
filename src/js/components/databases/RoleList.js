import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import RoleListStore from '../../stores/RoleListStore';
import { Row, Col, Button, FormControl, Nav, NavItem } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxFooter, WinDiv } 
  from '../ui';

class RoleList extends React.Component {
  constructor(props) {
    super(props);
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.roleFilterOnChange = this.roleFilterOnChange.bind(this);
    this.rolesOnSelect = this.rolesOnSelect.bind(this);
    this.state = RoleListStore.getData();
  }
  
  componentWillMount() {
    RoleListStore.addChangeListener(this.dataStoreOnChange);
  }
  
  componentDidMount() {
    this.reloadRoleList();
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, error, isStale } = nextState;
    AppStore.setActivityIndicatorVisible(isFetching, 'RoleList');
    AppStore.setAlert(error && { type: 'error', message: error.message });
    
    if (isStale && !isFetching && !error)
      setTimeout(() => { this.reloadRoleList() }, 0);
  }
  
  componentWillUnmount() {
    RoleListStore.cancelFetch();
    RoleListStore.removeChangeListener(this.dataStoreOnChange);
    
    AppStore.setActivityIndicatorVisible(false, 'RoleList');
    AppStore.setAlert(undefined);
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return Object.assign({ }, state, RoleListStore.getData());
    })
  }
  
  reloadRoleList() {
    const { db } = this.props.params;
    RoleListStore.fetchRoleList(db);
  }
  
  roleFilterOnChange(event) {
    const filter = event.target.value;
    RoleListStore.setFilter(filter);
  }
  
  rolesOnSelect(index) {
    const { roles } = this.state;
    const role = index < roles.length ? roles[index] : undefined;
    if (role) {
      const { db } = this.props.params;
      const { router } = this.context;
      router.push(makePath('databases', db, 'roles', role));
    }
  }
  
  render() {
    let { db, roleId } = this.props.params;
    
    let roles;
    if (this.state.filter)
      roles = this.state.filteredRoles; 
    else
      roles = this.state.roles;
    
    let selectedIndex;
    let roleList;
    if (roles) {
      const roleItems = roles.map((role, index) => {
        if (role === roleId)
          selectedIndex = index;
        return <NavItem key={index} eventKey={index}>{role}</NavItem>;
      })
      roleList = (
        <Nav bsStyle="pills" stacked={true} activeKey={selectedIndex} 
          onSelect={this.rolesOnSelect}>
          {roleItems}
        </Nav>
      );
    }
    
    return (
      <Box topLine={false} bottomMargin={false} 
        style={{borderTopRightRadius: "0px", borderBottomRightRadius: "0px"}}>
        <BoxHeader>
          <Row>
            <Col xs={12}>
              <FormControl type="text" placeholder="Role name" 
                onChange={this.roleFilterOnChange}/>
            </Col>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Col xs={12}>
              <Link to={makePath('databases', db, 'roles', '_new')}>
                <Button 
                  bsClass="btn btn-block btn-default btn-flat" 
                  style={{width: '100%'}}>
                  Create New Role
                </Button>
              </Link>
            </Col>
          </Row>
        </BoxHeader>
        <BoxBody withPadding={false}>
          <WinDiv offset={268} style={{overflow: 'auto'}}>
            {roleList}
          </WinDiv>
        </BoxBody>
      </Box>
    );
  }
}

RoleList.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RoleList;
