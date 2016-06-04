import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import UserStore from '../../stores/UserStore';
import UserListStore from '../../stores/UserListStore';
import { createUser as createUserApi, updateUser as updateUserApi, 
  deleteUser as deleteUserApi } from '../../api';
import { Button, FormGroup, FormControl, ControlLabel, Checkbox, InputGroup } 
  from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxFooter, Icon, Space, WinDiv } from '../ui';
  
class UserEdit extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.saveOnClick = this.saveOnClick.bind(this);
    this.cancelOnClick = this.cancelOnClick.bind(this);
    this.deleteOnClick = this.deleteOnClick.bind(this);
    this.removeRoleOnClick = this.removeRoleOnClick.bind(this);
    this.removeChannelOnClick = this.removeChannelOnClick.bind(this);
    this.nameOnChange = this.nameOnChange.bind(this);
    this.disabledOnChange = this.disabledOnChange.bind(this);
    this.passwordOnChange = this.passwordOnChange.bind(this);
    this.resetPasswordOnChange = this.resetPasswordOnChange.bind(this);
    this.emailOnChange = this.emailOnChange.bind(this);
    this.rolesOnChange = this.rolesOnChange.bind(this);
    this.addRolesOnClick = this.addRolesOnClick.bind(this);
    this.channelsOnChange = this.channelsOnChange.bind(this);
    this.addChannelsOnClick = this.addChannelsOnClick.bind(this);
    
    this.state = {
      oUser: undefined,
      user: undefined,
      isDirty: false,
      isFetching: false,
      isUpdating: false,
      error: undefined
    };
  }
  
  componentWillMount() {
    UserStore.addChangeListener(this.dataStoreOnChange);
  }
  
  componentDidMount() {
    const { db, userId } = this.props.params;
    if (userId)
      UserStore.fetchUser(db, userId);
    else {
      // For creating a new user:
      this.setState(state => {
        return Object.assign({ }, state, { user: { } });
      });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const { db, userId } = this.props.params;
    if (userId) {
      const { db:newDb, userId:newUserId } = nextProps.params;
      if (db !== newDb || userId !== newUserId) {
        UserStore.cancelFetch();
        UserStore.fetchUser(newDb, newUserId);
      }  
    }
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, isUpdating, error } = nextState;
    const indicatorVisible = isFetching || isUpdating;
    AppStore.setActivityIndicatorVisible(indicatorVisible, 'UserEdit');
    AppStore.setAlert(error && { type: 'error', message: error.message });
  }
  
  componentWillUnmount() {
    this.cancelPendingFetch();
    
    UserStore.cancelFetch();
    UserStore.removeChangeListener(this.dataStoreOnChange);
    UserStore.reset();
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      let user = state.user;
      let oUser = state.oUser;
      const data = UserStore.getData();
      if (!user && data && data.user) {
        oUser = data.user;
        user = Object.assign({ }, data.user);
        delete user['all_channels'];
        delete user['roles'];
      }
      return Object.assign({ }, state, data, { user, oUser });
    })
  }
  
  isNewUser() {
    const { userId } = this.props.params;
    return userId === undefined;
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
      AppStore.setActivityIndicatorVisible(false, 'UserEdit');
      AppStore.setAlert(undefined);
    }
  }

  createUser(db, userInfo) {
    this.setUpdateStatus(true);
    this.fetch = createUserApi(db, userInfo);
    this.fetch.p.then(result => {
      UserListStore.setStale(true);
      this.setUpdateStatus(false);
      this.done(false);
    })
    .catch(reason => {
      this.setUpdateStatus(false, reason);
    });
  }
  
  updateUser(db, userId, userInfo) {
    this.setUpdateStatus(true);
    this.fetch = updateUserApi(db, userId, userInfo);
    this.fetch.p.then(result => {
      this.setUpdateStatus(false);
      this.done(false);
    })
    .catch(reason => {
      this.setUpdateStatus(false, reason);
    });
  }
  
  deleteUser(db, userId) {
    this.setUpdateStatus(true);
    this.fetch = deleteUserApi(db, userId);
    this.fetch.p.then(result => {
      UserListStore.deleteUser(userId);
      this.setUpdateStatus(false);
      this.done(true);
    })
    .catch(reason => {
      this.setUpdateStatus(false, reason);
    });
  }
  
  saveOnClick() {
    this.cancelPendingFetch();
    const { db, userId } = this.props.params;
    const { user } = this.state;
    if (this.isNewUser())
      this.createUser(db, user);
    else
      this.updateUser(db, userId, user);
  }
  
  deleteOnClick() {
    this.cancelPendingFetch();
    const { db, userId } = this.props.params;
    this.deleteUser(db, userId);
  }
  
  cancelOnClick() {
    this.done(false);
  }
  
  done(didDelete) {
    const { db } = this.props.params;
    const { router } = this.context;
    let name = !didDelete ? this.state.user.name : undefined;
    router.replace(makePath('databases', db, 'users', name));
  }
  
  removeRoleOnClick(index) {
    this.setState(state => {
      const user = Object.assign({ }, state.user);
      user.admin_roles.splice(index, 1);
      return Object.assign({ }, state, { user });
    });
  }
  
  removeChannelOnClick(index) {
    this.setState(state => {
      const user = Object.assign({ }, state.user);
      user.admin_channels.splice(index, 1);
      return Object.assign({ }, state, { user });
    });
  }
  
  nameOnChange(event) {
    const name = event.target.value;
    this.setState(state => {
      const user = Object.assign({ }, state.user);
      user.name = name;
      return Object.assign({ }, state, { user });
    });
  }
  
  disabledOnChange(event) {
    const disabled = event.target.checked;
    this.setState(state => {
      const user = Object.assign({ }, state.user);
      user.disabled = disabled;
      return Object.assign({ }, state, { user });
    });
  }
  
  passwordOnChange(event) {
    const password = event.target.value;
    this.setState(state => {
      const user = Object.assign({ }, state.user);
      user.password = password;
      return Object.assign({ }, state, { user });
    });
  }
  
  resetPasswordOnChange(event) {
    let { user } = this.state;
    const resetPassword = event.target.checked;
    if (resetPassword) {
      user = Object.assign({ }, user);
      user.password = '';
    } else {
      if (user.password && user.password.length == 0) {
        user = Object.assign({ }, user);
        delete user['password'];
      }
    }
    
    this.setState(state => {
      return Object.assign({ }, state, { user, resetPassword });
    });
  }
  
  emailOnChange(event) {
    const email = event.target.value;
    this.setState(state => {
      const user = Object.assign({ }, state.user);
      user.email = email;
      return Object.assign({ }, state, { user });
    });
  }
  
  rolesOnChange(event) {
    if (event.key === 'Enter')
      this.addRoles(event.target);
  }
  
  addRolesOnClick(event) {
    const input = ReactDOM.findDOMNode(this.refs.rolesInputText);
    this.addRoles(input);
  }
  
  addRoles(input) {
    const value = input.value.trim();
    if (value.length == 0)
      return;
      
    let roles = value.split(',').map(role => role.trim());
    this.setState(state => {
      const user = Object.assign({ }, state.user);
      const adminRoles = user.admin_roles || [ ];
      roles.forEach(role => {
        if (adminRoles.indexOf(role) == -1) {
          adminRoles.push(role);
        }
      });
      user.admin_roles = adminRoles;
      return Object.assign({ }, state, { user });
    });
    
    input.value = '';
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
      const user = Object.assign({ }, state.user);
      const adminChannels = user.admin_channels || [ ];
      channels.forEach(ch => {
        if (adminChannels.indexOf(ch) == -1) {
          adminChannels.push(ch);
        }
      });
      user.admin_channels = adminChannels;
      return Object.assign({ }, state, { user });
    });
    
    input.value = '';
  }
  
  render() {
    const newUser = this.isNewUser();
    let { user, resetPassword=false } = this.state;
    let body;
    if (user) {
      const { name='', email='', password='', disabled=false } = user;
      const { admin_roles:adminRoles } = user;
      let { admin_channels:adminChannels } = user;
      
      const deleteButton = newUser ? undefined : (
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
      
      let resetPasswordCheckbox;
      if (!newUser) {
        resetPasswordCheckbox = <Checkbox checked={resetPassword} 
          onChange={this.resetPasswordOnChange}>Reset password</Checkbox>;
      }
      
      let roles;
      if (adminRoles) {
        const style = { marginTop: "5px", marginRight: "5px" };
        roles = adminRoles.map((role, index) => {
          return (
            <Button key={'role-' + index} style={style} 
              onClick={()=>this.removeRoleOnClick(index)}>
              <Icon name="times"/> {role}
            </Button>
          );
        });
      }
      
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
                  readOnly={!newUser} 
                  onChange={this.nameOnChange}/>
                <Checkbox checked={disabled} 
                  onChange={this.disabledOnChange}>Disabled</Checkbox>
              </FormGroup>
              <FormGroup controlId="password">
                <ControlLabel>Password</ControlLabel>
                <FormControl type="password" value={password} 
                  placeholder={newUser ? 'Password' : 'NO CHANGE'} 
                  readOnly={resetPassword} 
                  onChange={this.passwordOnChange}/>
                {resetPasswordCheckbox}
              </FormGroup>
              <FormGroup controlId="email">
                <ControlLabel>Email</ControlLabel>
                <FormControl type="text" value={email} placeholder="Email" 
                  onChange={this.emailOnChange}/>
              </FormGroup>
              <FormGroup controlId="adminRoles">
                <ControlLabel>Admin Roles</ControlLabel>
                <InputGroup>
                  <FormControl ref="rolesInputText" type="text" 
                    placeholder="Add roles" 
                    onKeyPress={this.rolesOnChange} />
                  <InputGroup.Button>
                    <Button onClick={this.addRolesOnClick}>
                      <Icon name="plus"/>
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
                <div>{roles}</div>
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
    if (newUser) {
      title = 'New User';
    } else {
      const { oUser } = this.state;
      title = oUser ? oUser.name: '';
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

UserEdit.contextTypes = {
  router: PropTypes.object.isRequired
};

export default UserEdit;
