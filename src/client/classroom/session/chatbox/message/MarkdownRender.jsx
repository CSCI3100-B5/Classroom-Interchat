import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import math from 'remark-math';
import 'katex/dist/katex.min.css'; // eslint-disable-line import/no-extraneous-dependencies
import { InlineMath, BlockMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// set up the Markdown renderer with additional plugins
const renderers = {
  code: ({ language, value }) => <SyntaxHighlighter language={language}>{value}</SyntaxHighlighter>,
  inlineMath: ({ value }) => <InlineMath math={value} />,
  math: ({ value }) => <BlockMath math={value} />
};

/**
 * A helper component to render its children as Markdown
 */
export default function MarkdownRender({ children }) {
  return (
    <ReactMarkdown linkTarget="_blank" renderers={renderers} plugins={[gfm, math]}>
      {children}
    </ReactMarkdown>
  );
}
