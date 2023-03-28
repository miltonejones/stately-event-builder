import React from 'react';
import { styled, Box } from '@mui/material';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));
const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`;
const Markdown = () => {
 return (
   <Layout data-testid="test-for-Markdown">
  <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
   </Layout>
 );
}
Markdown.defaultProps = {};
export default Markdown;
