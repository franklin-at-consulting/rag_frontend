import React from 'react';

type AssistantResponseProps = {
  html: string;
};

const AssistantResponse: React.FC<AssistantResponseProps> = ({ html }) => (
  <div
    className="prose prose-indigo max-w-none text-sm text-gray-800"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export default AssistantResponse;
