import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import UserStore from '../../stores/UserStore';
import { FormGroup, FormControl, ControlLabel, Checkbox, Button } 
  from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxFooter, Icon, Space, WinDiv } from '../ui';
  
class User extends React.Component {
  constructor(props) {
    super(props);
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.state = { };
  }
  
  componentWillMount() {
    UserStore.addChangeListener(this.dataStoreOnChange);
  }
  
  componentDidMount() {
    const { userId } = this.props.params;
    UserStore.fetchUser(userId);
  }
  
  componentWillReceiveProps(nextProps) {
    const { userId } = this.props.params;
    const { userId:nUserId } = nextProps.params;
    if (userId !== nUserId)
      UserStore.fetchUser(nUserId);
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, error } = nextState;
    AppStore.setActivityIndicatorVisible(isFetching, 'User');
    AppStore.setAlert(error && { type: 'error', message: error.message });
  }
  
  componentWillUnmount() {
    UserStore.cancelFetch();
    UserStore.removeChangeListener(this.dataStoreOnChange);
    UserStore.reset();
    
    AppStore.setActivityIndicatorVisible(false, 'User');
    AppStore.setAlert(undefined);
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return Object.assign({ }, state, UserStore.getData());
    })
  }
  
  render() {
    const { db, userId } = this.props.params;
    const { user } = this.state;

    let body;
    if (user) {
      const { name, email } = user;
      const { admin_roles:adminRoles, roles } = user;
      const { admin_channels:adminChannels, all_channels:allChannels } = user;
      
      const toolbar = (
        <div className="box-controls">
          <Link to={makePath('databases', db, 'users', userId, 'edit')}>
            <Button bsSize="sm"><Icon name="edit"/> Edit</Button>
          </Link>
        </div>
      );
    
      body = (
        <BoxBody withPadding={false}>
          { toolbar }
          <WinDiv offset={250} style={{padding: '10px'}}>
            <form>
              <FormGroup controlId="name">
                <ControlLabel>Name</ControlLabel>
                <div>{name}</div>
              </FormGroup>
              <FormGroup controlId="email">
                <ControlLabel>Email</ControlLabel>
                <div>{email || 'None'}</div>
              </FormGroup>
              <FormGroup controlId="adminRoles">
                <ControlLabel>Admin Roles</ControlLabel>
                <div>{adminRoles ? adminRoles.join(', ') : 'None'}</div>
              </FormGroup>
              <FormGroup controlId="roles">
                <ControlLabel>Roles</ControlLabel>
                <div>{roles ? roles.join(', ') : 'None'}</div>
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
          <WinDiv offset={210} style={{padding: '10px'}}></WinDiv>
        </BoxBody>
      );
    }
    
    let title;
    if (user) {
      let disabledLabel;
      if (user.disabled) {
        disabledLabel = (
          <span className="label label-default" style={{marginLeft: '10px'}}>
            Disabled
          </span>);
      }
      title = <div><span>{user.name}</span>{disabledLabel}</div>;
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

export default User;