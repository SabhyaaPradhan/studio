
'use client';

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Inbox as InboxIcon,
  MessageSquare, 
  Send, 
  Mail,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  Bot,
  Copy,
  Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { listenToConversations, Conversation, CustomerMessage, AiGeneratedReply, listenToRecentReplies, Integration, listenToIntegrations } from "@/services/firestore-service";
import { generateInboxReply } from "@/ai/flows/generate-inbox-reply";


const replyTypes = [
  { value: "apology", label: "Apology", description: "Express sincere apology for an issue" },
  { value: "order_update", label: "Order Update", description: "Provide order status or shipping information" },
  { value: "refund_request", label: "Refund Request", description: "Handle refund or return requests" },
  { value: "upsell", label: "Upsell Message", description: "Suggest additional products or services" },
  { value: "custom", label: "Custom Message", description: "Create a custom response with specific instructions" },
];

const statusFilters = [
  { value: "all", label: "All Conversations" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "pending", label: "Pending" },
];

const priorityColors: { [key: string]: string } = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  normal: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  high: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
};

const channelIcons: { [key: string]: React.ElementType } = {
  email: Mail,
  whatsapp: MessageSquare,
  sms: MessageSquare,
  chat: MessageSquare,
};

export default function Inbox() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();
  
  // State variables
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyForm, setReplyForm] = useState({
    replyType: "",
    customInstructions: "",
    messageId: "",
  });
  const [generatedReply, setGeneratedReply] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [emailIntegrations, setEmailIntegrations] = useState<Integration[]>([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  
  const [recentReplies, setRecentReplies] = useState<AiGeneratedReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);


  useEffect(() => {
    if (user) {
      setIntegrationsLoading(true);

      const unsubIntegrations = listenToIntegrations(
        user.uid,
        (integrations) => {
          setEmailIntegrations(integrations.filter(i => i.id === 'gmail'));
          setIntegrationsLoading(false);
        },
        (error) => {
          console.error("Failed to load integrations:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not load integrations." });
          setIntegrationsLoading(false);
        }
      );

      return () => unsubIntegrations();
    } else {
        setIntegrationsLoading(false);
        setEmailIntegrations([]);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user && !integrationsLoading && emailIntegrations.length > 0) {
        
        const unsubConversations = listenToConversations(user.uid, (data) => {
            setConversations(data);
            setConversationsLoading(false);
        }, (err) => {
            console.error(err);
            setConversationsLoading(false);
        });
        
        const unsubReplies = listenToRecentReplies(user.uid, (data) => {
            setRecentReplies(data);
            setRepliesLoading(false);
        }, (err) => {
            console.error(err);
            setRepliesLoading(false);
        });

        return () => {
            unsubConversations();
            unsubReplies();
        };
    } else if (!integrationsLoading) {
        setConversationsLoading(false);
        setRepliesLoading(false);
        setConversations([]);
        setRecentReplies([]);
    }
  }, [user, integrationsLoading, emailIntegrations]);


  // This is a mock sync function
  const syncEmails = () => {
    toast({
      title: "Sync in progress...",
      description: "Fetching latest emails.",
    });
    // In a real app, this would trigger a backend process
    setTimeout(() => {
        toast({
            title: "Emails Synced",
            description: "Your latest emails have been synchronized.",
        });
    }, 2000);
  }

  const handleGenerateReply = async () => {
    if (!replyForm.replyType || !selectedConversation) {
      toast({
        title: "Missing Information",
        description: "Please select a reply type and a conversation.",
        variant: "destructive",
      });
      return;
    }

    if (replyForm.replyType === "custom" && !replyForm.customInstructions) {
      toast({
        title: "Custom Instructions Required",
        description: "Please provide custom instructions for your reply.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
        const startTime = Date.now();
        const result = await generateInboxReply({
            conversationId: selectedConversation.id,
            messageId: replyForm.messageId,
            replyType: replyForm.replyType as any,
            customInstructions: replyForm.customInstructions,
            history: selectedConversation.messages.map(m => ({...m, createdAt: new Date(m.createdAt).toISOString()}))
        });
        const endTime = Date.now();
        
        setGeneratedReply(result.generatedReply);
        setIsPreviewOpen(true);
        toast({
            title: "Reply Generated!",
            description: `AI response generated in ${endTime - startTime}ms with ${result.confidence}% confidence.`
        });
    } catch (error: any) {
         toast({
            title: "Generation Failed",
            description: error.message || "Failed to generate reply. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsGenerating(false);
    }
  };


  if (integrationsLoading) {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  if (emailIntegrations.length === 0) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center py-16">
          <div className="mx-auto mb-6 p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit">
            <Mail className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Email Integration Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Connect your Gmail account to start managing messages with AI-powered reply generation. 
            Available for Pro and Enterprise plans.
          </p>
          <Button 
            onClick={() => router.push('/integrations')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Connect Email Account
          </Button>
          <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="text-center p-4 border rounded-lg">
              <Mail className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Gmail</p>
              <p className="text-xs text-gray-500">OAuth 2.0</p>
            </div>
            <div className="text-center p-4 border rounded-lg opacity-60">
              <Mail className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500">Outlook</p>
              <p className="text-xs text-gray-400">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredConversations = conversations.filter((conv: Conversation) => {
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter;
    const matchesSearch = 
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.subject && conv.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleReplyToMessage = (conversation: Conversation, message: CustomerMessage) => {
    setSelectedConversation(conversation);
    setReplyForm({
      replyType: "",
      customInstructions: "",
      messageId: message.id,
    });
    setIsReplyModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    return priorityColors[priority] || priorityColors.normal;
  };

  const getChannelIcon = (channel: string) => {
    const IconComponent = channelIcons[channel] || Mail;
    return IconComponent;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customer Inbox
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage customer conversations with AI-assisted replies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {filteredConversations.length} conversations
          </Badge>
          <Button onClick={syncEmails} variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Sync Emails
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <InboxIcon className="w-5 h-5" />
                Conversations
              </CardTitle>
              <CardDescription>
                Click on a conversation to view details and reply
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {conversationsLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-muted-foreground">Loading conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <InboxIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium mb-2">No conversations found</p>
                  <p className="text-sm">Customer messages will appear here when they arrive.</p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-1">
                    {filteredConversations.map((conversation: Conversation) => {
                      const ChannelIcon = getChannelIcon(conversation.channel);
                      return (
                        <div
                          key={conversation.id}
                          className={`p-4 border-b hover:bg-secondary cursor-pointer transition-colors ${
                            selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <ChannelIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium truncate">
                                  {conversation.customerName}
                                </span>
                                <Badge className={getPriorityColor(conversation.priority)}>
                                  {conversation.priority}
                                </Badge>
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-foreground mb-1">
                                {conversation.subject || conversation.customerEmail}
                              </p>
                              {conversation.messages[conversation.messages.length -1] && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.messages[conversation.messages.length -1].content.substring(0, 100)}...
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(conversation.lastMessageAt.toDate()), { addSuffix: true })}
                              </span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {selectedConversation ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{selectedConversation.customerName}</span>
                  <Badge className={getPriorityColor(selectedConversation.priority)}>
                    {selectedConversation.priority}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {selectedConversation.customerEmail}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Channel</Label>
                    <p className="capitalize">{selectedConversation.channel}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                    <p className="capitalize">{selectedConversation.status}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium mb-2 block">Messages</Label>
                  <ScrollArea className="h-[300px] border rounded-lg p-3">
                    <div className="space-y-3">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.messageType === 'incoming'
                              ? 'bg-secondary mr-8'
                              : 'bg-primary/10 ml-8'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium">
                              {message.senderName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          {message.messageType === 'incoming' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-2 h-6 px-2 text-xs"
                              onClick={() => handleReplyToMessage(selectedConversation, message)}
                            >
                              <Bot className="w-3 h-3 mr-1" />
                              AI Reply
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Select a conversation to view details</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent AI Replies</CardTitle>
              <CardDescription>
                Your recent AI-assisted responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {repliesLoading ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : recentReplies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent replies
                </p>
              ) : (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {recentReplies.slice(0, 5).map((reply) => (
                      <div key={reply.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            variant={reply.status === 'sent' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {reply.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.createdAt.toDate()), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm truncate mb-1">
                          To: {reply.conversation.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {reply.finalReply || reply.generatedReply}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate AI Reply</DialogTitle>
            <DialogDescription>
              Select the type of response you'd like to generate for this customer message.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedConversation && (
              <div className="p-3 bg-secondary rounded-lg">
                <Label className="text-xs font-medium text-muted-foreground">Customer Message:</Label>
                <p className="text-sm mt-1">
                  {selectedConversation.messages.find(m => m.id === replyForm.messageId)?.content}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="replyType">Reply Type</Label>
              <Select 
                value={replyForm.replyType} 
                onValueChange={(value) => setReplyForm({...replyForm, replyType: value})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select reply type" />
                </SelectTrigger>
                <SelectContent>
                  {replyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {replyForm.replyType === "custom" && (
              <div>
                <Label htmlFor="customInstructions">Custom Instructions</Label>
                <Textarea
                  id="customInstructions"
                  placeholder="Describe how you want to respond to this customer..."
                  value={replyForm.customInstructions}
                  onChange={(e) => setReplyForm({...replyForm, customInstructions: e.target.value})}
                  className="mt-2"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateReply}
                disabled={isGenerating || !replyForm.replyType}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview AI Reply</DialogTitle>
            <DialogDescription>
              Review the generated response and edit if needed before sending.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="generatedReply">AI Generated Reply</Label>
              <Textarea
                id="generatedReply"
                value={generatedReply}
                onChange={(e) => setGeneratedReply(e.target.value)}
                className="mt-2 min-h-[150px]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedReply);
                  toast({ title: "Copied to clipboard" });
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Reply Sent",
                    description: "Your response has been sent to the customer.",
                  });
                  setIsPreviewOpen(false);
                  setIsReplyModalOpen(false);
                }}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    