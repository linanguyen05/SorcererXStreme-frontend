import React from 'react';
import ReactMarkdown from 'react-markdown';

interface FormattedContentProps {
  content: string;
  className?: string;
}

export const FormattedContent = ({ content, className = '' }: FormattedContentProps) => {
  if (!content) return null;

  return (
    <div className={`
      /* Cấu hình Typography cho Dark Mode */
      prose prose-invert 
      max-w-none 
      
      /* Định dạng đoạn văn */
      prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
      
      /* Định dạng Tiêu đề (Gradient màu tím hồng) */
      prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-purple-200 prose-headings:via-pink-200 prose-headings:to-white
      prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6
      
      /* Định dạng in đậm (Màu vàng nổi bật) */
      prose-strong:text-yellow-400 prose-strong:font-bold
      
      /* Định dạng danh sách */
      prose-ul:list-disc prose-ul:pl-5 prose-ul:text-gray-300 prose-ul:mb-4
      prose-ol:list-decimal prose-ol:pl-5 prose-ol:text-gray-300 prose-ol:mb-4
      prose-li:mb-2
      
      /* Định dạng trích dẫn */
      prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-purple-200
      
      /* Định dạng code */
      prose-code:bg-white/10 prose-code:rounded prose-code:px-1 prose-code:text-purple-300
      
      ${className}
    `}>
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
};