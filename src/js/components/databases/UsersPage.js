import React, { PropTypes } from 'react';
import { Box, BoxHeader, BoxBody, BoxTools, BoxFooter } from '../ui';

const UsersPage = (props) => {
  return (
    <div>
      <Box topLine={false}>
        <BoxHeader title="Users"/>
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
export default UsersPage;
