import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import AppStore from '../../stores/AppStore';
import ChannelsStore from '../../stores/ChannelsStore';
import Channel from './Channel';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import { Box, BoxHeader, BoxBody, BoxTools, Icon, WinDiv } from '../ui';

const MAX_CHANNEL_FEEDS = 4;

class ChannelsPage extends React.Component {
  constructor(props) {
    super(props);
    this.dataStoreOnChange = this.dataStoreOnChange.bind(this);
    this.searchOnKeyPress = this.searchOnKeyPress.bind(this);
    this.searchOnClick = this.searchOnClick.bind(this);
    this.state = ChannelsStore.getData();
  }
  
  componentWillMount() {
    ChannelsStore.addChangeListener(this.dataStoreOnChange);
    ChannelsStore.setDatabase(this.props.params.db);
  }
  
  componentWillUnmount() {
    ChannelsStore.removeChangeListener(this.dataStoreOnChange);
  }
  
  componentWillUpdate(nextProps, nextState) {
    const { feeds } = this.state;
    if (!feeds || feeds.length < MAX_CHANNEL_FEEDS)
      AppStore.setAlert(undefined);
  }
  
  dataStoreOnChange() {
    this.setState(state => {
      return ChannelsStore.getData();
    })
  }
  
  searchOnKeyPress(event) {
    if (event.key === 'Enter') {
      this.addChannelFeed();
    }
  }
  
  searchOnClick(event) {
    this.addChannelFeed();
    // Unfocus button:
    event.target.blur();
  }
  
  addChannelFeed() {
    const input = ReactDOM.findDOMNode(this.refs.searchInputText);
    let chNames = this.nomalizeChannelNames(input.value);
    if (chNames.length > 0) {
      const { feeds } = this.state;
      if (!feeds || feeds.length < MAX_CHANNEL_FEEDS) {
        ChannelsStore.getChannelFeed(chNames);
      } else {
        if (!ChannelsStore.getExistingChannelFeed(chNames)) {
          AppStore.setAlert({ 
            type: 'info', 
            message: 'You have reached the maximum number of 4 channels limit.' 
          });
        }
      }
    }
    input.value = '';
    input.blur();
  }

  nomalizeChannelNames(chNames) {
    const names = chNames.split(',').map(n => n.trim());
    let result = names.join(',');
    return result;
  }
  
  render() {
    const { feeds } = this.state;
    const { db } = this.props.params;
    
    let channels;
    if (feeds && feeds.length > 0)
      channels = feeds.map((feed, index) =>
        <Channel key={feed.getChannel()} db={db} channel={feed.getChannel()}/>
      );
    else 
      channels = <WinDiv offset={220} style={{backgroundColor: 'white'}}/>;
      
    return (
      <div>
        <Box topLine={false} bottomMargin={false}>
          <BoxHeader>
            <div className="row">
              <div className="col-xs-12">
                <InputGroup bsSize="sm">
                  <FormControl type="text" placeholder="Channel Names (Use comma to separate names)"
                    ref="searchInputText" 
                    onKeyPress={this.searchOnKeyPress}/>
                  <InputGroup.Button>
                    <Button onClick={this.searchOnClick}>
                      <Icon name="play-circle"/>
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
              </div>
            </div>
          </BoxHeader>
          <BoxBody withPadding={false}>
            <div className="channels">
              {channels}
            </div>
          </BoxBody>
        </Box>
      </div>
    );
  }
}

export default ChannelsPage;
