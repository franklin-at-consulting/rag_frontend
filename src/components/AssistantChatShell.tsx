import React from 'react';
import {
  AssistantRuntimeProvider,
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
} from '@assistant-ui/react';
import { useBackendAssistantRuntime } from '../hooks/useBackendAssistantRuntime';

const { Root: ThreadRoot, Viewport, Messages, Empty } = ThreadPrimitive;
const { Root: MessageRoot, Content: MessageContent, If: MessageIf } = MessagePrimitive;
const {
  Root: ComposerRoot,
  Input: ComposerInput,
  Send: ComposerSend,
} = ComposerPrimitive;

const Message: React.FC = () => (
  <>
    <MessageIf user>
      <MessageRoot className="ml-auto w-fit max-w-2xl rounded-xl bg-blue-600 px-4 py-3 text-sm text-white shadow">
        <MessageContent
          components={{
            Text: ({ part }) => <p>{part.text}</p>,
          }}
        />
      </MessageRoot>
    </MessageIf>
    <MessageIf assistant>
      <MessageRoot className="w-fit max-w-2xl rounded-xl bg-white px-4 py-3 text-sm text-gray-800 shadow">
        <MessageContent />
      </MessageRoot>
    </MessageIf>
  </>
);

const MessagesList: React.FC = () => (
  <Viewport className="flex-1 space-y-6 overflow-y-auto pr-4">
    <Empty>
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
        Start the conversation by sending a question.
      </div>
    </Empty>
    <Messages components={{ Message }} />
  </Viewport>
);

const Composer: React.FC = () => (
  <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
    <ComposerRoot className="flex items-end gap-2">
      <ComposerInput
        placeholder="Ask about your documents..."
        className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent text-sm leading-5 text-gray-900 focus:outline-none"
      />
      <ComposerSend className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
        Send
      </ComposerSend>
    </ComposerRoot>
  </div>
);

const AssistantChatShell: React.FC = () => {
  const runtime = useBackendAssistantRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadRoot className="flex h-full flex-col">
        <MessagesList />
        <Composer />
      </ThreadRoot>
    </AssistantRuntimeProvider>
  );
};

export default AssistantChatShell;
