import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { makeUrlPath } from '../../utils';
import { fetchDoc } from '../../actions/Api';
import Revision from './Revision';
import RevisionList from './RevisionList';
import { Row, Col, Button, Table, DropdownButton, MenuItem } from 'react-bootstrap';
import { Box, BoxHeader, BoxTools, BoxBody, Icon, Space } from '../ui';

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
    const docRevId = revId || doc._rev;

    const boxHeader = (
      <BoxHeader title={doc._id}/>
    );

    const toolbar = (
      <div className="box-controls">
        <Button bsSize="sm"><Icon name="edit"/> Edit</Button><Space/>
        <Button bsSize="sm"><Icon name="clipboard"/> Copy</Button><Space/>
        <Button bsSize="sm"><Icon name="save"/> Save</Button><Space/>
        <Button bsSize="sm"><Icon name="close"/> Cancel</Button><Space/>
        <Button bsSize="sm"><Icon name="paperclip"/> Attachment</Button><Space/>
        <Button bsSize="sm"><Icon name="trash-o"/> Delete</Button>
        <div className="pull-right">
          <DropdownButton title="View Attachments" id="bg-nested-dropdown" bsSize="sm">
            <MenuItem eventKey="1">the_inside_story_on_shared_libraries_and_dynamic_loading.pdf</MenuItem>
            <MenuItem eventKey="2">Order Confirmation - LuckyVitamin.pdf</MenuItem>
          </DropdownButton>
        </div>
      </div>
    );

    const boxBody = (
      <BoxBody withPadding={false}>
        {toolbar}
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
