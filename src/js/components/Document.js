import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { fetchDoc } from '../actions/Api';
import Revision from './Revision';
import RevisionList from './RevisionList';

class Document extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    const { db, docId } = params;
    dispatch(fetchDoc(db, docId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params } = this.props;
    const { db, docId } = params;
    const { db:newDb, docId:newDocId } = nextProps.params;
    if (db !== newDb || docId !== newDocId)
      dispatch(fetchDoc(newDb, newDocId));
  }

  render() {
    const { doc, params } = this.props;
    if (!doc)
      return null;

    let seq = doc._revisions.start;
    const revIds = doc._revisions.ids.map(id => {
      const revId = ((seq--) + '-' + id);
      return revId;
    })
    
    const { db, revId } = params; 
    const children = revId ? this.props.children : 
        <Revision db={db} docId={doc._id} revId={doc._rev}/>
    
    return (
      <div>
        <h3>Document:</h3> {doc._id}
        <RevisionList db={db} docId={doc._id} revIds={revIds} />
        {children}
      </div>
    );
  }
}

Document.propTypes = {
  doc: PropTypes.object,
}

export default connect((state, ownProps) => {
  return { 
    doc: state.document.docs[ownProps.params.docId]
  };
})(Document);
