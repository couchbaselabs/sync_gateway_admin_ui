import React, { PropTypes } from 'react';
import { Box, BoxHeader, BoxBody, BoxTools, BoxFooter } from '../ui';

const ChannelsPage = (props) => {
  return (
    <div>
      <Box topLine={false}>
        <BoxHeader title="Channels">

        </BoxHeader>
        <BoxBody>
          <div style={{height: '320px'}}></div>
        </BoxBody>
        <BoxFooter>
          <div><p> </p></div>
        </BoxFooter>
      </Box>
      {props.children}
    </div>
  );
}
export default ChannelsPage;
