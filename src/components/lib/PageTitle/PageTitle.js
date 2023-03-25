import React from 'react';
import { Helmet } from 'react-helmet';
import { themeTypes } from '../../../colors';

function PageTitle({ handler }) {
  if  (typeof handler.title !== 'string' || typeof handler.pagename !== 'string') {
    return <>{JSON.stringify(handler.title)}</>
  }
  const themeType = themeTypes[handler.props.theme]; 
  return ( 
      <Helmet>
         <meta name="theme-color" content={themeType?.main} />
        <title>EventBuilder | {handler.pagename} | {handler.title}</title> 
      </Helmet> 
  );
}
 
PageTitle.defaultProps = {};
export default PageTitle;
