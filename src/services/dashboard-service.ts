
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

type Activity = {
    icon: Icon;
    text: string;
    time: string;
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
    activityFeed: Activity[];
    announcements: Announcement[];
}

// --- Mock Data Generators ---

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRepliesToday = (): StatCardData => {
    const replies = getRandomInt(30, 150);
    const change = getRandomInt(-20, 20);
    return {
        value: replies,
        change: `${change >= 0 ? '+' : ''}${change} from yesterday`,
    };
};

const generateKnowledgeSources = (graphs: Graph[]): StatCardData => {
    const sources = graphs.length;
    // This logic can be improved to track changes over time
    const change = `+0 this week`;
    return {
        value: sources,
        change: change,
    };
}


const generateUsageChartData = (): ChartData<{ name: string; value: number }> => {
    return {
        data: [
            { name: 'General', value: getRandomInt(200, 600) },
            { name: 'E-commerce', value: getRandomInt(100, 400) },
            { name: 'Coaching', value: getRandomInt(100, 400) },
            { name: 'SaaS Support', value: getRandomInt(50, 300) },
        ],
    };
};

const generateConfidenceChartData = (): ChartData<{ day: string; confidence: number; count: number }> => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
        data: days.map(day => ({
            day,
            confidence: getRandomInt(75, 98),
            count: getRandomInt(5, 40),
        })),
    };
}

const generateActivityFeed = (): Activity[] => {
    const activities: Activity[] = [
        { icon: MessageSquare, text: `New AI reply generated to user '#${getRandomInt(1000,9999)}'`, time: "2m ago" },
        { icon: BrainCircuit, text: "Knowledge source 'Product FAQ.pdf' was updated", time: "1h ago" },
        { icon: Settings, text: "Your profile information was updated", time: "3h ago" },
        { icon: DollarSign, text: "Your plan has been upgraded to 'Pro'", time: "1d ago" },
    ];
    // Randomize order a bit
    return activities.sort(() => Math.random() - 0.5);
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
    console.log("Fetching dashboard data...");

    return new Promise((resolve) => {
        setTimeout(() => {
            const data = {
                activityFeed: generateActivityFeed(),
                announcements: generateAnnouncements(),
            };
            
            console.log("Dashboard data fetched successfully.");
            resolve(data);

        }, getRandomInt(500, 1500)); // Simulate network latency
    });
};
