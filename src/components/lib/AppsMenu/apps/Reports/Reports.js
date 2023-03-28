import React from 'react';
import { styled, Stack, Box, TextField, Switch, IconButton } from '@mui/material';
import {
  Flex,
  Nowrap,
  Btn,
  reportItem,
  Spacer,
  TinyButton,
  TextIcon,
  Columns,
} from '../../../../../styled';
import { Unsaved } from '../../../..';
// import Markdown from '../../components/Markdown/Markdown';
import ReactQuill from 'doc-editor'; // ES6
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Layout = styled(Box)(({ theme, taller, small, tall }) => ({
  margin: theme.spacing(1),
  height: taller ? "75vh" :  small ? "5vh" : tall ? '60vh' : '25vh',
  transition: 'height  0.3s ease-in'
}));

const EditToolbar = () =>  {
  const decor = { 

    bold: "FormatBold", 
    italic: "FormatItalic", 
    underline: "FormatUnderlined" ,
  
  }

  const options = [
    "align",
    "color",
    "background",
  ]
  return (

  <div style={{ display: 'flex' }} id="editor-toolbar">
  <Box>Edit Pane</Box> 
  <select class="ql-size">
    <option value="small"></option> 
    <option selected></option>
    <option value="large"></option>
    <option value="huge"></option>
  </select>
  {Object.keys(decor).map(btn => <button key={btn} className={`ql-${btn}`} >
      <TextIcon icon={decor[btn]} />
  </button>)}
 
  {options.map(btn => <select key={btn} className={`ql-${btn}`} />)}
 
</div>
  )

}
//
const CustomToolbar = ({ working, title }) => (
  <div style={{ display: 'flex' }} id="preview-toolbar">
    <Box>{working ? title : "Preview Pane"}</Box> 
 

   {!working && <>
   <IconButton className="ql-handleEdit">
      <TextIcon icon="Edit" />
    </IconButton>
      <IconButton className="ql-handleClose">
        <TextIcon icon="ArrowBack" />
      </IconButton>
      <IconButton className="ql-handleSave">
        <TextIcon icon="Save" />
      </IconButton>
    </>}
 
    <IconButton className="ql-handlePrint">
      <TextIcon icon="Print" />
    </IconButton>
  </div>
);
 
const Reports = ({ handler, samples }) => {
  const editorRef = React.useRef(null);
  const writerRef = React.useRef(null);

  const handlePrint = () => {
    const content = editorRef.current.getEditor().root.innerHTML;
    const printWindow = window.open('', 'Print', 'height=600,width=800');
    printWindow.document.write(
      `<html><head><title>Print</title></head><body>${content}</body></html>`
    );
    printWindow.document.close();
    printWindow.print();
  };
  const previewMods = {
    toolbar: {
      container: '#preview-toolbar',
      handlers: {
        handlePrint: handlePrint,
        handleClose: () => handler.send('EXIT'),
        handleSave: () => handler.send('UPDATE'),
        handleEdit: () => handler.send('WRITE'),
      },
    },
  };

  const editMods = {
    toolbar: {
      container: '#editor-toolbar',
      handlers: { 
      },
    },
  };

  let selectedReport = handler.item;
  const working = handler.is('editing.work');

  if (working) {
    const it = handler.items.find(n => n.ID === handler.ID)

    if (it) {
      selectedReport = it;
    }

  }

  return (
    <Layout
      data-testid="test-for-Reports"
      small={handler.busy}
      tall={handler.state.matches('editing')}
      taller={working}
    >
      {/* {JSON.stringify(handler.state.value)} */}
      {/* <Markdown /> */}
      <Columns
        sx={{ alignItems: 'flex-start' }}
        columns={handler.state.matches('editing') ? '1fr' : '1fr 0'}
      >
        {handler.state.matches('deleting') && (
          <Stack>
            <Nowrap>Are you sure you want to delete this item?</Nowrap>
            <Flex>
              <Spacer />
              <Btn onClick={() => handler.send('NO')}>Cancel</Btn>
              <Btn
                variant="contained"
                color="error"
                onClick={() => handler.send('YES')}
              >
                Delete
              </Btn>
            </Flex>
          </Stack>
        )}
        {handler.state.matches('confirm_close') && (
          <Unsaved handler={handler} save="UPDATE" />
        )}

        {['idle'].some(handler.state.matches) && (
          <Box>
            {handler.items.map((item) => (
              <Flex>
                <TinyButton
                  onClick={() => handler.send('DROP')}
                  icon="Delete"
                />
                <Nowrap
                  hover
                  onClick={() => {
                    handler.send({
                      type: 'EDIT',
                      ID: item.ID,
                      title: item.title
                    });
                  }}
                >
                  {item.title}
                </Nowrap>
              </Flex>
            ))}
          </Box>
        )}

        {handler.state.matches('editing') && (
          <Box>
            {!!selectedReport && !working && (
              <Stack sx={{ mb: 3 }}>
                <Flex spacing={1}>
                  <Nowrap muted>Edit Report</Nowrap> 
                </Flex>
                <Nowrap variant="h6">{selectedReport.title}</Nowrap> 
                <Flex 
                  spacing={1}
                  onClick={() => { 
                    handler.send({
                      type: 'CHANGE',
                      key: 'wiki',
                      value: !selectedReport.wiki,
                    })
                  }}
                      >
                  <Switch checked={selectedReport.wiki} />
                  <Nowrap small muted>Use wiki markup</Nowrap>
                </Flex>
              </Stack>
            )}
            {!!selectedReport && (
              <Columns columns={working ? "0 1fr" : "50% 50%"} sx={{ alignItems: 'flex-start' }}>

                {/* edit pane */}

                {!!selectedReport.wiki && <Box>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    rows={12}
                    value={selectedReport.templatebody}
                    onChange={(e) => { 

                      handler.send({
                        type: 'CHANGE',
                        key: 'templatebody',
                        value: e.target.value,
                      });
                    }} 
                    />
                  </Box>}


                {!selectedReport.wiki && <Box sx={{ overflow: 'hidden'}}> 

                  <EditToolbar />


                  <ReactQuill
                    ref={writerRef}
                    modules={editMods} 
                    style={{
                      height: `calc(60vh - 120px)`,
                    }}
                    onBlur={() => {
                      const editor = writerRef.current.getEditor();
                      const content = editor.root.innerHTML;

                      handler.send({
                        type: 'CHANGE',
                        key: 'templatebody',
                        value: content,
                      });
                    }} 
                    value={selectedReport.templatebody}
                  />
                </Box>
}
                {!!selectedReport?.wiki && <Box>

                  {samples.map((f) => (<ReactMarkdown children={reportItem({
                          value: selectedReport.templatebody,
                          source: f,
                        })} remarkPlugins={[remarkGfm]} />) 
                        ) }
                  
                  </Box>}

                {/* view pane */}
               { !selectedReport?.wiki && <Box>
                  
                  <CustomToolbar working={working} title={selectedReport.title} />

                  {!!samples && (
                    <ReactQuill
                      readOnly
                      modules={previewMods}
                      ref={editorRef}
                      style={{
                        height: `calc(${working ? "75vh" : "60vh"} - ${working ? "40px" : "120px"})`,
                      }}
                      value={samples
                        .map((f) =>
                          reportItem({
                            value: selectedReport.templatebody,
                            source: f,
                          })
                        )
                        .join('')}
                    />
                  )}
                </Box>}


              </Columns>
            )}
          </Box>
        )}
      </Columns>
      {/* <pre>
        {JSON.stringify(handler.item?.templatebody,0,2)}
      </pre> */}
    </Layout>
  );
};
Reports.defaultProps = {};
export default Reports;
