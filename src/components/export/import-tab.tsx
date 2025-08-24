
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ImportTab() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast({ variant: 'destructive', title: 'No file selected', description: 'Please choose a file to upload.' });
            return;
        }

        setIsUploading(true);
        toast({ title: 'Upload started', description: 'Your file is being imported.' });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({ title: 'Import successful', description: `${file.name} has been imported successfully.` });
        setIsUploading(false);
        setFile(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Import Conversations</CardTitle>
                <CardDescription>Upload a CSV, JSON, or TXT file to import conversation history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="file-upload">Choose a file</Label>
                    <div 
                        className={cn(
                            "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary transition",
                            file && "border-primary"
                        )}
                    >
                        <Input id="file-upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept=".csv,.json,.txt" />
                        {!file ? (
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">CSV, JSON, or TXT (MAX. 10MB)</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center">
                                <File className="h-12 w-12 text-primary" />
                                <p className="mt-2 font-semibold">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setFile(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Button onClick={handleUpload} disabled={isUploading || !file}>
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Import File
                </Button>
            </CardContent>
        </Card>
    );
}
