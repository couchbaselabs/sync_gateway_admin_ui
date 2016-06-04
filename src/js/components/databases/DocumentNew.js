import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import AppStore from '../../stores/AppStore';
import { createDoc } from '../../api';
import { Button, ButtonToolbar, Col, Row, Table } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxTools, BoxFooter, Brace, Icon, WinDiv } 
  from '../ui';

import 'brace/mode/json';

class DocumentNew extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      doc: '{\n\t\n}',
      isCreating: false,
      error: undefined,
      wHeight: window.innerHeight,
      cursorAt: { row:1, column:1 }
    };
    
    this.onEditorChange = this.onEditorChange.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isCreating, error } = nextState;
    AppStore.setActivityIndicatorVisible(isCreating, 'DocumentNew');
    AppStore.setAlert(error && { type: 'error', message: error.message });
  }
  
  componentWillUnmount() {
    AppStore.setActivityIndicatorVisible(false, 'DocumentNew');
    AppStore.setAlert(undefined);
  }
  
  handleResize() {
    this.setState(state => {
      return Object.assign({ }, state, { wHeight: window.innerHeight });
    });
  }
  
  setCreateStatus(isCreating, reason) {
    const error = reason && !reason.isCanceled ? reason : undefined;
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
    const fetch = createDoc(db, json);
      fetch.promise.then(result => {
        this.setCreateStatus(true);
        this.done();
      })
      .catch(reason => {
        this.setCreateStatus(false, reason);
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
    const { doc, cursorAt, wHeight } = this.state;
    
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
      <Box topLine={false}>
        {boxHeader}
        <BoxBody withPadding={false}>
          <WinDiv className="docEditor" offset={230}>
            <Brace name="docEditor" mode="json" value={doc} 
              cursorAt={cursorAt} onChange={this.onEditorChange}/>
          </WinDiv>
        </BoxBody>
      </Box>
    );
  }
}

DocumentNew.contextTypes = {
  router: PropTypes.object.isRequired
};

export default DocumentNew;
