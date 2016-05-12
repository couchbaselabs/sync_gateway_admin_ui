import React, { PropTypes } from 'react'; 
import { Link } from 'react-router';
import classNames from 'classnames';
import { makePath } from '../../utils';
import AppStore from '../../stores/AppStore';
import DocumentStore from '../../stores/DocumentStore';
import Revision from './Revision';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Box, BoxHeader, BoxTools, BoxBody, Icon, Space } from '../ui';

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.state = DocumentStore.getData();
  }
  
  componentWillMount() {
    DocumentStore.addChangeListener(this.dataStoreOnChange);
  }
  
  componentDidMount() {
    const { db, docId } = this.props.params;
    DocumentStore.fetchDocument(db, docId);
  }
  
  componentWillReceiveProps(nextProps) {
    const { db, docId } = nextProps.params;
    DocumentStore.fetchDocument(db, docId);
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching } = nextState;
    AppStore.setActivityIndicatorVisible(isFetching, 'Document');
  }
  
  componentWillUnmount() {
    DocumentStore.cancelFetchDocument();
    AppStore.setActivityIndicatorVisible(false, 'Document');
    DocumentStore.removeChangeListener(this.dataStoreOnChange);
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return DocumentStore.getData();
    })
  }
  
  currentRevId() {
    return this.props.params.revId || this.state.doc._rev;
  }
  
  prevRevision() {
    const { history } = this.state;
    const revId = this.currentRevId();
    const index = history.indexOf(revId);
    return index > 0 ? history[index - 1] : undefined;
  }
  
  nextRevision() {
    const { history } = this.state;
    const revId = this.currentRevId();
    const index = history.indexOf(revId);
    return index < history.length - 1 ? history[index + 1] : undefined;
  }
  
  render() {
    const { doc } = this.state;
    if (!doc)
      return null;
    
    const { db, revId } = this.props.params;
    const children = revId ? this.props.children : 
        <Revision db={db} docId={doc._id} revId={doc._rev}/>
    
    let revNav = null;
    
    const prevRev = this.prevRevision();
    const nextRev = this.nextRevision();
    if (prevRev || nextRev) {
      const baseClazz = 'btn btn-box-tool'
      
      const prevRevLinkClazz = baseClazz + (prevRev ? '': ' disabled');
      const prevRevLinkTo = makePath('databases', db, 'documents', 
        doc._id, prevRev);
      const prevRevLink = (
        <Link to={prevRevLinkTo} className={prevRevLinkClazz}>
          <Icon name="chevron-left"/>
        </Link>
      );
      
      const nextRevLinkClazz = baseClazz + (nextRev ? '': ' disabled');
      const nextRevLinkTo = makePath('databases', db, 'documents', 
        doc._id, nextRev);
      const nextRevLink = (
        <Link to={nextRevLinkTo} className={nextRevLinkClazz}>
          <Icon name="chevron-right"/>
        </Link>
      );
      
      revNav = (
        <BoxTools pullRight={true}>
          {prevRevLink}
          {nextRevLink}
        </BoxTools>);
    }
    
    const boxHeader = (
      <BoxHeader title={doc._id}>
        {revNav}
      </BoxHeader>
    );
    
    const boxBody = (
      <BoxBody withPadding={false}>
        {children}
      </BoxBody>
    );
    
    return (
      <Box topLine={false}>
        {boxHeader}
        {boxBody}
      </Box>
    );
  }
}

export default Document;
