import React from 'react';
import { IconButton, Box, Breadcrumbs, Typography, Link, styled } from '@mui/material';
import { Flex, Tooltag, Spacer, TextIcon, Nowrap } from '../../../../../styled';
import AppsFooter from '../AppsFooter/AppsFooter';



const Hand = styled(({ className, ...props }) => (
  <Link {...props} underline="hover" color="inherit"/>
))(({ theme }) => ({
  cursor: 'pointer'
}));


const AppsHeader = ({ handler, icon, title, label, color, caption, anchor = 'bottom', handleClose }) => {

  const suffix = !handler?.title 
    ? [
    <Typography color="text.primary">{label}</Typography>
  ]  
  : [
    <Hand onClick={() => handler.send('EXIT')}>
      {label}
    </Hand>,
    <Typography color="text.primary">{handler?.title }</Typography>,
  ]

  const breadcrumbs = [
    <Hand onClick={handleClose}>
      Apps
    </Hand>,

    ...suffix
  ];

  return (
    <Flex
      spacing={1}
      sx={{
        p: 1,
        height: 56,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: (t) => t.palette.grey[100],
      }}
    >
      <Box sx={{ width: 64, textAlign: 'center' }}>
        <Tooltag
          color={color}
          component={TextIcon}
          title={label}
          caption={caption}
          icon={icon}
        />
      </Box>
      {!!handler && <Breadcrumbs separator="›">{breadcrumbs}</Breadcrumbs>}

      {!handler && <Nowrap>{label}</Nowrap>}

      {/* {!!handler && <> {JSON.stringify(handler.state.value)}</>} */}

      <Spacer />

      {anchor === 'bottom' && <AppsFooter handler={handler} anchor={anchor} />}
 
      <IconButton>
        <TextIcon icon="Close" onClick={handleClose} />
      </IconButton>
    </Flex>
  );
};
AppsHeader.defaultProps = {};
export default AppsHeader;
