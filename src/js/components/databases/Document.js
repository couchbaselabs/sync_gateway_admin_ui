import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath } from '../../utils';
import { fetchDoc } from '../../api';
import Revision from './Revision';
import RevisionList from './RevisionList';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, Icon, Space } from '../ui';

class Document extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doc: undefined,
      isFetching: false,
      error: undefined
    };
  }

  componentDidMount() {
    const { db, docId } = this.props.params;
    this.fetchDocument(db, docId);
  }

  componentWillReceiveProps(nextProps) {
    const { db, docId } = nextProps.params;
    this.fetchDocument(db, docId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { db, docId } = nextProps.params;
    const { db:oDb, docId:oDocId } = this.props.params;
    const { doc } = nextState;
    const { oDoc } = this.state;
    return db !== oDb || docId !== oDocId || doc != oDoc;
  }

  setFetchStatus(isFetching, error) {
    this.setState(state => {
      return Object.assign({ }, state, { isFetching, error });
    });
  }

  setDoc(doc) {
    this.setState(state => {
      return Object.assign({ }, state, { doc });
    });
  }

  fetchDocument(db, docId) {
    this.setFetchStatus(true);

    fetchDoc(db, docId)
      .then(result => {
        this.setFetchStatus(false);
        this.setDoc(result.data);
      })
      .catch(error => {
        this.setFetchStatus(false, error);
      });
  }

  render() {
    const { doc } = this.state;
    if (!doc)
      return null;

    let seq = doc._revisions.start;
    const revIds = doc._revisions.ids.map(id => {
      const revId = ((seq--) + '-' + id);
      return revId;
    })
    
    const { db, revId } = this.props.params;
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

export default Document;
