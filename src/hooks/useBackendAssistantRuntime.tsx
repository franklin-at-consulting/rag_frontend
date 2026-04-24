import { useMemo } from 'react';
import {
  useLocalRuntime,
  type AssistantContentPart,
  type ChatModelAdapter,
  type ThreadMessage,
} from '@assistant-ui/react';
import { apiUrl } from '../config';
import DocumentsPanel, { type RetrievedDocument } from '../components/DocumentsPanel';
import AssistantResponse from '../components/AssistantResponse';

type QueryResponse = {
  response: string;
  sources?: RetrievedDocument[];
};

const extractLatestUserText = (messages: ThreadMessage[]): string | null => {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === 'user') {
      const textPart = message.content.find((part) => part.type === 'text');
      if (textPart && 'text' in textPart) {
        return textPart.text;
      }
    }
  }
  return null;
};

async function queryBackend(question: string, abortSignal?: AbortSignal): Promise<QueryResponse> {
  const response = await fetch(apiUrl('/query'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query_text: question }),
    signal: abortSignal,
  });

  if (!response.ok) {
    throw new Error(`Query request failed with status ${response.status}`);
  }

  return (await response.json()) as QueryResponse;
}

const buildAssistantContent = (
  answer: string,
  documents: RetrievedDocument[] | undefined,
): AssistantContentPart[] => {
  const content: AssistantContentPart[] = [
    {
      type: 'ui',
      display: <AssistantResponse html={answer} />,
    },
  ];

  if (documents && documents.length > 0) {
    content.push({
      type: 'ui',
      display: <DocumentsPanel documents={documents} />,
    });
  }

  return content;
};

export const useBackendAssistantRuntime = () => {
  const adapter = useMemo<ChatModelAdapter>(() => ({
    async run({ messages, abortSignal, onUpdate }) {
      const question = extractLatestUserText(messages);
      if (!question) {
        return { content: [] };
      }

      const { response, sources } = await queryBackend(question, abortSignal);
      const content = buildAssistantContent(response, sources);

      onUpdate({ content });
      return { content };
    },
  }), []);

  return useLocalRuntime(adapter);
};
