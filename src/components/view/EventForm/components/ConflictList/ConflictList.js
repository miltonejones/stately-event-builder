import React from 'react';
import { styled, Stack, Card, Collapse } from '@mui/material';
import { Flex, Check, 
  // ConfirmPop, 
  GridFormHeader, TinyButton, Spacer,
  Nowrap } from "../../../../../styled";
  import { timeToTime } from '../../../../../util/timeToTime';
  // import moment from 'moment';
 
const Layout = styled(Card)(({ theme }) => ({
  border: "solid 1px " + theme.palette.divider,
  padding: theme.spacing(3, 2, 2, 2)
}));
 
const ConflictList = ({ handler  }) => { 
 return (
  <Collapse in={!!handler.conflicts?.length}>
     <Layout data-testid="test-for-ConflictList">

      <GridFormHeader 
        title="Conflicts"
        icon="Error"
        error
        sx={{ mb: 2 }}
      >
    

      {/* <TinyButton 
        icon={ "KeyboardArrowDown"}  
          /> */}
    </GridFormHeader>

    {!!handler.conflicts && <Stack sx={{ p: t => t.spacing(0) }} spacing={1}>
        {handler.conflicts.map(cat => (
         <Flex spacing={1} sx={{ alignItems: 'flex-start' }}>
           <Check on /> 
           <Stack>
            <Flex spacing={1} key={cat.ID}>
              <Nowrap small bold={!!cat.RecurseEndDate} width="15vw" hover>{cat.EventName}</Nowrap>
              <Spacer />
              <TinyButton icon="MoreVert" />
            </Flex>
            <Nowrap muted small>{cat.RoomNames}</Nowrap> 
            <Nowrap muted small>{cat.CustomDate}</Nowrap> 
            <Nowrap muted small>{timeToTime(cat.EventStartTime)} - {timeToTime(cat.EventEndTime)}</Nowrap> 
          </Stack>
         </Flex>
        ))} 
        </Stack>}

     {/* {JSON.stringify(handler.conflicts)} */}
   </Layout>
  </Collapse>

 );
}
ConflictList.defaultProps = {};
export default ConflictList;
