
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

export default function SuccessStep() {
    const containerRef = useRef<HTMLDivElement>(null);
    const checkmarkRef = useRef<SVGPathElement>(null);
    const router = useRouter();

    useEffect(() => {
        const pathLength = checkmarkRef.current?.getTotalLength() || 0;
        
        gsap.set(checkmarkRef.current, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        });

        gsap.timeline({
            onComplete: () => {
                setTimeout(() => router.push('/dashboard'), 2000);
            }
        })
        .fromTo(containerRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
        .to(checkmarkRef.current, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, "-=0.2")
        .fromTo('.success-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out' });

    }, [router]);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
            <svg className="w-24 h-24 text-green-500" viewBox="0 0 52 52">
                <circle className="stroke-current opacity-20" cx="26" cy="26" r="25" fill="none" strokeWidth="2"/>
                <path ref={checkmarkRef} className="stroke-current" fill="none" strokeWidth="3" strokeLinecap="round" d="M14 27l5.833 5.833L38 20"/>
            </svg>
            <h2 className="text-3xl font-bold mt-6 success-text">Payment Successful!</h2>
            <p className="text-muted-foreground mt-2 success-text">Welcome to your new plan.</p>
            <p className="text-muted-foreground mt-1 success-text">Redirecting you to the dashboard...</p>
        </div>
    );
}
