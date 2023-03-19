import React from 'react';
import { styled, Stack, Box, IconButton } from '@mui/material';
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
import ReactQuill from 'doc-editor'; // ES6

const Layout = styled(Box)(({ theme, small, tall }) => ({
  margin: theme.spacing(4),
  height: small ? "5vh" : tall ? '60vh' : '25vh',
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
const CustomToolbar = () => (
  <div style={{ display: 'flex' }} id="preview-toolbar">
    <Box>Preview Pane</Box> 
    <IconButton className="ql-handleClose">
      <TextIcon icon="ArrowBack" />
    </IconButton>
    <IconButton className="ql-handleSave">
      <TextIcon icon="Save" />
    </IconButton>
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
  return (
    <Layout
      data-testid="test-for-Reports"
      small={handler.busy}
      tall={handler.state.matches('editing')}
    >
      {/* {JSON.stringify(handler.state.value)} */}
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
            {!!handler.item && (
              <Stack sx={{ mb: 3 }}>
                <Flex spacing={1}>
                  <Nowrap muted>Edit Report</Nowrap> 
                </Flex>
                <Nowrap variant="h6">{handler.item.title}</Nowrap> 
              </Stack>
            )}
            {!!handler.item && (
              <Columns sx={{ alignItems: 'flex-start' }}>
                <Box> 

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
                    value={handler.item.templatebody}
                  />
                </Box>

                <Box>
                  
                  <CustomToolbar />

                  {!!samples && (
                    <ReactQuill
                      readOnly
                      modules={previewMods}
                      ref={editorRef}
                      style={{
                        height: `calc(60vh - 120px)`,
                      }}
                      value={samples
                        .map((f) =>
                          reportItem({
                            value: handler.item.templatebody,
                            source: f,
                          })
                        )
                        .join('')}
                    />
                  )}
                </Box>
              </Columns>
            )}
          </Box>
        )}
      </Columns>
    </Layout>
  );
};
Reports.defaultProps = {};
export default Reports;
