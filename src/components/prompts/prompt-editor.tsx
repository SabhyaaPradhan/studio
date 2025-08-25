
'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star, Copy, Wand2, History, Users, Workflow } from 'lucide-react';

interface PromptEditorProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PromptEditor({ isOpen, onOpenChange }: PromptEditorProps) {
    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="h-full w-[600px] max-w-full flex flex-col">
                <div className="flex-shrink-0 p-4 border-b">
                    <DrawerHeader className="p-0">
                        <div className="flex items-center gap-4">
                            <Input defaultValue="#general" className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 p-0" />
                            <Button variant="ghost" size="icon"><Star className="h-5 w-5" /></Button>
                        </div>
                         <DrawerDescription>A place for team-wide announcements and general discussion.</DrawerDescription>
                    </DrawerHeader>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <Tabs defaultValue="messages" className="h-full flex flex-col">
                        <TabsList className="m-4">
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                            <TabsTrigger value="workflows">Workflows</TabsTrigger>
                            <TabsTrigger value="members">Members</TabsTrigger>
                        </TabsList>

                        <TabsContent value="messages" className="flex-grow p-4 pt-0">
                           <div className="space-y-4 h-full flex flex-col">
                                <div className="flex-1 border rounded-lg bg-muted/50 p-4 text-center text-muted-foreground flex items-center justify-center">
                                    <p>Chat messages will appear here.</p>
                                </div>
                                <Textarea placeholder="Send a message to #general" />
                           </div>
                        </TabsContent>

                        <TabsContent value="workflows" className="p-4 pt-0">
                            <div className="p-4 border rounded-lg bg-muted/50 min-h-[200px] text-center text-muted-foreground flex items-center justify-center">
                                <Workflow className="h-8 w-8 mx-auto mb-2" />
                                <p>Workflow builder will be here.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="members" className="p-4 pt-0">
                             <div className="p-4 border rounded-lg bg-muted/50 text-center text-muted-foreground flex items-center justify-center">
                                <Users className="h-8 w-8 mx-auto mb-2" />
                                <p>Group members list will be here.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                
                <DrawerFooter className="flex-shrink-0 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">2 members</span>
                        <div className="flex gap-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                            <Button>Send</Button>
                        </div>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
