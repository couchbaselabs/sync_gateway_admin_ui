import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { paramsOrProps } from '../../utils';
import { fetchDoc } from '../../actions/Api';

class Revision extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { db, docId, revId } = paramsOrProps(this.props);
    dispatch(fetchDoc(db, docId, revId));
  }

  render() {
    const { rev } = this.props;
    return (
      <div>
        <h3>Content:</h3>
        <pre>{rev ? JSON.stringify(rev, undefined, 4) : ''}</pre>
      </div>  
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { db, docId, revId } = paramsOrProps(ownProps);
  const docRevInfo = state.revision[docId];
  const rev = docRevInfo && docRevInfo.revs && docRevInfo.revs[revId];
  return { 
    db, docId, revId, rev
  };
}
export default connect(mapStateToProps)(Revision);
