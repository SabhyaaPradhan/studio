

'use client';

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter }from "next/navigation";
import { useAuthContext } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateChatResponse } from "@/ai/flows/generate-chat-response";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Loader2,
  User,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { listenToChatMessages, ChatMessage, writeChatMessageEvent, clearChatHistory } from "@/services/firestore-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function ChatPageContent() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const promptHandled = useRef(false);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (initialMessage?: string) => {
    const messageToSend = initialMessage || message;
    if (!messageToSend.trim() || !user) return;
    
    if (!initialMessage) {
        setMessage("");
    }
    setIsSending(true);

    try {
        const userMessage: Omit<ChatMessage, 'id' | 'createdAt'> = {
            role: 'user',
            content: messageToSend,
            tokens: messageToSend.split(' ').length, // Approximate tokens
        };
        
        await writeChatMessageEvent(user.uid, userMessage);

        const history = messages.map(m => ({ role: m.role, content: m.content })) || [];

        const aiResult = await generateChatResponse({ message: messageToSend, history });

        const aiMessage: Omit<ChatMessage, 'id' | 'createdAt'> = {
            role: 'model',
            content: aiResult.response,
            confidence: aiResult.confidence,
            tokens: aiResult.response.split(' ').length, // Approximate tokens
            category: "General", // Placeholder category
            latency_ms: 500 // Placeholder latency
        };
        await writeChatMessageEvent(user.uid, aiMessage);

    } catch (error) {
        console.error("Failed to send message:", error);
        toast({
            title: "Error sending message",
            description: "Failed to get AI response. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    if (!user) return;
    try {
        await clearChatHistory(user.uid);
        toast({
            title: "Chat Cleared",
            description: "Your conversation history has been removed."
        });
    } catch (error) {
        console.error("Failed to clear chat:", error);
        toast({
            title: "Error",
            description: "Could not clear chat history.",
            variant: "destructive"
        });
    }
    setIsClearConfirmOpen(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  useEffect(() => {
    if (user) {
        setIsLoadingHistory(true);
        const unsubscribe = listenToChatMessages(
            user.uid, 
            (loadedMessages) => {
                setMessages(loadedMessages);
                setIsLoadingHistory(false);
                
                const promptFromUrl = searchParams.get('prompt');
                if (promptFromUrl && !promptHandled.current) {
                    const decodedPrompt = decodeURIComponent(promptFromUrl);
                    setMessage(decodedPrompt); // Populate the textarea instead of sending
                    promptHandled.current = true; // Ensure it only runs once
                    router.replace('/chat', { scroll: false }); // Clean the URL without scrolling
                }
            },
            (error) => {
                console.error("Failed to load messages:", error);
                toast({ title: "Error", description: "Could not load chat history.", variant: "destructive"});
                setIsLoadingHistory(false);
            }
        );

        return () => unsubscribe();
    }
  }, [user, toast, searchParams, router]);


  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Response copied successfully"
    });
  };
  
  return (
    <>
      <AlertDialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            <AlertDialogTitle className="text-center">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This action cannot be undone. This will permanently delete your
              current conversation history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center flex-row gap-2 pt-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat}>Clear Chat</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col h-full p-4 md:p-8">
          <div className="max-w-4xl mx-auto flex flex-col gap-6 w-full">
              <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                      Chat / AI Assistant
                  </h1>
                  <p className="text-muted-foreground">
                      Get instant help crafting professional client responses.
                  </p>
              </div>

              <Card className="flex-1 flex flex-col h-full">
                  <CardHeader className="flex-row items-center justify-between">
                      <div className="space-y-1.5">
                         <CardTitle>Conversation</CardTitle>
                         <CardDescription className="flex items-center gap-1.5">
                             <Badge variant="outline" className="text-primary border-primary/50">
                                <Bot className="w-3 h-3 mr-1" />
                                AI Powered
                            </Badge>
                         </CardDescription>
                      </div>
                       <Button variant="outline" size="sm" onClick={() => setIsClearConfirmOpen(true)} disabled={messages.length === 0}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Clear Chat
                      </Button>
                  </CardHeader>
                  <CardContent ref={scrollAreaRef} className="space-y-6 overflow-y-auto p-6 h-[600px]">
                  {isLoadingHistory ? (
                      <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                  ) : (
                      <AnimatePresence>
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className={`flex gap-3 items-start ${
                              msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            {msg.role === 'model' && <Avatar Icon={Bot} />}
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words shadow-sm ${
                                  msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary"
                              }`}
                            >
                              <div className="whitespace-pre-wrap text-sm">
                                  {msg.content}
                              </div>
                              {msg.role === "model" && (
                                  <div className="flex items-center justify-between text-xs opacity-70 mt-2">
                                      {msg.confidence && (
                                      <span className="text-primary">
                                          {Math.round(msg.confidence * 100)}% confidence
                                      </span>
                                      )}
                                      <div className="flex gap-1">
                                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(msg.content)}>
                                              <Copy className="w-3 h-3" />
                                          </Button>
                                          <Button size="icon" variant="ghost" className="h-6 w-6">
                                              <ThumbsUp className="w-3 h-3" />
                                          </Button>
                                          <Button size="icon" variant="ghost" className="h-6 w-6">
                                              <ThumbsDown className="w-3 h-3" />
                                          </Button>
                                      </div>
                                  </div>
                              )}
                            </div>
                            {msg.role === 'user' && <Avatar Icon={User} isUser />}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                  )}
                  {isSending && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 items-start justify-start"
                      >
                          <Avatar Icon={Bot} />
                          <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-secondary">
                              <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Generating response...</span>
                              </div>
                          </div>
                      </motion.div>
                  )}
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-background">
                      <div className="relative">
                          <Textarea
                              placeholder="Describe your client's message and the type of response you need..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              className="pr-16"
                              rows={2}
                              onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                              }
                              }}
                          />
                          <Button 
                              size="icon"
                              onClick={() => handleSendMessage()} 
                              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8"
                              disabled={isSending || !message.trim()}
                          >
                              {isSending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                              <Send className="w-4 h-4" />
                              )}
                          </Button>
                      </div>
                  </div>
              </Card>
          </div>
      </div>
    </>
  );
}


const Avatar = ({ Icon, isUser = false }: { Icon: React.ElementType, isUser?: boolean}) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
        <Icon className="w-5 h-5" />
    </div>
)

export default function ChatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatPageContent />
        </Suspense>
    )
}

    