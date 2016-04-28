import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { paramsOrProps, makePath } from '../../utils';
import Keys from '../../actions/Keys';
import { resetUpdateDocProgress, fetchDoc, updateDoc } from '../../actions/Api';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Brace, Icon, Space } from '../ui';

class RevisionEdit extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onEditorChange = this.onEditorChange.bind(this);
    this.saveOnClick = this.saveOnClick.bind(this);
    this.deleteOnClick = this.deleteOnClick.bind(this);

    this.state = {
      newDoc: undefined,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(resetUpdateDocProgress());
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { db, docId, revId } = paramsOrProps(this.props);
    dispatch(fetchDoc(db, docId, revId));
  }

  componentWillReceiveProps(nextProps) {
    let { rev } = nextProps;
    if (rev && !this.state.newDoc) {
      rev = Object.assign({ }, rev, { _revisions: undefined });
      this.setState(Object.assign({ }, this.state, { 
        newDoc: JSON.stringify(rev) 
      }));
    }

    const { dispatch, updateProgress } = nextProps;
    if (updateProgress) {
      if (updateProgress.inProgress) {
        // TODO:
      } else {
        if (updateProgress.success) {
          const { db, docId } = paramsOrProps(this.props);
          const { router } = this.context;
          router.replace(makePath('databases', db, 'documents', docId));
        } else
          alert('Error : ' + updateProgress.error);
        dispatch(resetUpdateDocProgress());
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { rev } = nextProps;
    const { rev: oRev } = this.props;
    const { db, docId, revId } = paramsOrProps(nextProps);
    const { db:oDb, docId:oDocId, revId:oRevId } = paramsOrProps(this.props);
    return (rev !== oRev || db !== oDb || docId !== oDocId || revId !== oRevId);
  }

  onEditorChange(body) {
    this.setState(Object.assign({ }, this.state, { 
      newDoc: body
    }));
  }

  saveOnClick() {
    const { dispatch } = this.props;
    const { db, docId, revId } = paramsOrProps(this.props);
    const { newDoc } = this.state;

    let json;
    try {
      json = JSON.parse(newDoc);
    } catch (error) {
      // TODO: Show error
      return;
    }

    dispatch(updateDoc(db, docId, revId, json));
  }

  deleteOnClick() {

  }

  render() {
    let { rev } = this.props;
    if (!rev)
      return null;

    const toolbar = (
      <div className="box-controls">
        <Button bsSize="sm" onClick={this.saveOnClick}>
          <Icon name="save"/> Save</Button>
        <Space/>
        <Button bsSize="sm"><Icon name="close"/> Cancel</Button><Space/>
        <Button bsSize="sm"><Icon name="paperclip"/> Attachment</Button><Space/>
        <Button bsSize="sm" onClick={this.deleteOnClick}>
          <Icon name="trash-o"/> Delete
        </Button>
        <div className="pull-right">
          <DropdownButton title="View Attachments" id="bg-nested-dropdown" bsSize="sm">
            <MenuItem eventKey="1">the_inside_story_on_shared_libraries_and_dynamic_loading.pdf</MenuItem>
            <MenuItem eventKey="2">Order Confirmation - LuckyVitamin.pdf</MenuItem>
          </DropdownButton>
        </div>
      </div>
    );

    rev = Object.assign({ }, rev, { _revisions: undefined });
    const json = JSON.stringify(rev, null, '\t');

    return (
      <div>
        {toolbar}
        <div className="docEditor">
          <Brace name="docEditor" mode="json" value={json} 
            onChange={this.onEditorChange} />
        </div>
      </div>
    );
  }
}

RevisionEdit.propTypes = {
  db: PropTypes.string,
  docId: PropTypes.string,
  revId: PropTypes.string,
  rev: PropTypes.object,
  updateProgress: PropTypes.object,
};

RevisionEdit.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const { db, docId, revId } = paramsOrProps(ownProps);
  const { docs, progress } = state.revision;
  const revs = docs && docs[docId];
  const rev = revs && revs[revId];
  const updateProgress = progress[Keys.UPDATE_DOC];
  return { 
    db, docId, revId, rev, updateProgress
  };
}
export default connect(mapStateToProps)(RevisionEdit);
