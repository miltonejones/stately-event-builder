import React from 'react';
import { Helmet } from 'react-helmet';

function PageTitle({ handler }) {
  if  (typeof handler.label !== 'string' || typeof handler.pagename !== 'string') {
    return <>{JSON.stringify(handler.label)}</>
  }
  return ( 
      <Helmet>
        <title>EventBuilder | {handler.pagename} | {handler.label}</title> 
      </Helmet> 
  );
}
 
PageTitle.defaultProps = {};
export default PageTitle;
