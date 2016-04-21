import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makeUrlPath } from '../../utils';

const RevisionList = ({ db, docId, revIds }) => {
  var revLinks = revIds.map(revId => 
    <li key={revId}>
      <Link to={makeUrlPath('databases', db, docId, revId)}>{revId}</Link>
    </li>
  );
  return (
    <div>
      <h3>Revisions ({revLinks.length}):</h3>
      <ul>
        {revLinks}
      </ul>
    </div>
  );
}

RevisionList.propTypes = { 
  db: PropTypes.string.isRequired,
  docId: PropTypes.string.isRequired,
  revIds: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default RevisionList;
