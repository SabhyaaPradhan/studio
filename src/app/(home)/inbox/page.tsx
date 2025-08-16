
'use client';

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Loader2,
  RefreshCw,
  AlertCircle
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
  
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  
  const [recentReplies, setRecentReplies] = useState<AiGeneratedReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const isEmailActive = integrations.some(i => i.id === 'gmail');

  useEffect(() => {
    if (user) {
        setIntegrationsLoading(true);
        const unsubIntegrations = listenToIntegrations(user.uid, 
            (data) => {
                setIntegrations(data);
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
    }
  }, [user, toast]);
  
  useEffect(() => {
    if (user && isEmailActive) {
      setConversationsLoading(true);
      setRepliesLoading(true);

      const unsubConversations = listenToConversations(user.uid, (data) => {
        setConversations(data);
        if (data.length > 0 && !selectedConversation) {
            setSelectedConversation(data[0]);
        }
        setConversationsLoading(false);
      }, (err) => {
        console.error(err);
        toast({ variant: "destructive", title: "Error", description: "Could not load conversations."});
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
    } else if (!isEmailActive) {
        setConversations([]);
        setRecentReplies([]);
        setConversationsLoading(false);
        setRepliesLoading(false);
    }
  }, [user, isEmailActive, toast, selectedConversation?.id]);

  const handleSyncEmails = async () => {
    if (!user) return;
    setIsSyncing(true);
    toast({ title: "Syncing emails...", description: "This may take a moment." });
    
    try {
        const response = await fetch('/api/email/sync', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to sync emails.');
        }

        toast({ title: "Sync Complete!", description: `Synced ${data.syncedConversations} conversations and ${data.syncedMessages} messages.` });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Sync Failed", description: error.message });
    } finally {
        setIsSyncing(false);
    }
  };

  const handleGenerateReply = async () => {
    if (!replyForm.replyType || !selectedConversation) return;

    setIsGenerating(true);
    try {
        const result = await generateInboxReply({
            conversationId: selectedConversation.id,
            messageId: replyForm.messageId,
            replyType: replyForm.replyType as any,
            customInstructions: replyForm.customInstructions,
            history: selectedConversation.messages.map(m => ({...m, createdAt: new Date(m.createdAt).toISOString()}))
        });
        setGeneratedReply(result.generatedReply);
        setIsPreviewOpen(true);
    } catch (error: any) {
         toast({
            title: "Generation Failed",
            description: error.message || "Failed to generate reply.",
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

  if (!isEmailActive) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-full">
        <div className="text-center py-16 max-w-lg">
          <div className="mx-auto mb-6 p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit">
            <Mail className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Email Integration Required</h1>
          <p className="text-muted-foreground mb-8">
            Connect your Gmail account to start managing messages and generating AI-powered replies.
          </p>
          <Button onClick={() => router.push('/integrations')}>
            <Mail className="h-4 w-4 mr-2" />
            Connect Your Email
          </Button>
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
    setReplyForm({ replyType: "", customInstructions: "", messageId: message.id });
    setIsReplyModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customer Inbox</h1>
          <p className="text-muted-foreground mt-2">Manage conversations with AI-assisted replies</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{filteredConversations.length} conversations</Badge>
          <Button onClick={handleSyncEmails} variant="outline" disabled={isSyncing}>
            {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Sync Emails
          </Button>
        </div>
      </div>

      <Card className="flex-1">
        <CardContent className="p-4 h-full grid lg:grid-cols-3 gap-6">
          {/* Conversation List Column */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row gap-4 p-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusFilters.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Separator className="my-2" />
            <ScrollArea className="flex-grow">
              {conversationsLoading ? (
                <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground"><InboxIcon className="w-12 h-12 mx-auto mb-4 opacity-50" /><p className="font-medium">No conversations found</p><p className="text-sm mt-1">Click "Sync Emails" to fetch your latest messages.</p></div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredConversations.map(c => {
                    const ChannelIcon = channelIcons[c.channel] || Mail;
                    return (
                      <div key={c.id}
                           className={`p-3 border-l-4 rounded-r-md cursor-pointer ${selectedConversation?.id === c.id ? 'border-primary bg-secondary' : 'border-transparent hover:bg-secondary'}`}
                           onClick={() => setSelectedConversation(c)}>
                        <div className="flex items-center gap-2 mb-1">
                          <ChannelIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-sm truncate">{c.customerName}</span>
                          {c.unreadCount > 0 && <Badge variant="destructive" className="h-5 px-2">{c.unreadCount}</Badge>}
                          <span className="text-xs text-muted-foreground ml-auto">{c.lastMessageAt ? formatDistanceToNow(new Date(c.lastMessageAt as any), { addSuffix: true }) : ''}</span>
                        </div>
                        <p className="text-sm font-medium truncate">{c.subject}</p>
                        <p className="text-sm text-muted-foreground truncate">{c.messages[c.messages.length - 1]?.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Message View Column */}
          <div className="lg:col-span-2 flex flex-col h-full border-l">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-lg">{selectedConversation.subject}</h2>
                        <p className="text-sm text-muted-foreground">{selectedConversation.customerName} &lt;{selectedConversation.customerEmail}&gt;</p>
                    </div>
                    <Badge variant="outline" className={priorityColors[selectedConversation.priority]}>{selectedConversation.priority}</Badge>
                  </div>
                </div>
                <ScrollArea className="flex-grow p-4 bg-muted/20">
                  <div className="space-y-4">
                    {selectedConversation.messages.map(m => (
                      <div key={m.id} className={`p-4 rounded-lg max-w-[80%] ${m.messageType === 'incoming' ? 'bg-card mr-auto' : 'bg-primary/10 ml-auto'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold">{m.senderName}</span>
                          <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        {m.messageType === 'incoming' && (
                          <Button size="sm" variant="ghost" className="mt-2 h-7 px-2 text-xs" onClick={() => handleReplyToMessage(selectedConversation, m)}>
                            <Bot className="w-3 h-3 mr-1" /> AI Reply
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <Textarea placeholder="Write a reply..." />
                   <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline">Attach File</Button>
                        <Button><Send className="w-4 h-4 mr-2" /> Send</Button>
                    </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <div>
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Generate AI Reply</DialogTitle><DialogDescription>Select a response type for this message.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            {selectedConversation && (<div className="p-3 bg-secondary rounded-lg"><Label className="text-xs font-medium text-muted-foreground">Customer Message:</Label><p className="text-sm mt-1">{selectedConversation.messages.find(m => m.id === replyForm.messageId)?.content}</p></div>)}
            <div>
              <Label htmlFor="replyType">Reply Type</Label>
              <Select value={replyForm.replyType} onValueChange={(value) => setReplyForm({...replyForm, replyType: value})}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select reply type" /></SelectTrigger>
                <SelectContent>
                  {replyTypes.map(t => (<SelectItem key={t.value} value={t.value}><div><div className="font-medium">{t.label}</div><div className="text-xs text-muted-foreground">{t.description}</div></div></SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            {replyForm.replyType === "custom" && (<div><Label htmlFor="customInstructions">Custom Instructions</Label><Textarea id="customInstructions" placeholder="Describe how you want to respond..." value={replyForm.customInstructions} onChange={(e) => setReplyForm({...replyForm, customInstructions: e.target.value})} className="mt-2"/></div>)}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>Cancel</Button>
              <Button onClick={handleGenerateReply} disabled={isGenerating || !replyForm.replyType}>
                {isGenerating ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>) : (<><Sparkles className="w-4 h-4 mr-2" />Generate Reply</>)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Preview AI Reply</DialogTitle><DialogDescription>Review and edit the response before sending.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label htmlFor="generatedReply">AI Generated Reply</Label><Textarea id="generatedReply" value={generatedReply} onChange={(e) => setGeneratedReply(e.target.value)} className="mt-2 min-h-[150px]"/></div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Cancel</Button>
              <Button variant="outline" onClick={() => { navigator.clipboard.writeText(generatedReply); toast({ title: "Copied to clipboard" }); }}><Copy className="w-4 h-4 mr-2" />Copy</Button>
              <Button onClick={() => { toast({ title: "Reply Sent" }); setIsPreviewOpen(false); setIsReplyModalOpen(false); }} disabled={isSending}>
                {isSending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>) : (<><Send className="w-4 h-4 mr-2" />Send Reply</>)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
