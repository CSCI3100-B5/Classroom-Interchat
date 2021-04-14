import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import math from 'remark-math';
import 'katex/dist/katex.min.css'; // eslint-disable-line import/no-extraneous-dependencies
import { InlineMath, BlockMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';


const renderers = {
  code: ({ language, value }) => <SyntaxHighlighter language={language}>{value}</SyntaxHighlighter>,
  inlineMath: ({ value }) => <InlineMath math={value} />,
  math: ({ value }) => <BlockMath math={value} />
};

export default function MarkdownRender({ children }) {
  return (
    <ReactMarkdown renderers={renderers} plugins={[gfm, math]}>
      {children}
    </ReactMarkdown>
  );
}
