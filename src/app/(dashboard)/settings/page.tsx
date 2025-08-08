
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthContext } from "@/context/auth-context";

export default function SettingsPage() {
    const { user } = useAuthContext();
    
    return (
        <div className="container mx-auto max-w-3xl py-8 px-4">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
            
            <div className="space-y-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>This is how your name and email will appear.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user?.displayName || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

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
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <Button>Change Password</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
