import React from 'react';
import Daytimer from './components/Daytimer/Daytimer';
import EventPopover from './components/EventPopover/EventPopover';

import {
  styled,
  Avatar,
  Stack,
  Switch,
  Pagination,
  TablePagination, 
  Card,
  Box,
  Collapse,
  Typography,
} from '@mui/material';

import { 
  CalendarInput,
  DateBox,
  ActionsMenu,
} from '../..';

import {
  Nowrap,
  Btn, 
  TextIcon,
  TinyButton,
  Columns,
  Spacer,
  Pill,
  Flex,
  Banner,
  Section,
  TinyButtonGroup,
  // Demotip
} from '../../../styled';

import { VIEW, useEventPop } from '../../../machines';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const LineItem = styled(Stack)(({ theme, collapsed, spacing = 1 }) => ({
  alignItems: collapsed ? 'flex-start' : 'center',
  gap: collapsed ? 0 : theme.spacing(spacing),
}));

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
}));

const CollapsiblePagination = ({ pages, page, collapsed, onChange }) => {
  if (collapsed) {
    return (
      <TablePagination
        count={Number(pages.itemCount)}
        page={page - 1}
        rowsPerPage={pages.pageSize}
        rowsPerPageOptions={[]}
        onPageChange={(a, num) => onChange(num)}
      />
    );
  }
  return (
    <Pagination
      count={Number(pages.pageCount)}
      page={page}
      onChange={(a, num) => onChange(num)}
    />
  );
};

const EventList = ({ handler, collapsed, search, appslist, reports }) => {
  const navigate = useNavigate();
  const { eventList: handlerList, state } = handler;
  const eventList = search?.options?.length ? search.options : handlerList;
  const eventPages = search.pages?.visible
    ? search.pages
    : { visible: handlerList };

  const { props } = state.context;

  const popMenu = useEventPop(() => {
    handler.send({
      type: 'FIND',
      params: handler.params,
    });
  });

  const opened =
    Boolean(handler.view & VIEW.LIST_SIDEBAR) && handler.props.format === 1;
    
  const expandedCols = opened ? '275px 1fr' : '0 1fr';

  const width = collapsed
    ? 'var(--sidebar-width)'
    : `calc(100vw - ${opened ? 432 : 132}px)`;

  const direction = collapsed ? 'column' : 'row';

  const handleChange = (event, value) => {
    handler.setProp('format', value);
  };

  const control = {
    value: handler.props.format,
    values: [1, 2],
    onChange: handleChange,
    exclusive: true,
  };

  const { excluded = [], editmode } = handler.props;
  const exclude = (ID) => {
    handler.setProp(
      'excluded',
      excluded.indexOf(ID) > -1
        ? excluded.filter((f) => f !== ID)
        : excluded.concat(ID)
    );
  };

  const lineHeight = collapsed ? 1.1 : 1.3;
  return (
    <Layout data-testid="test-for-EventList">
      <EventPopover menu={popMenu} />
      <Collapse in={!!props.showJSON}>
        <pre>{JSON.stringify(eventList, 0, 2)}</pre>
      </Collapse>

      <Collapse in={!props.showJSON}>
        {!!eventList && (
          <Columns
            spacing={opened ? 4 : 0}
            sx={{ alignItems: 'flex-start' }}
            columns={collapsed ? '300px' : expandedCols}
          >
            {!collapsed && (
              <Box sx={{ width: '100%', pt: 1 }}>
                {/* <TinyButton icon={!opened ? "KeyboardArrowLeft" : "Close"} deg={opened?0:180} onClick={() => {
                  handler.send({
                    type: 'VIEW',
                    bit: VIEW.LIST_SIDEBAR
                  })
                }} /> */}

                <CalendarInput
                  hidden={!opened}
                  onClose={() => {
                    handler.send({
                      type: 'VIEW',
                      bit: VIEW.LIST_SIDEBAR,
                    });
                  }}
                  handler={handler}
                />
              </Box>
            )}

            <Box>
              <Card elevation={3} sx={{ m: 1, width, ml: collapsed ? 0 : 3 }}>
                {/* event list header  */}
                <Banner
                  sx={{
                    width,
                  }}
                >
                  {!collapsed && (
                    <ActionsMenu
                      handler={handler}
                      appslist={appslist}
                      reports={reports}
                    />
                  )}

                  <Typography color="inherit">
                    {search.label || handler.label}
                  </Typography>

                  <Spacer />

                  {!collapsed && (
                    <TinyButtonGroup
                      sx={{ mr: 1 }}
                      buttons={['FormatListBulleted', 'CalendarMonth']}
                      {...control}
                    />
                  )}

                  {!collapsed && (
                    <Btn
                      size="small"
                      variant="contained"
                      color="warning"
                      endIcon={<TextIcon icon="Add" />}
                    >
                      Create Event
                    </Btn>
                  )}

                  {!!collapsed && (
                    <TinyButton
                      color="inherit"
                      icon="Close"
                      onClick={() => {
                        handler.send({
                          type: 'VIEW',
                          bit: VIEW.FORM_SIDEBAR,
                        });
                      }}
                    />
                  )}
                </Banner>

                <Section sx={{ width }}>
                  {eventPages.pageCount > 1 && (
                    <Flex>
                      <Box sx={{ m: 2 }}>
                        <CollapsiblePagination
                          collapsed={collapsed}
                          pages={eventPages}
                          page={search.page}
                          onChange={(num) =>
                            search.send({
                              type: 'PAGE',
                              page: num,
                            })
                          }
                        />
                      </Box>

                      {!collapsed && (
                        <>
                          {' '}
                          {eventPages.startNum} to {eventPages.lastNum} of{' '}
                          {eventPages.itemCount} events{' '}
                        </>
                      )}

                      <Spacer />
                    </Flex>
                  )}

                  {handler.props.format === 2 && !search.options?.length && (
                    <Daytimer popMenu={popMenu} handler={handler} />
                  )}

                  {(handler.props.format === 1 || !!search.options?.length) &&
                    eventPages.visible?.map((ev) => (
                      // event line items
                      <Flex>
                        {!handler.props.excludedProps?.FullName && !collapsed && (
                          <>
                            <Creator
                              onClick={(e) => {
                                popMenu.handleClick(e, ev.ID, ev.CustomDate);
                              }}
                              event={ev}
                              users={handler.users}
                            />
                          </>
                        )}
                        <Stack
                          sx={{
                            p: (t) => t.spacing(1, 2),
                            borderBottom: 1,
                            borderColor: 'divider',
                            width,
                          }}
                        >
                          {/* top line  */}
                          <LineItem direction={direction} collapsed={collapsed}>
                            {/* popup menu */}
                            {!!handler.props.excludedProps?.FullName &&
                              !collapsed && (
                                <TinyButton
                                  icon="MoreVert"
                                  onClick={(e) => {
                                    popMenu.handleClick(
                                      e,
                                      ev.ID,
                                      ev.CustomDate
                                    );
                                  }}
                                />
                              )}

                            {/* select checkbox displayed in SELECT mode */}
                            {!!editmode && (
                              <Switch
                                onClick={() => exclude(ev.ID)}
                                checked={
                                  !excluded || excluded.indexOf(ev.ID) < 0
                                }
                                size="small"
                              />
                            )}

                            {/* event category list */}
                            {!!ev.categories?.length &&
                              !handler.props.excludedProps?.categories && (
                                <Flex
                                  sx={{ mb: collapsed ? 0.5 : 0 }}
                                  spacing={1}
                                >
                                  {ev.categories?.map((c) => (
                                    <Pill color={c.color}>{c.title}</Pill>
                                  ))}
                                </Flex>
                              )}

                            {/* EVENT NAME */}
                            <Nowrap
                              width={collapsed ? '15vw' : 'fit-content'}
                              onClick={() => {
                                if (editmode) {
                                  return exclude(ev.ID);
                                }
                                navigate(`/edit/${ev.ID}`);
                              }}
                              hover
                              muted={excluded?.indexOf(ev.ID) > -1 && editmode}
                              selected={
                                Number(ev.ID) === Number(handler.ID) ? 1 : 0
                              }
                              bold={!!ev.RecurseEndDate}
                              sx={{ lineHeight }}
                            >
                              {ev.EventName}
                            </Nowrap>

                            {/* room names  */}
                            {!handler.props.excludedProps?.RoomNames && (
                              <Nowrap
                                variant="caption"
                                muted
                                
                                sx={{ lineHeight, maxWidth: '30vh' }}
                              >
                                {ev.RoomNames}
                              </Nowrap>
                            )}

                            <Spacer />

                            {/* event dates */}
                            {!handler.props.excludedProps?.dates && (
                              <DateBox collapsed={collapsed} event={ev} />
                            )}
                          </LineItem>

                          {/* bottom line */}
                          <LineItem direction={direction} collapsed={collapsed}>
                            {/* event comments */}
                            {!collapsed &&
                              !handler.props.excludedProps?.Comments && (
                                <Nowrap
                                  sx={{ 
                                    maxWidth: '50vw', 
                                    lineHeight, 
                                    pl: !!handler.props.excludedProps?.FullName ? 3.25 : 0 
                                  }}
                                  small
                                >
                                  {ev.Comments}
                                </Nowrap>
                              )} 
                            <Spacer />

                            {/* event custom (current) date shown when multiple dates 
                          searched for */}
                            {/* FIXME: this only shows in search results  */}
                            {!!search.options?.length && (
                              <Nowrap small bold sx={{ mr: 1, lineHeight }}>
                                {moment(ev.CustomDate).format('MMM Do YY')}
                              </Nowrap>
                            )}

                            {/* event times  */}
                            {!handler.props.excludedProps?.times && (
                              <Typography variant="caption" sx={{ lineHeight }}>
                                {moment(
                                  '2022-08-22T' + ev.EventStartTime
                                ).format('h:mm a')}{' '}
                                to{' '}
                                {moment('2022-08-22T' + ev.EventEndTime).format(
                                  'h:mm a'
                                )}
                              </Typography>
                            )}
                          </LineItem>
                        </Stack>
                      </Flex>
                    ))}
                </Section>
              </Card>
            </Box>
          </Columns>
        )}
      </Collapse>
    </Layout>
  );
};

const Creator = ({ event, users, ...props }) => {
  const user = users?.find((f) => f.ID === event.CreateLogin);
  return (
    <Avatar
      {...props}
      sx={{ ml: 1, cursor: 'pointer' }}
      src={user?.image}
      alt={event.CreateLogin}
    >
      {event.CreateLogin}
    </Avatar>
  );
};
EventList.defaultProps = {};
export default EventList;
