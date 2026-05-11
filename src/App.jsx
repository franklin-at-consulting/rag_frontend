import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "./components/Header";
import SearchBar from "./components/SearchBar";
import ShowResults from "./components/ShowResults";
import UploadDocument from './components/UploadDocument';
import { apiUrl } from "./config";
import {
  CheckIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const CHAT_HISTORY_KEY = "ragChatMessages";
const CONVERSATIONS_KEY = "ragConversations";
const ACTIVE_CONVERSATION_SESSION_KEY = "ragActiveConversationId";

const createId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const inferConversationTitle = (question) => {
  const trimmedQuestion = question.trim().replace(/\s+/g, " ");
  if (!trimmedQuestion) {
    return "New conversation";
  }

  const words = trimmedQuestion.split(" ").slice(0, 8).join(" ");
  return words.length > 60 ? `${words.slice(0, 57)}...` : words;
};

const createConversation = (messages = []) => {
  const firstQuestion = messages.find((message) => message.role === "user")?.content;
  const now = new Date().toISOString();

  return {
    id: createId(),
    title: firstQuestion ? inferConversationTitle(firstQuestion) : "New conversation",
    messages,
    createdAt: now,
    updatedAt: now,
  };
};

const normalizeConversations = (conversations) => {
  if (!Array.isArray(conversations)) {
    return [];
  }

  return conversations.map((conversation) => ({
    ...conversation,
    messages: Array.isArray(conversation.messages) ? conversation.messages : [],
  }));
};

const getFallbackConversations = () => {
  try {
    const savedConversations = localStorage.getItem(CONVERSATIONS_KEY);
    const parsedConversations = savedConversations ? JSON.parse(savedConversations) : [];

    if (Array.isArray(parsedConversations) && parsedConversations.length > 0) {
      return normalizeConversations(parsedConversations);
    }

    const legacyMessages = sessionStorage.getItem(CHAT_HISTORY_KEY);
    const parsedMessages = legacyMessages ? JSON.parse(legacyMessages) : [];
    if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
      return [createConversation(parsedMessages)];
    }

    return [createConversation()];
  } catch (error) {
    console.error("Error loading fallback conversations:", error);
    return [createConversation()];
  }
};

const serializeConversations = (conversations) => JSON.stringify(conversations);

const selectActiveConversationId = (conversations, preferredId) => {
  if (conversations.some((conversation) => conversation.id === preferredId)) {
    return preferredId;
  }

  return conversations[0]?.id || null;
};

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingConversationId, setLoadingConversationId] = useState(null);
  const [renamingConversationId, setRenamingConversationId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [draftQuestion, setDraftQuestion] = useState("");
  const [syncError, setSyncError] = useState("");
  const [role, setRole] = useState(""); // State to store user role
  const [showUploadPopup, setShowUploadPopup] = useState(false);  
  const latestResponseRef = useRef(null);
  const pendingResponseRef = useRef(null);
  const syncTimeoutRef = useRef(null);
  const lastSyncedPayloadRef = useRef("");
  const currentConversationsRef = useRef([]);
  const navigate = useNavigate();
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];
  const lastMessage = messages[messages.length - 1];
  const isActiveConversationLoading = loadingConversationId === activeConversation?.id;
  
    useEffect(() => {
      const checkSession = async () => {
        try {
          const response = await fetch(apiUrl('/check-session'), {
            method: "GET",
            credentials: "include",
          });
  
          if (response.status === 401) {  // 🔹 Handle session expiration
            alert("Your session has expired. Redirecting to login...");
            sessionStorage.removeItem("isAuthenticated");
            sessionStorage.removeItem("role");
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      };
  
      const interval = setInterval(checkSession, 60000); // 🔹 Check every 60 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }, [navigate]);

  useEffect(() => {
    let isCancelled = false;

    const handleExpiredSession = () => {
      alert("Your session has expired. Redirecting to login...");
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("role");
      navigate("/");
    };

    const loadConversations = async () => {
      try {
        const response = await fetch(apiUrl('/conversations'), {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          handleExpiredSession();
          return;
        }

        if (!response.ok) {
          throw new Error(`Error loading conversations: ${response.status}`);
        }

        const data = await response.json();
        const serverConversations = normalizeConversations(data.conversations);
        const nextConversations = serverConversations.length > 0
          ? serverConversations
          : [createConversation()];

        if (isCancelled) {
          return;
        }

        lastSyncedPayloadRef.current = serializeConversations(nextConversations);
        setConversations(nextConversations);
        setActiveConversationId((currentId) =>
          selectActiveConversationId(
            nextConversations,
            currentId || sessionStorage.getItem(ACTIVE_CONVERSATION_SESSION_KEY)
          )
        );
        setSyncError("");
      } catch (error) {
        console.error("Error loading conversations from server:", error);
        if (isCancelled) {
          return;
        }

        const fallbackConversations = getFallbackConversations();
        lastSyncedPayloadRef.current = serializeConversations(fallbackConversations);
        setConversations(fallbackConversations);
        setActiveConversationId((currentId) =>
          selectActiveConversationId(
            fallbackConversations,
            currentId || sessionStorage.getItem(ACTIVE_CONVERSATION_SESSION_KEY)
          )
        );
        setSyncError("Could not load saved conversations. Using local fallback.");
      } finally {
        if (!isCancelled) {
          setLoadingConversations(false);
        }
      }
    };

    loadConversations();

    return () => {
      isCancelled = true;
    };
  }, [navigate]);

  const toggleUploadPopup = () => {
    setShowUploadPopup(!showUploadPopup);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    // Retrieve user role from session storage
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    if (lastMessage?.role === "assistant") {
      latestResponseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [lastMessage?.id, lastMessage?.role]);

  useEffect(() => {
    currentConversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    if (isActiveConversationLoading) {
      pendingResponseRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isActiveConversationLoading]);

  useEffect(() => {
    if (loadingConversations || conversations.length === 0) {
      return;
    }

    const payload = serializeConversations(conversations);
    if (payload === lastSyncedPayloadRef.current) {
      return;
    }
    const requestPayload = payload;

    window.clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = window.setTimeout(async () => {
      try {
        const response = await fetch(apiUrl('/conversations'), {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ conversations }),
        });

        if (response.status === 401) {
          alert("Your session has expired. Redirecting to login...");
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("role");
          navigate("/");
          return;
        }

        if (!response.ok) {
          throw new Error(`Error saving conversations: ${response.status}`);
        }

        const data = await response.json();
        const serverConversations = normalizeConversations(data.conversations);
        const currentPayload = serializeConversations(currentConversationsRef.current);
        const hasNewerLocalChanges = currentPayload !== requestPayload;

        if (hasNewerLocalChanges) {
          lastSyncedPayloadRef.current = requestPayload;
          setSyncError("");
          return;
        }

        const nextConversations = serverConversations.length > 0 ? serverConversations : currentConversationsRef.current;
        lastSyncedPayloadRef.current = serializeConversations(nextConversations);
        setConversations(nextConversations);
        setActiveConversationId((currentId) => selectActiveConversationId(nextConversations, currentId));
        setSyncError("");
      } catch (error) {
        console.error("Error saving conversations:", error);
        localStorage.setItem(CONVERSATIONS_KEY, payload);
        setSyncError("Could not save conversations. Changes are kept locally and will retry on the next edit.");
      }
    }, 800);

    return () => window.clearTimeout(syncTimeoutRef.current);
  }, [conversations, loadingConversations, navigate]);

  useEffect(() => {
    if (activeConversation?.id) {
      sessionStorage.setItem(ACTIVE_CONVERSATION_SESSION_KEY, activeConversation.id);
    }
  }, [activeConversation?.id]);

  const updateConversationMessages = (conversationId, updateMessages) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const nextMessages = updateMessages(conversation.messages);
        const firstQuestion = nextMessages.find((message) => message.role === "user")?.content;
        const shouldInferTitle = conversation.title === "New conversation" && firstQuestion;

        return {
          ...conversation,
          title: shouldInferTitle ? inferConversationTitle(firstQuestion) : conversation.title,
          messages: nextMessages,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleNewConversation = () => {
    const nextConversation = createConversation();
    setConversations((currentConversations) => [nextConversation, ...currentConversations]);
    setActiveConversationId(nextConversation.id);
    setRenamingConversationId(null);
    setDraftTitle("");
  };

  const startRenamingConversation = (conversation) => {
    setRenamingConversationId(conversation.id);
    setDraftTitle(conversation.title);
  };

  const saveConversationTitle = (conversationId) => {
    const nextTitle = draftTitle.trim() || "New conversation";
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, title: nextTitle, updatedAt: new Date().toISOString() }
          : conversation
      )
    );
    setRenamingConversationId(null);
    setDraftTitle("");
  };

  const deleteQuestionAndResponse = (conversationId, questionId) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const questionIndex = conversation.messages.findIndex(
          (message) => message.id === questionId && message.role === "user"
        );

        if (questionIndex === -1) {
          return conversation;
        }

        const deletedQuestion = conversation.messages[questionIndex];
        const shouldRemoveResponse = conversation.messages[questionIndex + 1]?.role === "assistant";
        const nextMessages = conversation.messages.filter((_, index) => {
          if (index === questionIndex) {
            return false;
          }

          return !(shouldRemoveResponse && index === questionIndex + 1);
        });
        const deletedQuestionTitle = inferConversationTitle(deletedQuestion.content);
        const nextFirstQuestion = nextMessages.find((message) => message.role === "user")?.content;
        const nextTitle = conversation.title === deletedQuestionTitle
          ? nextFirstQuestion
            ? inferConversationTitle(nextFirstQuestion)
            : "New conversation"
          : conversation.title;

        return {
          ...conversation,
          title: nextTitle,
          messages: nextMessages,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const startEditingQuestion = (message) => {
    setEditingQuestionId(message.id);
    setDraftQuestion(message.content);
  };

  const cancelEditingQuestion = () => {
    setEditingQuestionId(null);
    setDraftQuestion("");
  };

  const replaceQuestionAndClearResponse = (conversationId, questionId, nextQuestion) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const questionIndex = conversation.messages.findIndex(
          (message) => message.id === questionId && message.role === "user"
        );

        if (questionIndex === -1) {
          return conversation;
        }

        const currentQuestion = conversation.messages[questionIndex];
        const shouldRemoveResponse = conversation.messages[questionIndex + 1]?.role === "assistant";
        const nextMessages = conversation.messages.flatMap((message, index) => {
          if (index === questionIndex) {
            return [{ ...message, content: nextQuestion }];
          }

          if (shouldRemoveResponse && index === questionIndex + 1) {
            return [];
          }

          return [message];
        });
        const currentQuestionTitle = inferConversationTitle(currentQuestion.content);
        const nextTitle = conversation.title === currentQuestionTitle
          ? inferConversationTitle(nextQuestion)
          : conversation.title;

        return {
          ...conversation,
          title: nextTitle,
          messages: nextMessages,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const insertResponseAfterQuestion = (conversationId, questionId, responseMessage) => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const questionIndex = conversation.messages.findIndex(
          (message) => message.id === questionId && message.role === "user"
        );

        if (questionIndex === -1) {
          return conversation;
        }

        const nextMessages = [
          ...conversation.messages.slice(0, questionIndex + 1),
          responseMessage,
          ...conversation.messages.slice(questionIndex + 1),
        ];

        return {
          ...conversation,
          messages: nextMessages,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const saveEditedQuestion = async (conversationId, questionId) => {
    const nextQuestion = draftQuestion.trim();
    if (!nextQuestion || loadingConversationId) {
      return;
    }

    replaceQuestionAndClearResponse(conversationId, questionId, nextQuestion);
    setEditingQuestionId(null);
    setDraftQuestion("");
    setLoadingConversationId(conversationId);

    try {
      const response = await fetch(apiUrl('/query'), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query_text: nextQuestion }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }

      const data = await response.json();
      insertResponseAfterQuestion(conversationId, questionId, {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.response,
        sources: data.sources || [],
      });
    } catch (err) {
      insertResponseAfterQuestion(conversationId, questionId, {
        id: `${Date.now()}-assistant-error`,
        role: "assistant",
        content: `Can't Obtain The Information: ${err.message}`,
        sources: [],
        isError: true,
      });
    } finally {
      setLoadingConversationId(null);
    }
  };

  const handleSearch = async (searchTerm) => {
    const conversationId = activeConversation?.id;
    if (!conversationId) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: searchTerm,
    };

    updateConversationMessages(conversationId, (currentMessages) => [...currentMessages, userMessage]);
    setLoadingConversationId(conversationId);

    try {
      const response = await fetch(apiUrl('/query'), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query_text: searchTerm }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.response,
        sources: data.sources || [],
      };
      updateConversationMessages(conversationId, (currentMessages) => [...currentMessages, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        id: `${Date.now()}-assistant-error`,
        role: "assistant",
        content: `Can't Obtain The Information: ${err.message}`,
        sources: [],
        isError: true,
      };
      updateConversationMessages(conversationId, (currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      setLoadingConversationId(null);
    }
  };

  return (
    <div className="app flex flex-col h-screen overflow-hidden transition-colors duration-200">
      <Header role={role} />

      {/* Main content container */}
      <div className="flex flex-grow w-full space-x-4 rounded-xl mb-4 pb-1 overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-50 p-4 rounded-xl shadow-md flex flex-col overflow-hidden dark:bg-slate-800 dark:shadow-slate-950/30">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-lg text-gray-900 dark:text-slate-100">Conversations</h2>
            <button
              onClick={handleNewConversation}
              disabled={loadingConversations}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              type="button"
              aria-label="Start new conversation"
              title="Start new conversation"
            >
              <PlusCircleIcon className="h-5 w-5" />
            </button>
          </div>
          <hr className="border-t-2 border-gray-300 mb-4 dark:border-slate-700" />
          <div className="flex-grow space-y-2 overflow-y-auto pr-1">
            {loadingConversations ? (
              <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                Loading conversations...
              </div>
            ) : conversations.map((conversation) => {
              const isActive = conversation.id === activeConversation?.id;
              const isRenaming = conversation.id === renamingConversationId;

              return (
                <div
                  key={conversation.id}
                  className={`rounded-lg border p-2 ${
                    isActive
                      ? "border-blue-300 bg-blue-50 dark:border-blue-500/70 dark:bg-blue-950/40"
                      : "border-gray-200 bg-white hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-700"
                  }`}
                >
                  {isRenaming ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            saveConversationTitle(conversation.id);
                          }
                          if (event.key === "Escape") {
                            setRenamingConversationId(null);
                            setDraftTitle("");
                          }
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => saveConversationTitle(conversation.id)}
                        className="rounded p-1 text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/40"
                        type="button"
                        aria-label="Save conversation title"
                        title="Save conversation title"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setRenamingConversationId(null);
                          setDraftTitle("");
                        }}
                        className="rounded p-1 text-gray-500 hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-700"
                        type="button"
                        aria-label="Cancel rename"
                        title="Cancel rename"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => setActiveConversationId(conversation.id)}
                        className="min-w-0 flex-1 text-left"
                        type="button"
                      >
                        <div className="truncate text-sm font-medium text-gray-800 dark:text-slate-100">
                          {conversation.title}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                          {conversation.messages.length} messages
                        </div>
                      </button>
                      <button
                        onClick={() => startRenamingConversation(conversation)}
                        className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                        type="button"
                        aria-label="Rename conversation"
                        title="Rename conversation"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex-1 p-4 bg-gray-50 rounded-xl shadow-md flex flex-col overflow-hidden dark:bg-slate-800 dark:shadow-slate-950/30">
          {/* Chat thread */}
          <div
            id="results-container"
            className="flex-grow overflow-y-auto pr-2"
          >
            {loadingConversations ? (
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-slate-400">
                Loading conversations...
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    ref={message.id === lastMessage?.id && message.role === "assistant" ? latestResponseRef : null}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "user" ? (
                      <div className="max-w-3xl rounded-2xl rounded-br-sm bg-blue-600 px-4 py-3 text-white shadow-md">
                        <div className="mb-1 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wide text-blue-100">
                          <span>You</span>
                          <div className="flex items-center gap-1">
                            {editingQuestionId === message.id ? (
                              <>
                                <button
                                  onClick={() => saveEditedQuestion(activeConversation.id, message.id)}
                                  disabled={!draftQuestion.trim() || isActiveConversationLoading}
                                  className="rounded p-1 text-blue-100 transition hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                  type="button"
                                  aria-label="Save edited question"
                                  title="Save edited question"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={cancelEditingQuestion}
                                  disabled={isActiveConversationLoading}
                                  className="rounded p-1 text-blue-100 transition hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                  type="button"
                                  aria-label="Cancel editing question"
                                  title="Cancel editing question"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditingQuestion(message)}
                                  disabled={isActiveConversationLoading}
                                  className="rounded p-1 text-blue-100 transition hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                  type="button"
                                  aria-label="Edit question"
                                  title="Edit question"
                                >
                                  <PencilSquareIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteQuestionAndResponse(activeConversation.id, message.id)}
                                  disabled={isActiveConversationLoading}
                                  className="rounded p-1 text-blue-100 transition hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                  type="button"
                                  aria-label="Delete question and response"
                                  title="Delete question and response"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {editingQuestionId === message.id ? (
                          <textarea
                            value={draftQuestion}
                            onChange={(event) => setDraftQuestion(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Escape") {
                                cancelEditingQuestion();
                              }
                              if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                                saveEditedQuestion(activeConversation.id, message.id);
                              }
                            }}
                            className="mt-2 min-h-24 w-full resize-y rounded-lg border border-blue-400 bg-blue-700/40 p-2 text-sm leading-6 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/70"
                            autoFocus
                          />
                        ) : (
                          <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                        )}
                      </div>
                    ) : (
                      <ShowResults data={message} />
                    )}
                  </div>
                ))}
                {isActiveConversationLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                        Assistant
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                        <p className="text-sm">Thinking...</p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={pendingResponseRef} />
              </div>
            ) : (
              <div className="text-center mt-6 text-gray-500 dark:text-slate-400">
                <h3 className="text-xl">Welcome to the RAG Documents App!</h3>
                <p>Start by entering a query in the search box to explore your documents.</p>
              </div>
            )}
          </div>

          {/* SearchBar */}
          <div className="w-full pt-3 rounded-xl mt-4 self-end">
            <SearchBar onSearch={handleSearch} disabled={isActiveConversationLoading} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/4 bg-gray-50 p-4 rounded-xl shadow-md dark:bg-slate-800 dark:shadow-slate-950/30">
          <h2 className="text-lg mb-6 text-gray-900 dark:text-slate-100">Sources</h2>
          <hr className="border-t-2 border-gray-300 mb-4 dark:border-slate-700" />
          {role === "admin" && (
            <button
              onClick={toggleUploadPopup}
              className="center-button hover:bg-gray-200 hover:shadow-md flex items-center p-2 dark:hover:bg-slate-700"
              type="button"
            >
              <PlusCircleIcon className="w-5 h-5 mr-1" />
              <span>Add Source</span>
            </button>
          )}
        </div>
      </div>

      {syncError && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-lg">
          <div className="flex items-start gap-3">
            <p className="flex-1">{syncError}</p>
            <button
              onClick={() => setSyncError("")}
              className="rounded p-1 text-amber-700 hover:bg-amber-100"
              type="button"
              aria-label="Dismiss conversation sync warning"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showUploadPopup && <UploadDocument onClose={toggleUploadPopup} />}
    </div>

  );
}

export default App;
