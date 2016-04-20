import React from 'react';
import { connect } from 'react-redux'
import { setAppSidebarEnabled, setAppContentHeader } from '../actions/Api'

class Database extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, params} = this.props;
    dispatch(setAppSidebarEnabled(true));
    dispatch(setAppContentHeader(params.db));
  }
  
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setAppSidebarEnabled(false));
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default connect()(Database);
