import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { makePath } from '../../utils';
import { fetchDoc } from '../../actions/Api';
import Revision from './Revision';
import RevisionList from './RevisionList';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, Icon, Space } from '../ui';

class Document extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    const { db, docId, revId } = params;
    dispatch(fetchDoc(db, docId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params } = this.props;
    const { db, docId, revId } = params;
    const { db:newDb, docId:newDocId, revId:newRevId} = nextProps.params;
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
    const docRevId = revId || doc._rev;

    const boxHeader = (
      <BoxHeader title={doc._id}/>
    );
    
    const boxBody = (
      <BoxBody withPadding={false}>
        {children}
      </BoxBody>
    );
    
    return (
      <Box topLine={false}>
        {boxHeader}
        {boxBody}
      </Box>
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
