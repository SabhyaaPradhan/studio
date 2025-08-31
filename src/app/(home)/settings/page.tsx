
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuthContext } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { updateUserProfile, listenToUser, UserProfile } from "@/services/user-service";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const settingsSchema = z.object({
    displayName: z.string().min(2, "Full name must be at least 2 characters."),
    country: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;


export default function SettingsPage() {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const form = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            displayName: "",
            country: "",
        },
    });

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            const unsubscribe = listenToUser(user.uid, (profile) => {
                setUserProfile(profile);
                form.reset({
                    displayName: user.displayName || "",
                    country: (profile as any).country || "", // Assuming country is a field
                });
                setIsLoading(false);
            }, (error) => {
                console.error(error);
                setIsLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user, form]);
    
    const onSubmit = async (data: SettingsFormData) => {
        if (!user) {
            toast({ variant: "destructive", title: "Not authenticated" });
            return;
        }

        setIsSaving(true);
        try {
            await updateUserProfile(user, {
                displayName: data.displayName,
                country: data.country,
            });
            toast({ title: "Success", description: "Your profile has been updated." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings, preferences, and more.</p>
            </div>
            
            <div className="space-y-12">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>This is how your name and email will appear.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-24 mt-4" />
                                    </>
                                ) : (
                                    <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="displayName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Your name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                                        </div>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select your country" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="us">United States</SelectItem>
                                                        <SelectItem value="ca">Canada</SelectItem>
                                                        <SelectItem value="gb">United Kingdom</SelectItem>
                                                        <SelectItem value="au">Australia</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </form>
                </Form>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage your email notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                           <div>
                                <h3 className="font-medium">AI Summaries</h3>
                                <p className="text-sm text-muted-foreground">Receive weekly summaries of AI conversations.</p>
                           </div>
                           <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                           <div>
                                <h3 className="font-medium">Product Updates</h3>
                                <p className="text-sm text-muted-foreground">Get notified about new features and updates.</p>
                           </div>
                           <Switch />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" placeholder="••••••••" />
                        </div>
                        <Button>Change Password</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
