
import { MessageSquare, BrainCircuit, Settings, DollarSign, Lightbulb, Newspaper, Icon } from 'lucide-react';

// --- Types ---

type StatCard = {
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
        repliesToday: StatCard;
        plan: StatCard;
        knowledgeSources: StatCard;
        trialEnds: StatCard;
    };
    charts: {
        replies: ChartData<{ date: string; replies: number }>;
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

const generateRepliesToday = (): StatCard => {
    const replies = getRandomInt(30, 150);
    const change = getRandomInt(-20, 20);
    return {
        value: replies,
        change: `${change >= 0 ? '+' : ''}${change} from yesterday`,
    };
};

const generatePlan = (): StatCard => {
    return {
        value: "Enterprise",
        change: "You have access to all features",
    };
}

const generateKnowledgeSources = (): StatCard => {
    const sources = getRandomInt(1, 10);
    const change = getRandomInt(0, 2);
    return {
        value: sources,
        change: `+${change} this week`,
    };
}

const generateTrialEnds = (): StatCard => {
    return {
        value: "N/A",
        change: "",
    }
}

const generateRepliesChartData = (): ChartData<{ date: string; replies: number }> => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
        data: days.map(day => ({
            date: day,
            replies: getRandomInt(20, 100),
        })),
    };
};

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
 * Fetches all data for the main dashboard.
 * In a real application, this would make network requests to a backend.
 * Here, we simulate it with mock data generators and a delay.
 */
export const getDashboardData = (): Promise<DashboardData> => {
    console.log("Fetching dashboard data...");

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate a potential failure
            if (Math.random() < 0.05) { // 5% chance of failure
                console.error("Simulated API error.");
                reject(new Error("A simulated network error occurred. Please try again."));
                return;
            }

            const data: DashboardData = {
                stats: {
                    repliesToday: generateRepliesToday(),
                    plan: generatePlan(),
                    knowledgeSources: generateKnowledgeSources(),
                    trialEnds: generateTrialEnds(),
                },
                charts: {
                    replies: generateRepliesChartData(),
                    usage: generateUsageChartData(),
                    confidence: generateConfidenceChartData(),
                },
                activityFeed: generateActivityFeed(),
                announcements: generateAnnouncements(),
            };
            
            console.log("Dashboard data fetched successfully.");
            resolve(data);

        }, getRandomInt(500, 1500)); // Simulate network latency
    });
};

    