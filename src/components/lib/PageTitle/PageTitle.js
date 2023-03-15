import React from 'react';
import { Helmet } from 'react-helmet';

function PageTitle({ handler }) {
  if  (typeof handler.title !== 'string' || typeof handler.pagename !== 'string') {
    return <>{JSON.stringify(handler.title)}</>
  }
  return ( 
      <Helmet>
        <title>EventBuilder | {handler.pagename} | {handler.title}</title> 
      </Helmet> 
  );
}
 
PageTitle.defaultProps = {};
export default PageTitle;
