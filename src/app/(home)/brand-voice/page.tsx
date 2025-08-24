
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bot, FileText, FileUp, List, Loader2, Sparkles, TestTube2, Upload, AlertCircle } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const sampleCategories = [
    { name: 'Support Replies', count: 12 },
    { name: 'Sales Outreach', count: 8 },
    { name: 'Marketing Copy', count: 5 },
    { name: 'Internal Memos', count: 2 },
];


export default function BrandVoicePage() {
    const [isTraining, setIsTraining] = useState(false);

    const handleRetrain = () => {
        setIsTraining(true);
        setTimeout(() => setIsTraining(false), 3000); // Simulate training time
    };

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Brand Voice Training</h1>
                    <p className="text-muted-foreground">Teach the AI your unique tone, style, and messaging guidelines.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><TestTube2 className="mr-2 h-4 w-4" /> Test Voice</Button>
                    <Button onClick={handleRetrain} disabled={isTraining}>
                        {isTraining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Retrain Model
                    </Button>
                </div>
            </div>

            {/* Overview Card */}
            <Card>
                <CardHeader className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <CardTitle>Voice Profile</CardTitle>
                        <CardDescription>Overall health of your brand voice.</CardDescription>
                    </div>
                     <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                            <p className="text-2xl font-bold text-green-500">92%</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Samples</p>
                            <p className="text-2xl font-bold">27</p>
                        </div>
                        <div>
                             <p className="text-sm font-medium text-muted-foreground">Status</p>
                             <Badge variant="outline" className="text-green-500 border-green-500/50 mt-1">
                                Ready
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Last Trained</p>
                            <p className="text-sm font-semibold mt-1">2 hours ago</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div><Label>Formality</Label><Progress value={30} /></div>
                        <div><Label>Friendliness</Label><Progress value={80} /></div>
                        <div><Label>Confidence</Label><Progress value={90} /></div>
                        <div><Label>Enthusiasm</Label><Progress value={75} /></div>
                        <div><Label>Empathy</Label><Progress value={60} /></div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="samples">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="samples">Training Samples</TabsTrigger>
                    <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="test">Test Voice</TabsTrigger>
                </TabsList>
                
                {/* Training Samples Tab */}
                <TabsContent value="samples" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Add New Sample</CardTitle>
                            <CardDescription>Provide content for the AI to learn from.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div><Label htmlFor="sample-name">Name</Label><Input id="sample-name" placeholder="e.g., 'Positive Support Reply'" /></div>
                            <div><Label htmlFor="sample-category">Category</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="support">Support Replies</SelectItem>
                                        <SelectItem value="sales">Sales Outreach</SelectItem>
                                        <SelectItem value="marketing">Marketing Copy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label htmlFor="sample-content">Content</Label><Textarea id="sample-content" placeholder="Paste your text here..." /></div>
                            <div className="flex gap-2">
                                <Button className="flex-1"><FileText className="mr-2 h-4 w-4" /> Add Text Sample</Button>
                                <Button variant="outline" className="flex-1"><FileUp className="mr-2 h-4 w-4" /> Upload File</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Existing Samples</CardTitle>
                            <CardDescription>A list of all content used for training.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="text-center text-muted-foreground p-8 border rounded-lg">
                                <List className="h-8 w-8 mx-auto mb-2" />
                                <p>No samples yet. Add your first one to get started.</p>
                             </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Guidelines Tab */}
                <TabsContent value="guidelines">
                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Guidelines</CardTitle>
                            <CardDescription>Set explicit rules for how the AI should behave.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2"><Label htmlFor="guideline-personality">Brand Personality</Label><Textarea id="guideline-personality" placeholder="e.g., We are friendly but professional. We use emojis sparingly..." /></div>
                            <div className="grid gap-2"><Label htmlFor="guideline-style">Communication Style</Label><Textarea id="guideline-style" placeholder="e.g., Keep sentences short. Start with the customer's name..." /></div>
                            <div className="grid gap-2"><Label htmlFor="guideline-messages">Key Messages & Values</Label><Textarea id="guideline-messages" placeholder="e.g., Always emphasize our commitment to quality..." /></div>
                            <div className="grid gap-2"><Label htmlFor="guideline-avoid">What to Avoid</Label><Textarea id="guideline-avoid" placeholder="e.g., Never promise specific delivery dates. Avoid technical jargon." /></div>
                            <div className="flex justify-end"><Button>Save Guidelines</Button></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Analysis Tab */}
                <TabsContent value="analysis" className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Voice Consistency</CardTitle><CardDescription>How well new messages match your trained voice.</CardDescription></CardHeader>
                        <CardContent className="text-center">
                            <div className="text-6xl font-bold text-green-500">92%</div>
                            <p className="text-muted-foreground">Overall Accuracy</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Sample Distribution</CardTitle><CardDescription>Breakdown of your training data by category.</CardDescription></CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={sampleCategories} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Test Voice Tab */}
                <TabsContent value="test">
                    <Card>
                         <CardHeader><CardTitle>Test Your Brand Voice</CardTitle><CardDescription>Enter a message to see how well it aligns with your profile.</CardDescription></CardHeader>
                         <CardContent className="space-y-4">
                            <Textarea placeholder="Type or paste a message here..." className="min-h-[150px]" />
                             <div className="flex justify-end"><Button><TestTube2 className="mr-2 h-4 w-4" /> Test Voice Match</Button></div>
                         </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
