import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { paramsOrProps } from '../../utils';
import { fetchDoc } from '../../actions/Api';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Brace, Icon, Space } from '../ui';

class RevisionEdit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { db, docId, revId } = paramsOrProps(this.props);
    dispatch(fetchDoc(db, docId, revId));
  }

  render() {
    const toolbar = (
      <div className="box-controls">
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

    let { rev } = this.props;
    if (rev) // Remove _revisions data:
      rev = Object.assign({ }, rev, { _revisions: undefined });

    const json = rev ? JSON.stringify(rev, null, '\t') : '';
    return (
      <div>
        {toolbar}
        <div className="docEditor">
          <Brace name="docEditor" mode="json" value={json} readOnly={false} />
        </div>
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
export default connect(mapStateToProps)(RevisionEdit);
