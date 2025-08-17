
'use client';

import { useFormContext } from 'react-hook-form';
import { CheckoutFormData } from '../checkout-page';

export default function ReviewStep() {
    const { getValues } = useFormContext<CheckoutFormData>();
    const values = getValues();

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Review Your Order</h3>
            <div className="space-y-4 rounded-md border bg-secondary/50 p-4">
                <div>
                    <h4 className="font-medium text-muted-foreground">Account</h4>
                    <p>{values.fullName}</p>
                    <p>{values.email}</p>
                </div>
                 <div>
                    <h4 className="font-medium text-muted-foreground">Billing Address</h4>
                    <p>{values.address}</p>
                    <p>{values.city}, {values.zip}</p>
                    <p>{values.country}</p>
                </div>
                 <div>
                    <h4 className="font-medium text-muted-foreground">Payment</h4>
                    <p>Card ending in •••• {values.cardNumber.slice(-4)}</p>
                </div>
            </div>
            <p className="text-sm text-muted-foreground">
                By clicking "Confirm & Pay", you agree to our Terms of Service and Privacy Policy. Your subscription will renew automatically.
            </p>
        </div>
    );
}
