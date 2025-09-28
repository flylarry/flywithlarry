"use client";

import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { type Message } from "ai";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { useSearchParams, useRouter } from "next/navigation";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { IntermediateStep } from "./IntermediateStep";
import { TypingIndicator } from "./TypingIndicator";
import { Button } from "./ui/button";
import { ArrowDown, LoaderCircle, Paperclip, Send } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { UploadDocumentsForm } from "./UploadDocumentsForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/utils/cn";
import { AuthCTA } from "./AuthCTA";
import {
  getGuestSession,
  incrementGuestMessageCount,
  getRemainingMessages as getGuestRemainingMessages,
} from "@/lib/guestStorage";

// Copy UI components from ChatWindow
function ChatMessages(props: {
  messages: Message[];
  emptyStateComponent: ReactNode;
  sourcesForMessages: Record<string, any>;
  className?: string;
  isLoading?: boolean;
  onScrollToBottomRef?: React.MutableRefObject<(() => void) | null>;
}) {
  const { scrollToBottom, isAtBottom } = useStickToBottomContext();
  const prevMessagesLengthRef = useRef(0);
  const prevContentRef = useRef("");

  // Pass scrollToBottom function to ref
  useEffect(() => {
    if (props.onScrollToBottomRef) {
      props.onScrollToBottomRef.current = scrollToBottom;
    }
  }, [scrollToBottom, props.onScrollToBottomRef]);

  // Function to split messages into separate bubbles by paragraphs
  const splitMessageByParagraphs = (message: Message): Message[] => {
    // Split content by double line breaks (paragraphs)
    const paragraphs = message.content.split("\n\n").filter((p) => p.trim());

    if (paragraphs.length <= 1) {
      return [message];
    }

    // Create separate messages for each paragraph
    return paragraphs.map((paragraph, index) => ({
      ...message,
      id: `${message.id}-${index}`,
      content: paragraph.trim(),
    }));
  };

  // Split all messages
  const processedMessages = props.messages.flatMap(splitMessageByParagraphs);

  // Auto-scroll when adding new messages
  useEffect(() => {
    const currentMessagesLength = processedMessages.length;

    if (currentMessagesLength > prevMessagesLengthRef.current) {
      // There are new messages, scroll down
      setTimeout(() => {
        scrollToBottom();
      }, 150);
    }

    prevMessagesLengthRef.current = currentMessagesLength;
  }, [processedMessages.length, scrollToBottom]);

  // Auto-scroll when message content changes (streaming)
  useEffect(() => {
    const currentContent = processedMessages.map((m) => m.content).join("");

    if (
      currentContent !== prevContentRef.current &&
      prevContentRef.current !== ""
    ) {
      // Content changed (streaming), scroll down
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }

    prevContentRef.current = currentContent;
  }, [processedMessages, scrollToBottom]);

  // Auto-scroll when TypingIndicator disappears
  useEffect(() => {
    if (!props.isLoading) {
      // TypingIndicator disappeared, scroll down
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [props.isLoading, scrollToBottom]);

  return (
    <div className="flex flex-col max-w-[768px] mx-auto pb-2 w-full">
      {processedMessages.map((m, i) => {
        if (m.role === "system") {
          return <IntermediateStep key={m.id} message={m} />;
        }

        const sourceKey = (props.messages.length - 1 - i).toString();

        // Check if this is the first message in a series from the same sender
        const isFirstInSeries =
          i === 0 || processedMessages[i - 1].role !== m.role;

        // Show avatar only for first message from bot in series
        const showAvatar = m.role !== "user" && isFirstInSeries;

        return (
          <ChatMessageBubble
            key={m.id}
            message={m}
            sources={props.sourcesForMessages[sourceKey] || []}
            showTimestamp={true}
            showAvatar={showAvatar}
          />
        );
      })}
      {props.isLoading && <TypingIndicator />}
    </div>
  );
}

function ChatInput(props: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onStop?: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  loading?: boolean;
  placeholder?: string;
  children?: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  const disabled = props.loading && props.onStop == null;
  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (props.loading) {
          props.onStop?.();
        } else {
          props.onSubmit(e);
        }
      }}
      className={cn("flex w-full flex-col", props.className)}
    >
      <div className="border border-input bg-background rounded-lg flex items-start gap-2 max-w-[768px] w-full mx-auto p-2">
        <textarea
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          disabled={disabled}
          className="flex-1 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[20px] max-h-[120px] overflow-y-auto"
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 120) + 'px';
          }}
        />
        {props.children}
        {props.actions}
        <Button
          type="submit"
          size="sm"
          disabled={disabled || !props.value.trim()}
        >
          {props.loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}

function ChatLayout(props: { content: ReactNode; footer: ReactNode }) {
  return (
    <StickToBottom>
      <StickyToBottomContent
        className="h-full"
        contentClassName="py-8 px-2 pb-32"
        content={props.content}
        footer={
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 z-10">
            <div className="max-w-[768px] mx-auto">
              <ScrollToBottom className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4" />
              {props.footer}
            </div>
          </div>
        }
      />
    </StickToBottom>
  );
}

function ScrollToBottom({ className }: { className?: string }) {
  const { scrollToBottom, isAtBottom } = useStickToBottomContext();

  // Hide button if user is close to the end (within 100px)
  if (isAtBottom) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
  );
}

function StickyToBottomContent({
  className,
  contentClassName,
  content,
  footer,
}: {
  className?: string;
  contentClassName?: string;
  content: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className={cn("flex-1 overflow-y-auto", contentClassName)}>
        {content}
      </div>
      {footer}
    </div>
  );
}

export function FastChatWindow() {
  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);
  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});
  const [showAuthCTA, setShowAuthCTA] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const scrollToBottomRef = useRef<(() => void) | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Function to clear query parameters
  const clearQueryParams = () => {
    if (searchParams.get("message")) {
      console.log("Clearing query parameters from URL");
      router.replace("/fast", { scroll: false });
    }
  };

  useEffect(() => {
    setIsHydrated(true);

    // Read initial message from URL parameters
    const message = searchParams.get("message");
    if (message) {
      setInitialMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  const chat = useChat({
    api: "/api/chat",
    body: {
      isGuestChat: true,
    },
    onResponse(response) {
      console.log("FastChatWindow: onResponse called");
      setIsWaitingForResponse(false);

      // Clear query parameters after starting to receive response
      clearQueryParams();

      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader
        ? JSON.parse(Buffer.from(sourcesHeader, "base64").toString("utf8"))
        : [];

      const messageIndexHeader = response.headers.get("x-message-index");
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        });
      }
    },
    streamMode: "text",
    onError: (e) => {
      console.error("FastChatWindow: Chat error:", e);
      setIsWaitingForResponse(false);

      if (e.message?.includes("Connection interrupted")) {
        toast.error("Connection lost", {
          description: "Please try again in a moment.",
        });
      } else if (e.message?.includes("Rate limit")) {
        toast.error("Too many requests", {
          description: "Please wait a moment before trying again.",
        });
      } else {
        toast.error("Something went wrong", {
          description: "Please try again.",
        });
      }
    },
    onFinish: async (message) => {
      console.log(
        "FastChatWindow: onFinish called with message:",
        message.content,
      );
      setIsWaitingForResponse(false);

      // Deduct tokens after receiving response from assistant
      console.log(
        "FastChatWindow: Deducting tokens after receiving assistant response",
      );
      try {
        incrementGuestMessageCount();
        console.log("FastChatWindow: Tokens deducted successfully");
      } catch (error) {
        console.error("FastChatWindow: Error deducting tokens:", error);
      }
    },
    onToolCall: () => {
      // Auto-scroll at start of tool call
      setTimeout(() => {
        scrollToBottomRef.current?.();
      }, 100);
    },
  });

  // Log changes in messages
  useEffect(() => {
    console.log(
      "FastChatWindow: Messages changed:",
      chat.messages.length,
      chat.messages,
    );
  }, [chat.messages]);

  // Send initial message if exists
  useEffect(() => {
    if (isHydrated && initialMessage && chat.messages.length === 0) {
      // Check message limit for guests before sending
      const guestSession = getGuestSession();
      if (!guestSession.canSendMessage) {
        setShowAuthCTA(true);
        toast.error(
          "You've reached the limit of messages. Please sign up to continue.",
        );
        setInitialMessage(null); // Clear initial message
        return;
      }

      console.log("Auto-sending initial message:", initialMessage);
      setTimeout(async () => {
        try {
          // Increment message counter before sending
          incrementGuestMessageCount();

          console.log(
            "FastChatWindow: Auto-sending initial message via chat.append:",
            initialMessage,
          );
          await chat.append({
            role: "user",
            content: initialMessage,
          });
          console.log("FastChatWindow: Initial message sent successfully");

          // Auto-scroll after sending initial message
          setTimeout(() => {
            scrollToBottomRef.current?.();
          }, 200);

          // Clear initial message after sending
          setInitialMessage(null);
        } catch (error) {
          console.error(
            "FastChatWindow: Error sending initial message:",
            error,
          );
        }
      }, 100);
    }
  }, [isHydrated, initialMessage, chat.messages.length, chat]);

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (chat.isLoading || intermediateStepsLoading) return;

    console.log("FastChatWindow: sendMessage called with input:", chat.input);

    // Check message limit for guests
    const guestSession = getGuestSession();
    if (!guestSession.canSendMessage) {
      setShowAuthCTA(true);
      toast.error(
        "You've reached the limit of messages. Please sign up to continue.",
      );
      return;
    }

    // Tokens will be deducted after receiving response from assistant

    if (!showIntermediateSteps) {
      // Show typing indicator before sending
      setIsWaitingForResponse(true);
      console.log("FastChatWindow: Calling chat.handleSubmit");
      chat.handleSubmit(e);
      chat.setInput("");

      // Auto-scroll after sending message
      setTimeout(() => {
        scrollToBottomRef.current?.();
      }, 200);
      return;
    }

    // Logic for intermediate steps (if needed)
    setIntermediateStepsLoading(true);

    const userMessage = chat.input;
    chat.setInput("");
    const messagesWithUserReply = chat.messages.concat({
      id: chat.messages.length.toString(),
      content: userMessage,
      role: "user",
      createdAt: new Date(),
    });
    chat.setMessages(messagesWithUserReply);

    setIsWaitingForResponse(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: messagesWithUserReply,
        show_intermediate_steps: true,
        isGuestChat: true,
      }),
    });
    const json = await response.json();
    setIntermediateStepsLoading(false);

    if (!response.ok) {
      toast.error(`Error while processing your request`, {
        description: json.error,
      });
      return;
    }

    const responseMessages: Message[] = json.messages;

    // Represent intermediate steps as system messages for display purposes
    const toolCallMessages = responseMessages.filter(
      (responseMessage: Message) => {
        return (
          (responseMessage.role === "assistant" &&
            !!responseMessage.tool_calls?.length) ||
          responseMessage.role === "tool"
        );
      },
    );

    const intermediateStepMessages = [];
    for (let i = 0; i < toolCallMessages.length; i += 2) {
      const aiMessage = toolCallMessages[i];
      const toolMessage = toolCallMessages[i + 1];
      intermediateStepMessages.push({
        id: (messagesWithUserReply.length + i / 2).toString(),
        role: "system" as const,
        content: JSON.stringify({
          action: aiMessage.tool_calls?.[0],
          observation: toolMessage.content,
        }),
      });
    }
    const newMessages = messagesWithUserReply;
    for (const message of intermediateStepMessages) {
      newMessages.push(message);
      chat.setMessages([...newMessages]);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1000),
      );
    }

    chat.setMessages([
      ...newMessages,
      {
        id: newMessages.length.toString(),
        content: responseMessages[responseMessages.length - 1].content,
        role: "assistant",
        createdAt: new Date(),
      },
    ]);

    // Deduct tokens after receiving response with intermediate steps
    console.log(
      "FastChatWindow: Deducting tokens after receiving assistant response with intermediate steps",
    );
    try {
      incrementGuestMessageCount();
      console.log("FastChatWindow: Tokens deducted successfully");
    } catch (error) {
      console.error("FastChatWindow: Error deducting tokens:", error);
    }
  }

  const remainingMessages = getGuestRemainingMessages();

  return (
    <div className="flex flex-col h-full">
      <ChatLayout
        content={
          showAuthCTA && isHydrated ? (
            <div className="flex flex-col max-w-[768px] mx-auto pb-6 w-full">
              <ChatMessages
                messages={chat.messages}
                emptyStateComponent={
                  <div className="text-center text-gray-500 mt-8">
                    <p className="text-lg">Welcome to Fast Chat!</p>
                    <p className="text-sm">
                      Ask Larry about your flight concerns...
                    </p>
                  </div>
                }
                sourcesForMessages={sourcesForMessages}
                isLoading={isWaitingForResponse}
                onScrollToBottomRef={scrollToBottomRef}
              />
              <div className="">
                <AuthCTA
                  remainingMessages={remainingMessages}
                  context="limit"
                />
              </div>
            </div>
          ) : chat.messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg">Welcome to Fast Chat!</p>
              <p className="text-sm">Ask Larry about your flight concerns...</p>
            </div>
          ) : (
            <ChatMessages
              messages={chat.messages}
              emptyStateComponent={
                <div className="text-center text-gray-500 mt-8">
                  <p className="text-lg">Welcome to Fast Chat!</p>
                  <p className="text-sm">
                    Ask Larry about your flight concerns...
                  </p>
                </div>
              }
              sourcesForMessages={sourcesForMessages}
              isLoading={isWaitingForResponse}
              onScrollToBottomRef={scrollToBottomRef}
            />
          )
        }
        footer={
          <ChatInput
            value={chat.input}
            onChange={chat.handleInputChange}
            onSubmit={sendMessage}
            loading={chat.isLoading || intermediateStepsLoading}
            placeholder="Ask Larry about your flight concerns..."
          ></ChatInput>
        }
      />
    </div>
  );
}
