import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import Clipboard from 'clipboard';
import { serverApi } from '../../app';
import { makePath, paramsOrProps } from '../../utils';
import { fetchDoc } from '../../actions/Api';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Brace, Icon, Space } from '../ui';

class Revision extends React.Component {
  constructor(props) {
    super(props);
    this.braceOnLoad = this.braceOnLoad.bind(this);
    this.attachmentsOnSelect = this.attachmentsOnSelect.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { db, docId, revId } = paramsOrProps(this.props);
    dispatch(fetchDoc(db, docId, revId));

    const that = this;
    this.clipboard = new Clipboard('#copy', {
      text: () => {
        if (that.editor)
          return that.editor.getValue();
        return null;
      }
    });
  }

  componentWillUnMount() {
    this.clipboard && this.clipboard.destroy();
    this.editor = null;
  }

  braceOnLoad(editor) {
    this.editor = editor;
  }

  attachmentsOnSelect(event, key) {
    const { db, docId, revId } = paramsOrProps(this.props);
    const path = makePath(db, docId, key, {rev: revId});
    window.open(serverApi(path), '_blank');
  }

  render() {
    const { rev } = this.props;
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

const mapStateToProps = (state, ownProps) => {
  const { db, docId, revId } = paramsOrProps(ownProps);
  const docRevInfo = state.revision[docId];
  const rev = docRevInfo && docRevInfo.revs && docRevInfo.revs[revId];
  return { 
    db, docId, revId, rev
  };
}
export default connect(mapStateToProps)(Revision);
