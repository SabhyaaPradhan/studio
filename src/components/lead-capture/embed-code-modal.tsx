
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmbedCodeModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    embedCode: string;
}

export function EmbedCodeModal({ isOpen, onOpenChange, embedCode }: EmbedCodeModalProps) {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        toast({ title: "Embed code copied!" });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Embed Your Form</DialogTitle>
                    <DialogDescription>Copy and paste this code into your website's HTML where you want the form to appear.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Textarea value={embedCode} readOnly className="h-40 font-mono text-sm bg-secondary" />
                    <Button onClick={handleCopy} className="w-full">
                        <Copy className="mr-2 h-4 w-4" /> Copy Code
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
