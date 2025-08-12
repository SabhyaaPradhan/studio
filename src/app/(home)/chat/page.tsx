
'use client';

import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateChatResponse } from "@/ai/flows/generate-chat-response";
import { 
  Bot, 
  Send, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  Sparkles,
  Clock,
  Loader2,
  User
} from "lucide-react";
import { listenToConversations, createConversation, addMessageToConversation, Conversation, ChatMessage } from "@/services/firestore-service";
import { listenToUser, UserProfile } from "@/services/user-service";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPage() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentConversationId, isSending]);

  useEffect(() => {
    if (user) {
        const unsubscribeUser = listenToUser(user.uid, setUserProfile);
        const unsubscribeConversations = listenToConversations(
            user.uid, 
            (loadedConversations) => {
                setConversations(loadedConversations);
                if (loadedConversations.length > 0 && !currentConversationId) {
                    setCurrentConversationId(loadedConversations[0].id);
                }
                setIsLoadingHistory(false);
            },
            (error) => {
                console.error("Failed to load conversations:", error);
                toast({ title: "Error", description: "Could not load chat history.", variant: "destructive"});
                setIsLoadingHistory(false);
            }
        );

        return () => {
            unsubscribeUser();
            unsubscribeConversations();
        };
    }
  }, [user, toast, currentConversationId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    const userMessageContent = message;
    setMessage("");
    setIsSending(true);

    try {
        let conversationId = currentConversationId;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: userMessageContent,
            createdAt: new Date().toISOString(),
        };

        if (!conversationId) {
            const newConversationId = await createConversation(user.uid, userMessage);
            setCurrentConversationId(newConversationId);
            conversationId = newConversationId;
        } else {
            await addMessageToConversation(user.uid, conversationId, userMessage);
        }

        const currentConvo = conversations.find(c => c.id === conversationId);
        const history = currentConvo?.messages.map(m => ({ role: m.role, content: m.content })) || [];

        const aiResult = await generateChatResponse({ message: userMessageContent, history });

        const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: aiResult.response,
            confidence: aiResult.confidence,
            createdAt: new Date().toISOString(),
        };
        await addMessageToConversation(user.uid, conversationId!, aiMessage);
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

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Response copied successfully"
    });
  };

  const activeConversation = conversations.find(c => c.id === currentConversationId);
  
  const usageStats = {
      used: conversations.reduce((acc, curr) => acc + curr.messages.filter(m => m.role === 'model').length, 0),
      limit: userProfile?.plan === 'pro' || userProfile?.plan === 'enterprise' ? -1 : 100,
  };


  return (
    <div className="flex flex-col h-full">
        <div className="p-6 border-b">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Chat / AI Assistant
                </h1>
                <p className="text-muted-foreground mt-1">
                    Get instant help crafting professional client responses.
                </p>
                </div>
                <Badge variant="outline" className="text-primary border-primary/50">
                <Bot className="w-4 h-4 mr-2" />
                AI Powered
                </Badge>
            </div>
        </div>

        <div className="flex-1 overflow-hidden">
            <div className="h-full max-w-4xl mx-auto flex gap-6 py-6">

                {/* Main Chat Panel */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Chat Interface */}
                    <Card className="flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle>Conversation</CardTitle>
                        </CardHeader>
                        <CardContent ref={scrollAreaRef} className="flex-1 space-y-4 overflow-y-auto p-6">
                        {isLoadingHistory ? (
                            <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : (
                            activeConversation?.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 items-start ${
                                msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                {msg.role === 'model' && <Avatar Icon={Bot} />}
                                <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words ${
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
                            </div>
                            ))
                        )}
                        {isSending && (
                             <div className="flex gap-3 items-start justify-start">
                                <Avatar Icon={Bot} />
                                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-secondary">
                                    <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Generating response...</span>
                                    </div>
                                </div>
                            </div>
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
                                    onClick={handleSendMessage} 
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
                
                {/* Right Panel */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-6">
                     {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button variant="outline" className="justify-start text-muted-foreground" onClick={() => setMessage("A client is complaining about the price being too high.")}>Respond to Complaint</Button>
                            <Button variant="outline" className="justify-start text-muted-foreground" onClick={() => setMessage("We need to inform a client about a delay in the project timeline.")}>Explain Delay</Button>
                            <Button variant="outline" className="justify-start text-muted-foreground" onClick={() => setMessage("Draft a thank you message for a client who just left a positive review.")}>Thank You Response</Button>
                        </CardContent>
                    </Card>

                    {/* Usage Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Usage</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {userProfile ? (
                                <>
                                <div className="text-sm text-muted-foreground mb-2">
                                    <span className="font-medium text-foreground">Monthly Usage:</span> {usageStats.used} / {
                                    usageStats.limit === -1 ? 'unlimited' : (usageStats.limit || 100)
                                    } queries
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">Plan:</span> <span className="capitalize">{userProfile.plan}</span>
                                </div>
                                {usageStats.limit > 0 && usageStats.used >= usageStats.limit && (
                                <div className="mt-3 p-2 bg-destructive/10 rounded-md">
                                    <p className="text-sm text-destructive">
                                    You've reached your monthly limit. Please upgrade to continue.
                                    </p>
                                </div>
                                )}
                                </>
                            ) : <Skeleton className="h-12 w-full" />}
                        </CardContent>
                    </Card>
                     <Button variant="secondary" onClick={() => setCurrentConversationId(null)}>New Conversation</Button>
                </div>
            </div>
        </div>
    </div>
  );
}


const Avatar = ({ Icon, isUser = false }: { Icon: React.ElementType, isUser?: boolean}) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
        <Icon className="w-5 h-5" />
    </div>
)

    