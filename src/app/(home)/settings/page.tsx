
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuthContext } from "@/context/auth-context";

export default function SettingsPage() {
    const { user } = useAuthContext();
    
    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings, preferences, and more.</p>
            </div>
            
            <div className="space-y-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>This is how your name and email will appear.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={user?.displayName || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="ca">Canada</SelectItem>
                                    <SelectItem value="gb">United Kingdom</SelectItem>
                                    <SelectItem value="au">Australia</SelectItem>
                                </SelectContent>
                            </Select>
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
