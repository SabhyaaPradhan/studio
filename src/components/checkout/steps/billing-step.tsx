
'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BillingStep() {
    const { control } = useFormContext();

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Billing Information</h3>
             <FormField
                control={control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <Label htmlFor="address">Address</Label>
                        <FormControl>
                            <Input id="address" placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="city">City</Label>
                            <FormControl>
                               <Input id="city" placeholder="Anytown" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="zip"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="zip">ZIP / Postal Code</Label>
                            <FormControl>
                                <Input id="zip" placeholder="12345" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                        <Label htmlFor="country">Country</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                               <SelectTrigger id="country">
                                    <SelectValue placeholder="Select a country" />
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
        </div>
    );
}
