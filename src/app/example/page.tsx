
'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/auth-context';
import { addGraph, addAiRequest, listenToGraphs, listenToAiRequests, Graph, AiRequest } from '@/services/firestore-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';

export default function ExamplePage() {
    const { user, loading: authLoading } = useAuthContext();
    const [graphs, setGraphs] = useState<Graph[]>([]);
    const [aiRequests, setAiRequests] = useState<AiRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const unsubscribeGraphs = listenToGraphs(user.uid, (newGraphs) => {
                setGraphs(newGraphs);
                setLoading(false);
            });

            const unsubscribeAiRequests = listenToAiRequests(user.uid, (newRequests) => {
                setAiRequests(newRequests);
                setLoading(false);
            });

            // Cleanup subscription on unmount
            return () => {
                unsubscribeGraphs();
                unsubscribeAiRequests();
            };
        } else if (!authLoading) {
            setLoading(false);
            setError("You must be logged in to view this page.");
        }
    }, [user, authLoading]);

    const handleAddGraph = async () => {
        if (!user) return;
        try {
            await addGraph(user.uid, `My New Graph #${graphs.length + 1}`, { points: [Math.random() * 10, Math.random() * 10] });
        } catch (e) {
            console.error(e);
            setError("Failed to add graph.");
        }
    };

    const handleAddAiRequest = async () => {
        if (!user) return;
        try {
            await addAiRequest(user.uid, { prompt: "Summarize this for me" }, { summary: "This is a summary." });
        } catch (e) {
            console.error(e);
            setError("Failed to add AI request.");
        }
    };
    
    if (authLoading || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader className="h-10 w-10 animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-center text-destructive">{error}</div>;
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-bold">Firestore Real-time Example</h1>
            <div className="flex gap-4">
                <Button onClick={handleAddGraph}>Add New Graph</Button>
                <Button onClick={handleAddAiRequest}>Add New AI Request</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>My Graphs</CardTitle>
                        <CardDescription>This list updates in real-time from Firestore.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {graphs.map(graph => (
                                <li key={graph.id} className="p-2 border rounded">
                                    <p className="font-semibold">{graph.title}</p>
                                    <p className="text-sm text-muted-foreground">ID: {graph.id}</p>
                                    <p className="text-sm text-muted-foreground">Data: {JSON.stringify(graph.data)}</p>
                                </li>
                            ))}
                        </ul>
                        {graphs.length === 0 && <p className="text-muted-foreground">No graphs yet.</p>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>My AI Requests</CardTitle>
                        <CardDescription>This list updates in real-time from Firestore.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {aiRequests.map(req => (
                                <li key={req.id} className="p-2 border rounded">
                                    <p className="font-semibold">Request ID: {req.id}</p>
                                    <p className="text-sm text-muted-foreground">Input: {JSON.stringify(req.input)}</p>
                                </li>
                            ))}
                        </ul>
                         {aiRequests.length === 0 && <p className="text-muted-foreground">No AI requests yet.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
