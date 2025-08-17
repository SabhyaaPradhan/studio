
'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';

export default function PaymentStep() {
    const { control } = useFormContext();

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Payment Details</h3>
            <FormField
                control={control}
                name="cardName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                            <Input id="cardName" placeholder="John M. Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="cardNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                           <Input id="cardNumber" placeholder="•••• •••• •••• ••••" {...field} maxLength={16} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={control}
                    name="expiry"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expiry (MM/YY)</FormLabel>
                            <FormControl>
                                <Input id="expiry" placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="cvv"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                                <Input id="cvv" placeholder="123" {...field} maxLength={3} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <div className="mt-4 p-3 bg-secondary/50 rounded-md text-center text-sm text-muted-foreground">
                This is a mock payment form. No real transaction will occur.
            </div>
        </div>
    );
}
