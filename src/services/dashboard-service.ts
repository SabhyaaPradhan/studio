
import { MessageSquare, BrainCircuit, Settings, DollarSign, Lightbulb, Newspaper, Icon } from 'lucide-react';
import { Graph } from './firestore-service';

// --- Types ---

export type StatCardData = {
    value: number | string;
    change: string;
};

type ChartData<T> = {
    data: T[];
};

type Announcement = {
    type: 'feature' | 'tip';
    title: string;
    content: string;
};

export interface DashboardData {
    stats: {
        repliesToday: StatCardData;
        knowledgeSources: StatCardData;
    };
    charts: {
        usage: ChartData<{ name: string; value: number }>;
        confidence: ChartData<{ day: string; confidence: number; count: number }>;
    };
    announcements: Announcement[];
}

// --- Mock Data Generators ---

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateAnnouncements = (): Announcement[] => {
    return [
        { type: "feature", title: "🚀 New Feature: Real-time Analytics!", content: "Enterprise users can now access real-time analytics for deeper insights into customer interactions. Check it out in the new 'Analytics' tab." },
        { type: "tip", title: "💡 Tip of the Week: Train Your Brand Voice", content: "Improve AI consistency by training it on your brand's unique tone. Upload examples of your communication style in the 'Brand Voice' section." }
    ];
};

// --- API Function ---

/**
 * Fetches static or less frequently updated data for the main dashboard.
 * Real-time data like plan and graph info will be fetched directly in the component.
 */
export const getDashboardData = (): Promise<Omit<DashboardData, 'stats' | 'charts'>> => {
    console.log("Fetching static dashboard data...");

    return new Promise((resolve) => {
        setTimeout(() => {
            const data = {
                announcements: generateAnnouncements(),
            };
            
            console.log("Static dashboard data fetched successfully.");
            resolve(data);

        }, getRandomInt(500, 1500)); // Simulate network latency
    });
};
