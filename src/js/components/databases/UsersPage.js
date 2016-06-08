import React, { PropTypes } from 'react';
import UserList from './UserList';
import { Row, Col } from 'react-bootstrap';
import { WinDiv } from '../ui';

class UsersPage extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const style = {
      marginTop: '0px', padding: '0px', backgroundColor: '#ecf0f0'
    };
    
    const { params, routes } = this.props;
    const { path } = routes[routes.length - 1];
    
    let children;
    if (params.userId || path.endsWith('/_new'))
      children = this.props.children;
    else
      children = <WinDiv offset={169} style={{backgroundColor: '#fff'}}/>
    
    return (
      <div style={style}>
        <Row>
          <Col xs={4} md={3} style={{paddingRight: "4px"}}>  
            <UserList {...this.props} />
          </Col>
          <Col xs={8} md={9} style={{paddingLeft: "4px"}}>
            {children}
          </Col>
        </Row>
      </div>
    );
  }
}

export default UsersPage;
