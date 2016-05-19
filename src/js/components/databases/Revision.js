import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Clipboard from 'clipboard';
import { serverApi } from '../../app';
import { makePath, paramsOrProps } from '../../utils';
import AppStore from '../../stores/AppStore';
import RevisionStore from '../../stores/RevisionStore';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Brace, Icon, Space, WinDiv } from '../ui';

const FOLD_REVISIONS_ENABLED = false;

class Revision extends React.Component {
  constructor(props) {
    super(props);
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.braceOnLoad = this.braceOnLoad.bind(this);
    this.state = RevisionStore.getData();
  }
  
  componentWillMount() {
    RevisionStore.addChangeListener(this.dataStoreOnChange);
  }

  componentDidMount() {
    const that = this;
    this.clipboard = new Clipboard('#copy', {
      text: () => {
        if (that.editor)
          return that.editor.getValue();
        return null;
      }
    });
    
    const { db, docId, revId } = paramsOrProps(this.props);
    RevisionStore.fetchRevision(db, docId, revId);
  }

  componentWillReceiveProps(nextProps) {
    const { db, docId, revId } = paramsOrProps(this.props);
    const { db:newDb, docId:newDocId, revId:newRevId} = 
      paramsOrProps(nextProps);
    if (db !== newDb || docId !== newDocId || revId !== newRevId) {
      RevisionStore.cancelFetchRevision();
      RevisionStore.fetchRevision(newDb, newDocId, newRevId);
    }
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, error } = nextState;
    AppStore.setActivityIndicatorVisible(isFetching, 'Revision');
    AppStore.setAlert(error && { type: 'error', message: error.message });
  }
  
  componentDidUpdate() {
    this.foldRevisions();
  }
  
  componentWillUnmount() {
    RevisionStore.removeChangeListener(this.dataStoreOnChange);
    RevisionStore.cancelFetchRevision();
    RevisionStore.reset();
    
    AppStore.setActivityIndicatorVisible(false, 'Revision');
    AppStore.setAlert(undefined);
    
    this.clipboard && this.clipboard.destroy();
    this.editor = null;
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return RevisionStore.getData();
    });
  }
  
  foldRevisions() {
    if (FOLD_REVISIONS_ENABLED) {
      if (this.editor) {
        let begin = this.editor.find('"_revisions":');
        if (begin) {
          let end = this.editor.find('}', { begin });
          if (end)
            this.editor.getSession().foldAll(begin.start.row, end.end.row, 0);
        }
      }
    }
  }

  braceOnLoad(editor) {
    this.editor = editor;
  }

  render() {
    const { rev } = this.state;
    if (!rev)
      return null;
    
    const { db, docId, revId } = paramsOrProps(this.props);
    
    let attachmentsDropDown = null;
    if (rev._attachments) {
      const menuItems = [];
      Object.keys(rev._attachments).forEach(key => {
        const path = makePath(db, docId, key, {rev: revId});
        const url = serverApi(path);
        menuItems.push(
          <MenuItem key={key} href={url} target="_blank">{key}</MenuItem>);
      });

      attachmentsDropDown = (
        <div className="pull-right">
          <DropdownButton title="Attachments" id="attachments" bsSize="sm">
            {menuItems}
          </DropdownButton>
        </div>        
      );
    }

    const toolbar = (
      <div className="box-controls">
        <Link to={makePath('databases', db, 'documents', docId, revId, 'edit')}>
          <Button bsSize="sm"><Icon name="edit"/> Edit</Button>
        </Link>
        <Space/>
        <Button id="copy" bsSize="sm"><Icon name="clipboard"/> Copy</Button>
        <Space/>
        {attachmentsDropDown}
      </div>
    );

    const json = JSON.stringify(rev, null, '\t');
    const editor = (
      <WinDiv className="docEditor" offset={270}>
        <Brace name="docEditor" mode="json" value={json} readOnly={true} 
          onLoad={this.braceOnLoad}/>
      </WinDiv>
    );

    return (
      <div>
        {toolbar}
        {editor}
      </div>
    );
  }
}

export default Revision;
