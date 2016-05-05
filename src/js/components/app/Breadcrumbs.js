import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { makePath, truncateString } from '../../utils';

const Breadcrumbs = (props) => {
  if (!props.routes)
    return null;
  
  const routes = props.routes.filter((route) => route.path && true);
  const ignorePaths = ['/'];
  const breadcrumbs = getAllPaths(routes, ignorePaths)
    .map(path => resolveBreads(path, props.params, {'/' : 'Home'}))
    .map((bread, index, me) => {
      const icon = index == 0 && 
        bread.path === '/' && (<i className="fa fa-home"/>);
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

const getAllPaths = (routes, ignorePaths) => {
  const paths = [];
  for (let i = 0; i < routes.length; i++) {
    const { path } = routes[i];
    let absPath;
    if (path.startsWith('/'))
      absPath = path;
    else {
      if (i == 0)
        throw 'The root path must begin with "/"';
      const parent = paths[i-1];
      absPath = parent + (parent.endsWith('/') ? '' : '/') + path;
    }
    
    if (ignorePaths.indexOf(absPath) != 0)
      paths.push(absPath);
  }
  return paths;
}

const resolveBreads = (path, params, names) => {
  let comps = path.split('/').filter(c => {
    return c.length > 0
  }).map(c => {
    if (c.startsWith(':'))
      return params[c.substring(1)] || c;
    return c;
  });
  
  if (comps.length == 0) 
    comps = [''];

  const resolvedPath = makePath(...comps);

  let name = names[path];
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
