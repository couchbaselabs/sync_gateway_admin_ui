import React, { PropTypes } from 'react';
import { paramsOrProps, makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import RevisionStore from '../../stores/RevisionStore';
import { updateRevision, uploadAttachment, deleteDoc } from '../../api';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Brace, Icon, Space } from '../ui';

class RevisionEdit extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.revisionStoreOnChange = this.revisionStoreOnChange.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.saveOnClick = this.saveOnClick.bind(this);
    this.cancelOnClick = this.cancelOnClick.bind(this);
    this.attachmentOnChange = this.attachmentOnChange.bind(this);
    this.deleteOnClick = this.deleteOnClick.bind(this);

    this.state = {
      rev: undefined,
      jsonStr: undefined,
      isFetching: false,
      isUpdating: false,
      error: undefined
    };
  }
  
  componentWillMount() {
    RevisionStore.addChangeListener(this.revisionStoreOnChange);
  }
  
  componentDidMount() {
    const { db, docId, revId } = this.props.params;
    RevisionStore.fetchRevision(db, docId, revId);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.rev !== this.state.rev || 
            nextState.isFetching !== this.state.isFetching || 
            nextState.isUpdating !== this.state.isUpdating || 
            nextState.error !== this.state.error);
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, isUpdating } = nextState;
    const indicatorVisible = isFetching || isUpdating;
    AppStore.setActivityIndicatorVisible(indicatorVisible, 'RevisionEdit');
  }
  
  componentWillUnmount() {
    this.fetch && this.fetch.cancel();
    RevisionStore.cancelFetchRevision();
    AppStore.setActivityIndicatorVisible(false, 'RevisionEdit');
    RevisionStore.removeChangeListener(this.revisionStoreOnChange);
  }
  
  revisionStoreOnChange() {
    this.setState(state => {
      const { rev, isFetching, error } = RevisionStore.getData();
      let jsonStr;
      if (rev) {
        const editRev = Object.assign({ }, rev, { _revisions: undefined });
        jsonStr = JSON.stringify(editRev, null, '\t');
      }
      return Object.assign({ }, state, { rev, jsonStr, isFetching, error });
    });
  }
  
  setUpdateStatus(isUpdating, reason) {
    const error = reason && !reason.isCanceled ? reason : undefined;
    this.setState(state => {
      return Object.assign({ }, state, { isUpdating, error });
    });
  }

  updateRevision(db, docId, revId, json) {
    this.setUpdateStatus(true);
    this.fetch = updateRevision(db, docId, revId, json);
    this.fetch.promise.then(result => {
      this.setUpdateStatus(false);
      this.done();
    })
    .catch(reason => {
      this.setUpdateStatus(false, reason);
    });
  }

  onEditorChange(jsonStr) {
    this.setState(state => {
      return Object.assign({ }, state, { jsonStr });
    });
  }

  saveOnClick() {
    const { db, docId, revId } = paramsOrProps(this.props);
    const { jsonStr } = this.state;
    let json;
    try {
      json = JSON.parse(jsonStr);
    } catch (error) {
      this.setUpdateStatus(false, error);
      return;
    }

    this.updateRevision(db, docId, revId, json);
  }

  cancelOnClick() {
    this.cancel();
  }
  
  attachmentOnChange(event) {
    const { db, docId, revId } = paramsOrProps(this.props);
    const file = event.target.files[0];
    this.fetch = uploadAttachment(db, docId, revId, file);
    this.fetch.promise.then(result => {
      this.setUpdateStatus(false);
      this.done();
    })
    .catch(error => {
      this.setUpdateStatus(false, error);
    });
  }
  
  deleteOnClick() {
    const { db, docId, revId } = paramsOrProps(this.props);
    this.fetch = deleteDoc(db, docId, revId);
    this.fetch.promise.then(result => {
      this.setUpdateStatus(false);
      this.gotoDocuments();
    })
    .catch(error => {
      this.setUpdateStatus(false, error);
    });
  }

  done() {
    const { db, docId } = paramsOrProps(this.props);
    const { router } = this.context;
    router.replace(makePath('databases', db, 'documents', docId));
  }
  
  gotoDocuments() {
    const { db, docId } = paramsOrProps(this.props);
    const { router } = this.context;
    router.replace(makePath('databases', db, 'documents'));
  }

  cancel() {
    const { db, docId, revId } = paramsOrProps(this.props);
    const { router } = this.context;
    router.replace(makePath('databases', db, 'documents', docId, revId));
  }

  render() {
    let { rev, jsonStr } = this.state;
    if (!rev)
      return null;

    let attachmentsDropDown = null;
    if (rev._attachments) {
      const menuItems = [];
      Object.keys(rev._attachments).forEach(key => {
        menuItems.push(<MenuItem key={key} eventKey={key}>{key}</MenuItem>);
      });

      attachmentsDropDown = (
        <div className="pull-right">
          <DropdownButton title="Attachments" id="attachments" bsSize="sm" 
            onSelect={this.attachmentsOnSelect}>
            {menuItems}
          </DropdownButton>
        </div>        
      );
    }

    const toolbar = (
      <div className="box-controls">
        <Button bsSize="sm" onClick={this.saveOnClick}>
          <Icon name="save"/> Save
        </Button><Space/>
        <Button bsSize="sm" onClick={this.cancelOnClick}>
          <Icon name="close"/> Cancel
        </Button><Space/>
        <div className="btn btn-default btn-sm btn-file">
          <Icon name="paperclip"/> Attachment
          <input type="file" name="attachment" 
            onChange={this.attachmentOnChange}/>
        </div><Space/>
        <Button bsSize="sm" onClick={this.deleteOnClick}>
          <Icon name="trash-o"/> Delete
        </Button>
        { attachmentsDropDown }
      </div>
    );

    return (
      <div>
        {toolbar}
        <div className="docEditor">
          <Brace name="docEditor" mode="json" value={jsonStr} 
            onChange={this.onEditorChange} />
        </div>
      </div>
    );
  }
}

RevisionEdit.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RevisionEdit;
