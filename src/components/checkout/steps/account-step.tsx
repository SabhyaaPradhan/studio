
'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

export default function AccountStep() {
    const { control } = useFormContext();

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Account Information</h3>
            <FormField
                control={control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                        <Label htmlFor="fullName">Full Name</Label>
                        <FormControl>
                            <Input id="fullName" placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <Label htmlFor="email">Email Address</Label>
                        <FormControl>
                           <Input id="email" type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="company"
                render={({ field }) => (
                    <FormItem>
                        <Label htmlFor="company">Company (Optional)</Label>
                        <FormControl>
                            <Input id="company" placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
