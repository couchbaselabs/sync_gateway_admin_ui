import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { createDoc } from '../../api';
import { Button, ButtonToolbar, Col, Row, Table } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxTools, BoxFooter, Brace, Icon } from '../ui';

import 'brace/mode/json';

class DocumentNew extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      doc: '{\n\t\n}',
      isCreating: false,
      error: undefined,
      cursorAt: { row:1, column:1 }
    };
    
    this.onEditorChange = this.onEditorChange.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  
  componentDidUpdate() {
    const { progress } = this.props;
    if (progress && progress.success) {
      const { router } = this.context;
      router.goBack();
    }
  }

  setCreateStatus(isCreating, error) {
    this.setState(state => {
      return Object.assign({ }, state, { isCreating, error });
    });
  }
  
  save() {
    const { doc } = this.state;
    let json;
    try {
      json = JSON.parse(doc);
    } catch (error) {
      this.setCreateStatus(false, error);
      return;
    }

    const { db } = this.props.params;
    this.setCreateStatus(true);
    createDoc(db, json)
      .then(result => {
        this.setCreateStatus(true);
        this.done();
      })
      .catch(error => {
        this.setCreateStatus(false, error);
      });
  }

  done() {
    const { router } = this.context;
    router.goBack();
  }
  
  cancel() {
    const { router } = this.context;
    router.goBack();
  }

  onEditorChange(body) {
    this.setState(Object.assign({ }, this.state, { 
      doc: body,
      cursorAt: null
    }));
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

DocumentNew.contextTypes = {
  router: PropTypes.object.isRequired
};

export default DocumentNew
