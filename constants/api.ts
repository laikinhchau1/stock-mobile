const API_BASE_URL = 'http://localhost:3000/api';
const WS_BASE_URL = 'ws://localhost:3000';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    ME: `${API_BASE_URL}/auth/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,

    // Portfolio
    PORTFOLIOS: `${API_BASE_URL}/portfolios`,
    PORTFOLIO_SUMMARY: `${API_BASE_URL}/portfolios/summary`,

    // Market
    MARKET_INDICES: `${API_BASE_URL}/market/indices`,
    MARKET_QUOTE: (symbol: string) => `${API_BASE_URL}/market/quote/${symbol}`,
    MARKET_QUOTES: `${API_BASE_URL}/market/quotes`,
    MARKET_HISTORY: (symbol: string) => `${API_BASE_URL}/market/history/${symbol}`,
    MARKET_COMPANY: (symbol: string) => `${API_BASE_URL}/market/company/${symbol}`,
    MARKET_TECHNICAL: (symbol: string) => `${API_BASE_URL}/market/technical/${symbol}`,
    MARKET_TOP_GAINERS: `${API_BASE_URL}/market/top/gainers`,
    MARKET_TOP_LOSERS: `${API_BASE_URL}/market/top/losers`,
    MARKET_MOST_ACTIVE: `${API_BASE_URL}/market/top/active`,
    MARKET_SEARCH: `${API_BASE_URL}/market/search`,

    // Watchlist
    WATCHLISTS: `${API_BASE_URL}/watchlists`,

    // Alerts
    ALERTS: `${API_BASE_URL}/alerts`,
    ALERTS_ACTIVE: `${API_BASE_URL}/alerts/active`,
    ALERTS_TRIGGERED: `${API_BASE_URL}/alerts/triggered`,

    // Community
    POSTS: `${API_BASE_URL}/community/posts`,
    POSTS_ANALYSIS: `${API_BASE_URL}/community/posts/analysis`,
    POSTS_NEWS: `${API_BASE_URL}/community/posts/news`,
    POSTS_EDUCATION: `${API_BASE_URL}/community/posts/education`,
    MY_POSTS: `${API_BASE_URL}/community/my-posts`,

    // Events
    EVENTS: `${API_BASE_URL}/events`,
    EVENTS_UPCOMING: `${API_BASE_URL}/events/upcoming`,
    EVENTS_DIVIDENDS: `${API_BASE_URL}/events/dividends`,
    EVENTS_EARNINGS: `${API_BASE_URL}/events/earnings`,
    EVENTS_CALENDAR: (year: number, month: number) =>
        `${API_BASE_URL}/events/calendar/${year}/${month}`,
};

export const WS_ENDPOINTS = {
    MARKET: `${WS_BASE_URL}/market`,
};

export { API_BASE_URL, WS_BASE_URL };
