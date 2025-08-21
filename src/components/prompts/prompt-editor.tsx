
'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star, Copy, Wand2, History } from 'lucide-react';

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
                            <Input defaultValue="New Welcome Prompt" className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 p-0" />
                            <Select defaultValue="system">
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="system">System</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="assistant">Assistant</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon"><Star className="h-5 w-5" /></Button>
                        </div>
                    </DrawerHeader>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <Tabs defaultValue="editor" className="h-full flex flex-col">
                        <TabsList className="m-4">
                            <TabsTrigger value="editor">Editor</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="versions">Versions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="editor" className="flex-grow p-4 pt-0">
                           <div className="space-y-4">
                                <div>
                                    <Label htmlFor="prompt-content">Prompt Content</Label>
                                    <Textarea id="prompt-content" placeholder="e.g., You are a helpful assistant for {{company_name}}..." className="min-h-[200px] font-mono text-sm" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Variables</h4>
                                    <div className="p-3 bg-secondary rounded-lg text-center text-sm text-muted-foreground">
                                        Variables like {'{{variable_name}}'} will appear here.
                                    </div>
                                </div>
                           </div>
                        </TabsContent>

                        <TabsContent value="preview" className="p-4 pt-0">
                            <div className="p-4 border rounded-lg bg-muted/50 min-h-[200px]">
                                <p className="text-muted-foreground">Live preview of your prompt will be shown here.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="versions" className="p-4 pt-0">
                             <div className="p-4 border rounded-lg bg-muted/50 text-center text-muted-foreground">
                                <History className="h-8 w-8 mx-auto mb-2" />
                                <p>Version history will be displayed here.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                
                <DrawerFooter className="flex-shrink-0 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Saved 2 minutes ago</span>
                        <div className="flex gap-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                            <Button>Save & Publish</Button>
                        </div>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
