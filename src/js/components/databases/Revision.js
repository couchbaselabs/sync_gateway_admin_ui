import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Clipboard from 'clipboard';
import { serverApi } from '../../app';
import { makePath, paramsOrProps } from '../../utils';
import { fetchRevision } from '../../api';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Brace, Icon, Space } from '../ui';

class Revision extends React.Component {
  constructor(props) {
    super(props);

    this.braceOnLoad = this.braceOnLoad.bind(this);
    this.attachmentsOnSelect = this.attachmentsOnSelect.bind(this);

    this.state = {
      rev: undefined,
      isFetching: false,
      error: undefined
    };
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
    this.fetchRevision(db, docId, revId);
  }

  componentWillReceiveProps(nextProps) {
    const { db, docId, revId } = paramsOrProps(this.props);
    const { db:newDb, docId:newDocId, revId:newRevId} = 
      paramsOrProps(nextProps);
    if (db !== newDb || docId !== newDocId || revId !== newRevId) {
      this.fetchRevision(newDb, newDocId, newRevId);
    }
  }

  componentWillUnMount() {
    this.clipboard && this.clipboard.destroy();
    this.editor = null;
  }

  setFetchStatus(isFetching, error) {
    this.setState(state => {
      return Object.assign({ }, state, { isFetching, error });
    });
  }

  setRevision(rev) {
    this.setState(state => {
      return Object.assign({ }, state, { rev });
    });
  }

  fetchRevision(db, docId, revId) {
    this.setFetchStatus(true);

    fetchRevision(db, docId, revId)
      .then(result => {
        this.setFetchStatus(false);
        this.setRevision(result.data);
      })
      .catch(error => {
        this.setFetchStatus(false, error);
      });
  }

  braceOnLoad(editor) {
    this.editor = editor;
  }

  attachmentsOnSelect(key) {
    const { db, docId, revId } = paramsOrProps(this.props);
    const path = makePath(db, docId, key, {rev: revId});
    window.open(serverApi(path), '_blank');
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
        menuItems.push(<MenuItem key={key} eventKey={key}>{key}</MenuItem>);
      });

      attachmentsDropDown = (
        <div className="pull-right">
          <DropdownButton title="View Attachments" id="attachments" bsSize="sm" 
            onSelect={this.attachmentsOnSelect}>
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
      <div className="docEditor">
        <Brace name="docEditor" mode="json" value={json} readOnly={true} 
          onLoad={this.braceOnLoad}/>
      </div>
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
