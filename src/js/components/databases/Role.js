import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import RoleStore from '../../stores/RoleStore';
import { FormGroup, FormControl, ControlLabel, Checkbox, Button } 
  from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxFooter, Icon, Space, WinDiv } from '../ui';
  
class Role extends React.Component {
  constructor(props) {
    super(props);
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.state = { };
  }
  
  componentWillMount() {
    RoleStore.addChangeListener(this.dataStoreOnChange);
  }
  
  componentDidMount() {
    const { db, roleId } = this.props.params;
    RoleStore.fetchRole(db, roleId);
  }
  
  componentWillReceiveProps(nextProps) {
    const { db, roleId } = this.props.params;
    const { db:nDb, roleId:nRoleId } = nextProps.params;
    if (db !== nDb || roleId !== nRoleId)
      RoleStore.fetchRole(nDb, nRoleId);
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, error } = nextState;
    AppStore.setActivityIndicatorVisible(isFetching, 'Role');
    AppStore.setAlert(error && { type: 'error', message: error.message });
  }
  
  componentWillUnmount() {
    RoleStore.cancelFetch();
    RoleStore.removeChangeListener(this.dataStoreOnChange);
    RoleStore.reset();
    
    AppStore.setActivityIndicatorVisible(false, 'Role');
    AppStore.setAlert(undefined);
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return Object.assign({ }, state, RoleStore.getData());
    })
  }
  
  render() {
    const { db, roleId } = this.props.params;
    const { role } = this.state;

    let body;
    if (role) {
      const { name } = role;
      const { admin_channels:adminChannels, all_channels:allChannels } = role;
      
      const toolbar = (
        <div className="box-controls">
          <Link to={makePath('databases', db, 'roles', roleId, 'edit')}>
            <Button bsSize="sm"><Icon name="edit"/> Edit</Button>
          </Link>
        </div>
      );
    
      body = (
        <BoxBody withPadding={false}>
          { toolbar }
          <WinDiv offset={267} style={{padding: '10px'}}>
            <form>
              <FormGroup controlId="name">
                <ControlLabel>Name</ControlLabel>
                <div>{name}</div>
              </FormGroup>
              <FormGroup controlId="adminChannels">
                <ControlLabel>Admin Channels</ControlLabel>
                <div>{adminChannels ? adminChannels.join(', ') : 'None'}</div>
              </FormGroup>
              <FormGroup controlId="allChannels">
                <ControlLabel>All Channels</ControlLabel>
                <div>{allChannels ? allChannels.join(', ') : 'None'}</div>
              </FormGroup>
            </form>
          </WinDiv>
        </BoxBody>
      );
    } else {
      body = (
        <BoxBody withPadding={false}>
          <WinDiv offset={227} style={{padding: '10px'}}></WinDiv>
        </BoxBody>
      );
    }
    
    let title;
    if (role) {
      title = <div><span>{role.name}</span></div>;
    } else
      title = <div> </div>;
    
    return (
      <Box topLine={false} bottomMargin={false} 
        style={{borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}>
        <BoxHeader title={title}/>
        { body }
      </Box>  
    );
  }
}

export default Role;