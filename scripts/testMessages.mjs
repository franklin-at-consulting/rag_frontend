import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  AssistantRuntimeProvider,
  ThreadPrimitive,
  MessagePrimitive,
} from '@assistant-ui/react';

const { Root: ThreadRoot, Viewport, Messages } = ThreadPrimitive;
const { Root: MessageRoot, Content: MessageContent } = MessagePrimitive;

const runtime = {
  messages: [
    {
      id: '1',
      role: 'user',
      content: [{ type: 'text', text: 'Hello world' }],
      createdAt: new Date(),
    },
  ],
  isRunning: false,
  getBranches: () => [],
  switchToBranch: () => {},
  append: async () => {},
  startRun: async () => {},
  cancelRun: () => {},
  addToolResult: () => {},
  subscribe: () => () => {},
  registerModelConfigProvider: () => () => true,
  unstable_synchronizer: undefined,
};

const UserMessage = () =>
  React.createElement(
    MessageRoot,
    null,
    React.createElement(MessageContent, {
      components: {
        Text: ({ part }) => React.createElement('span', null, part.text),
      },
    }),
  );

const AssistantMessage = () =>
  React.createElement(MessageRoot, null, React.createElement(MessageContent, null));

const App = () =>
  React.createElement(
    AssistantRuntimeProvider,
    { runtime },
    React.createElement(
      ThreadRoot,
      null,
      React.createElement(
        Viewport,
        null,
        React.createElement(Messages, {
          components: { UserMessage, AssistantMessage },
        }),
      ),
    ),
  );

try {
  const html = renderToString(React.createElement(App));
  console.log('Rendered HTML:', html);
} catch (error) {
  console.error('Render error:', error);
}
