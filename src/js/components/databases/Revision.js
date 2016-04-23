import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { paramsOrProps } from '../../utils';
import { fetchDoc } from '../../actions/Api';
import { Brace } from '../ui';

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
    const json = rev ? JSON.stringify(rev, null, '\t') : '';
    return (
      <div className="docEditor">
        <Brace name="docEditor" mode="json" value={json} />
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
