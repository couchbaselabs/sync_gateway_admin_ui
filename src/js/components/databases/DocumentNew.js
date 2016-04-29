import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { Keys, createDoc } from '../../actions/Api';
import { Button, ButtonToolbar, Col, Row, Table } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxTools, BoxFooter, Brace, Icon } from '../ui';

import 'brace/mode/json';

class DocumentNew extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      doc: '{\n\t\n}',
      cursorAt: { row:1, column:1 }
    };
    
    this.onEditorChange = this.onEditorChange.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  
  componentWillMount() {
    const { dispatch, progress } = this.props;
    if (progress)
      progress.mayReset(dispatch);
  }
  
  componentDidUpdate() {
    const { progress } = this.props;
    if (progress && progress.success) {
      const { router } = this.context;
      router.goBack();
    }
  }
  
  onEditorChange(body) {
    this.setState(Object.assign({ }, this.state, { 
      doc: body,
      cursorAt: null
    }));
  }
  
  save() {
    const { dispatch, params } = this.props;
    const { doc } = this.state;
    let json;
    try {
      json = JSON.parse(doc);
    } catch (error) {
      // TODO: Show error
      return;
    }
    dispatch(createDoc(params.db, json));
  }
  
  cancel() {
    const { router } = this.context;
    router.goBack();
  }

  render() {
    const { doc, cursorAt } = this.state;
    
    const boxHeader = (
      <BoxHeader title="Create New Document">
        <BoxTools>
          <ButtonToolbar>
            <Button bsSize="sm" onClick={this.save}>
              <Icon name="save"/>
            </Button>
            <Button bsSize="sm" onClick={this.cancel}>
              <Icon name="close"/>
            </Button>
          </ButtonToolbar>
        </BoxTools>
      </BoxHeader>
    );
    
    return (
      <Box>
        {boxHeader}
        <BoxBody>
          <div className="docEditor">
            <Brace name="docEditor" mode="json" value={doc} 
              cursorAt={cursorAt} onChange={this.onEditorChange}/>
          </div>
        </BoxBody>
      </Box>
    );
  }
}

DocumentNew.propTypes = {
  progress: PropTypes.object
}

DocumentNew.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(state => {
  return { progress: state.document.progress[Keys.CREATE_DOC] }
})(DocumentNew);
