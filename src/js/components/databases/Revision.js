import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import Clipboard from 'clipboard';
import { makePath, paramsOrProps } from '../../utils';
import { fetchDoc } from '../../actions/Api';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Brace, Icon, Space } from '../ui';

class Revision extends React.Component {
  constructor(props) {
    super(props);
    this.braceOnLoad = this.braceOnLoad.bind(this);
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

  render() {
    const { rev } = this.props;
    if (!rev)
      return null;

    const { db, docId, revId } = paramsOrProps(this.props);
    const json = JSON.stringify(rev, null, '\t');

    const toolbar = (
      <div className="box-controls">
        <Link to={makePath('databases', db, 'documents', docId, revId, 'edit')}>
          <Button bsSize="sm"><Icon name="edit"/> Edit</Button>
        </Link>
        <Space/>
        <Button id="copy" bsSize="sm"><Icon name="clipboard"/> Copy</Button>
        <Space/>
        <div className="pull-right">
          <DropdownButton title="View Attachments" id="attachments" bsSize="sm">
            <MenuItem eventKey="1">the_inside_story_on_shared_libraries_and_dynamic_loading.pdf</MenuItem>
            <MenuItem eventKey="2">Order Confirmation - LuckyVitamin.pdf</MenuItem>
          </DropdownButton>
        </div>
      </div>
    );

    return (
      <div>
        {toolbar}
        <div className="docEditor">
          <Brace name="docEditor" mode="json" value={json} readOnly={true} 
            onLoad={this.braceOnLoad}/>
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
export default connect(mapStateToProps)(Revision);
