
'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Workflow, Users, Bot, MessageSquare } from 'lucide-react';
import type { Group } from '@/services/firestore-service';

interface PromptEditorProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    group: Group | null;
}

export function PromptEditor({ isOpen, onOpenChange, group }: PromptEditorProps) {
    if (!group) {
        return null;
    }
    
    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="h-full w-[600px] max-w-full flex flex-col">
                <div className="flex-shrink-0 p-4 border-b">
                    <DrawerHeader className="p-0">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">#{group.name}</h2>
                            <Button variant="ghost" size="icon"><Star className="h-5 w-5" /></Button>
                        </div>
                         <DrawerDescription>{group.description}</DrawerDescription>
                    </DrawerHeader>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <Tabs defaultValue="messages" className="h-full flex flex-col">
                        <TabsList className="m-4">
                            <TabsTrigger value="messages"><MessageSquare className="w-4 h-4 mr-2" />Messages</TabsTrigger>
                            <TabsTrigger value="workflows"><Workflow className="w-4 h-4 mr-2" />Workflows</TabsTrigger>
                            <TabsTrigger value="members"><Users className="w-4 h-4 mr-2" />Members</TabsTrigger>
                        </TabsList>

                        <TabsContent value="messages" className="flex-grow p-4 pt-0">
                           <div className="space-y-4 h-full flex flex-col">
                                <div className="flex-1 border rounded-lg bg-muted/50 p-4 text-center text-muted-foreground flex items-center justify-center">
                                    <div className="space-y-2">
                                        <Bot className="h-8 w-8 mx-auto" />
                                        <p>Chat messages will appear here.</p>
                                    </div>
                                </div>
                                <Textarea placeholder={`Send a message to #${group.name}`} />
                           </div>
                        </TabsContent>

                        <TabsContent value="workflows" className="p-4 pt-0">
                            <div className="p-4 border rounded-lg bg-muted/50 min-h-[200px] text-center text-muted-foreground flex items-center justify-center">
                                <div className="space-y-2">
                                    <Workflow className="h-8 w-8 mx-auto" />
                                    <p>Workflow builder will be here.</p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="members" className="p-4 pt-0">
                             <div className="p-4 border rounded-lg bg-muted/50 min-h-[200px] text-center text-muted-foreground flex items-center justify-center">
                                <div className="space-y-2">
                                    <Users className="h-8 w-8 mx-auto" />
                                    <p>Group members list will be here.</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                
                <DrawerFooter className="flex-shrink-0 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{group.memberCount} members</span>
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
