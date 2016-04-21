import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makeUrlPath, truncateString } from '../../utils';

const Breadcrumbs = (props) => {
  if (!props.routes)
    return null;
  
  const routes = props.routes.filter((route) => route.path && true);
  const breadcrumbs = getAllPaths(routes)
    .map(path => resolveBreads(path, props.params, {'/' : 'Home'}))
    .map((bread, index, me) => {
      const icon = index == 0 && (<i className="fa fa-home"/>);
      return (
        <li key={index}>
          <Link onlyActiveOnIndex={true} activeClassName={null} to={bread.path}>
            {icon} {truncateString(bread.name, 10, '...')}
          </Link>
        </li>
      );
    });
  return ( 
    <ol className="breadcrumb">
      {breadcrumbs}
    </ol>
  );
}

const getAllPaths = (routes) => {
  const paths = [];
  for (let i = 0; i < routes.length; i++) {
    const { path } = routes[i];
    if (path.startsWith('/'))
      paths.push(path);
    else {
      if (i == 0)
        throw 'The root path must begin with "/"';
      const parent = paths[i-1];
      paths.push(parent + (parent.endsWith('/') ? '' : '/') + path);
    }
  }
  return paths;
}

const resolveBreads = (path, params, custom) => {
  let comps = path.split('/').filter(c => c.length > 0).map(c => {
    if (c.startsWith(':'))
      return params[c.substring(1)] || c;
    return c;
  });
  if (comps.length == 0) 
    comps = [''];

  const resolvedPath = makeUrlPath(...comps);

  let name = custom[path];
  if (!name)
    name = comps.length > 0 ? comps[comps.length - 1] : null;
  name = name || '?';

  return { name: name, path: resolvedPath };
}

Breadcrumbs.propTypes = {
  routes: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired
}

export default Breadcrumbs;
