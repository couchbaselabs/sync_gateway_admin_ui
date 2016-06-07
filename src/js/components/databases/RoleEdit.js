import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import RoleStore from '../../stores/RoleStore';
import RoleListStore from '../../stores/RoleListStore';
import { createRole as createRoleApi, updateRole as updateRoleApi, 
  deleteRole as deleteRoleApi } from '../../api';
import { Button, FormGroup, FormControl, ControlLabel, Checkbox, InputGroup } 
  from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxFooter, Icon, Space, WinDiv } from '../ui';
  
class RoleEdit extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.saveOnClick = this.saveOnClick.bind(this);
    this.cancelOnClick = this.cancelOnClick.bind(this);
    this.deleteOnClick = this.deleteOnClick.bind(this);
    this.removeChannelOnClick = this.removeChannelOnClick.bind(this);
    this.nameOnChange = this.nameOnChange.bind(this);
    this.channelsOnChange = this.channelsOnChange.bind(this);
    this.addChannelsOnClick = this.addChannelsOnClick.bind(this);
    
    this.state = {
      oRole: undefined,
      role: undefined,
      isDirty: false,
      isFetching: false,
      isUpdating: false,
      error: undefined
    };
  }
  
  componentWillMount() {
    RoleStore.addChangeListener(this.dataStoreOnChange);
  }
  
  componentDidMount() {
    const { db, roleId } = this.props.params;
    if (roleId)
      RoleStore.fetchRole(db, roleId);
    else {
      // For creating a new role:
      this.setState(state => {
        return Object.assign({ }, state, { role: { } });
      });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const { db, roleId } = this.props.params;
    if (roleId) {
      const { db:newDb, roleId:newRoleId } = nextProps.params;
      if (db !== newDb || roleId !== newRoleId) {
        RoleStore.cancelFetch();
        RoleStore.fetchRole(newDb, newRoleId);
      }  
    }
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, isUpdating, error } = nextState;
    const indicatorVisible = isFetching || isUpdating;
    AppStore.setActivityIndicatorVisible(indicatorVisible, 'RoleEdit');
    AppStore.setAlert(error && { type: 'error', message: error.message });
  }
  
  componentWillUnmount() {
    this.cancelPendingFetch();
    
    RoleStore.cancelFetch();
    RoleStore.removeChangeListener(this.dataStoreOnChange);
    RoleStore.reset();
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      let role = state.role;
      let oRole = state.oRole;
      const data = RoleStore.getData();
      if (!role && data && data.role) {
        oRole = data.role;
        role = Object.assign({ }, data.role);
        delete role['all_channels'];
      }
      return Object.assign({ }, state, data, { role, oRole });
    })
  }
  
  isNewRole() {
    const { roleId } = this.props.params;
    return roleId === undefined;
  }
  
  setUpdateStatus(isUpdating, reason) {
    const error = reason && !reason.isCanceled ? reason : undefined;
    this.setState(state => {
      return Object.assign({ }, state, { isUpdating, error });
    });
  }
  
  cancelPendingFetch() {
    if (this.fetch) {
      this.fetch.cancel();
      AppStore.setActivityIndicatorVisible(false, 'RoleEdit');
      AppStore.setAlert(undefined);
    }
  }

  createRole(db, roleInfo) {
    this.setUpdateStatus(true);
    this.fetch = createRoleApi(db, roleInfo);
    this.fetch.p.then(result => {
      RoleListStore.setStale(true);
      this.setUpdateStatus(false);
      this.done(false);
    })
    .catch(reason => {
      this.setUpdateStatus(false, reason);
    });
  }
  
  updateRole(db, roleId, roleInfo) {
    this.setUpdateStatus(true);
    this.fetch = updateRoleApi(db, roleId, roleInfo);
    this.fetch.p.then(result => {
      this.setUpdateStatus(false);
      this.done(false);
    })
    .catch(reason => {
      this.setUpdateStatus(false, reason);
    });
  }
  
  deleteRole(db, roleId) {
    this.setUpdateStatus(true);
    this.fetch = deleteRoleApi(db, roleId);
    this.fetch.p.then(result => {
      RoleListStore.deleteRole(roleId);
      this.setUpdateStatus(false);
      this.done(true);
    })
    .catch(reason => {
      this.setUpdateStatus(false, reason);
    });
  }
  
  saveOnClick() {
    this.cancelPendingFetch();
    const { db, roleId } = this.props.params;
    const { role } = this.state;
    if (this.isNewRole())
      this.createRole(db, role);
    else
      this.updateRole(db, roleId, role);
  }
  
  deleteOnClick() {
    this.cancelPendingFetch();
    const { db, roleId } = this.props.params;
    this.deleteRole(db, roleId);
  }
  
  cancelOnClick() {
    this.done(false);
  }
  
  done(didDelete) {
    const { db } = this.props.params;
    const { router } = this.context;
    let name = !didDelete ? this.state.role.name : undefined;
    router.replace(makePath('databases', db, 'roles', name));
  }
  
  nameOnChange(event) {
    const name = event.target.value;
    this.setState(state => {
      const role = Object.assign({ }, state.role);
      role.name = name;
      return Object.assign({ }, state, { role });
    });
  }
  
  channelsOnChange(event) {
    if (event.key === 'Enter')
      this.addChannels(event.target);
  }
  
  addChannelsOnClick() {
    const input = ReactDOM.findDOMNode(this.refs.channelsInputText);
    this.addChannels(input);
  }
  
  addChannels(input) {
    const value = input.value.trim();
    if (value.length == 0)
      return;
        
    let channels = value.split(',').map(role => role.trim());
    this.setState(state => {
      const role = Object.assign({ }, state.role);
      const adminChannels = role.admin_channels || [ ];
      channels.forEach(ch => {
        if (adminChannels.indexOf(ch) == -1) {
          adminChannels.push(ch);
        }
      });
      role.admin_channels = adminChannels;
      return Object.assign({ }, state, { role });
    });
    
    input.value = '';
  }
  
  removeChannelOnClick(index) {
    this.setState(state => {
      const role = Object.assign({ }, state.role);
      role.admin_channels.splice(index, 1);
      return Object.assign({ }, state, { role });
    });
  }
  
  render() {
    const newRole = this.isNewRole();
    let { role } = this.state;
    let body;
    if (role) {
      const { name='' } = role;
      let { admin_channels:adminChannels } = role;
      
      const deleteButton = newRole ? undefined : (
        <Button bsSize="sm" onClick={this.deleteOnClick}>
          <Icon name="trash-o"/> Delete
        </Button>
      );
      
      const toolbar = (
        <div className="box-controls">
          <Button bsSize="sm" onClick={this.saveOnClick}>
            <Icon name="save"/> Save
          </Button>
          <Space/>
          <Button bsSize="sm" onClick={this.cancelOnClick}>
            <Icon name="cancel"/> Cancel
          </Button>
          <Space/>
          { deleteButton }
        </div>
      );
      
      let channels;
      if (adminChannels) {
        const style = { marginTop: "5px", marginRight: "5px" };
        channels = adminChannels.map((channel, index) => {
          return (
            <Button key={'channel-' + index} style={style}
              onClick={()=>this.removeChannelOnClick(index)}>
              <Icon name="times"/> {channel}
            </Button>
          );
        });
      }
      
      body = (
        <BoxBody withPadding={false}>
          <WinDiv offset={227} style={{overflow: 'auto'}}>
            { toolbar }
            <form style={{padding: '10px'}}>
              <FormGroup controlId="name">
                <ControlLabel>Name</ControlLabel>
                <FormControl type="text" value={name} placeholder="Name" 
                  readOnly={!newRole} 
                  onChange={this.nameOnChange}/>
              </FormGroup>
              <FormGroup controlId="adminChannels">
                <ControlLabel>Admin Channels</ControlLabel>
                <InputGroup>
                  <FormControl ref="channelsInputText" type="text" 
                    placeholder="Add channels" 
                    onKeyPress={this.channelsOnChange}/>
                  <InputGroup.Button>
                    <Button onClick={this.addChannelsOnClick}>
                      <Icon name="plus"/>
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
                <div>{channels}</div>
              </FormGroup>
            </form>
          </WinDiv>
        </BoxBody>
      );
    } else {
      body = (
        <BoxBody withPadding={false}>
          <WinDiv offset={300} style={{padding: '10px'}}></WinDiv>
        </BoxBody>
      );
    }
    
    let title;
    if (newRole) {
      title = 'New Role';
    } else {
      const { oRole } = this.state;
      title = oRole ? oRole.name: '';
    }
    
    return (
      <Box topLine={false} bottomMargin={false} 
        style={{borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}>
        <BoxHeader title={title}/>
        { body }
      </Box>  
    );
  }
}

RoleEdit.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RoleEdit;
