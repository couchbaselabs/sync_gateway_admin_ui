import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import AppStore from '../../stores/AppStore';
import ChannelsStore from '../../stores/ChannelsStore';
import { makePath } from '../../utils';
import { Button } from 'react-bootstrap';
import { AlertBox, Box, BoxHeader, BoxBody, BoxTools, BoxFooter, Icon, WinDiv } 
  from '../ui';

class Channel extends React.Component {
  constructor(props) {
    super(props); 
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.closeOnClick = this.closeOnClick.bind(this);
    this.reloadOnClick = this.reloadOnClick.bind(this);
    this.state = { };
  }
  
  componentWillMount() {
    const { channel } = this.props;
    this.feed = ChannelsStore.getChannelFeed(channel);
    this.feed.addChangeListener(this.dataStoreOnChange);
    this.feed.start();
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { isFetching, error } = nextState;
    AppStore.setAlert(error && { type: 'error', message: error.message });
  }
  
  componentWillUnmount() {
    this.feed.stop();
    this.feed.removeChangeListener(this.dataStoreOnChange);
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return Object.assign({ }, state, this.feed.getData());
    })
  }
  
  closeOnClick() {
    const { channel } = this.props;
    ChannelsStore.removeChannelFeed(channel);
  }
  
  reloadOnClick(event) {
    event.preventDefault();
    this.feed.start();
  }
  
  render() {
    const { db, channel } = this.props;

    const channelTitle = channel.split(',').join(', ');

    const allChanges = this.state.changes || [ ];
    const changeItems = allChanges.map(change => {
      const { id, seq, changes, deleted, removed } = change;
      const { rev } = changes[0];
      
      let title, label;
      if (deleted) {
        title = <span className="feed-title-disabled">{seq}. {id}</span>;
        label = <span className="feed-label label label-warning">Deleted</span>;
      } else {
        const link = makePath('databases', db, 'documents', id, rev);
        title = <Link to={link} className="feed-title">{seq}. {id}</Link>;
        if (removed) {
          label = 
            <span className="feed-label label label-primary">Removed</span>;
        }
      }
      
      return ( 
        <li key={seq} className="item">
          <div className="feed-info">
            {label}
            {title}
            <span className="feed-description">{rev}</span>
          </div>
        </li>
      );
    });
    
    const { error } = this.state;
    const alertBox = error ?
      (<AlertBox type="error">
        {error.message}. Click <a href="#" className="alert-link" 
          onClick={this.reloadOnClick}>here</a> to reload.
      </AlertBox>): null;
    
    return (
      <div className="channel">
        <Box bottomMargin={false}>
          <BoxHeader title={channelTitle}>
            <BoxTools>
              <Button bsClass="btn btn-box-tool" onClick={this.closeOnClick}>
                <Icon name="times"/>
              </Button>
            </BoxTools>
          </BoxHeader>
          <BoxBody 
            matchWinHeight={true} 
            matchWinHeightOffset={280} style={{overflow: 'auto'}}>
            { alertBox }
            <ul className="channel-feed channel-feed-in-box">
              {changeItems}
            </ul>
          </BoxBody>
        </Box>
      </div>
    );
  }
}

Channel.propTypes = {
  db: PropTypes.string.isRequired,
  channel: PropTypes.string.isRequired,
  canMoveLeft: PropTypes.bool,
  canMoveRight: PropTypes.bool
}

Channel.defaultProps = {
  canMoveLeft: false,
  canMoveRight: false
}

export default Channel;
