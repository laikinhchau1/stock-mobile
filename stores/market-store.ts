import { create } from 'zustand';

interface StockQuote {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
    open: number;
    updatedAt: Date;
}

interface MarketState {
    quotes: Map<string, StockQuote>;
    watchedSymbols: Set<string>;
    isConnected: boolean;
    lastUpdate: Date | null;

    // Actions
    updateQuote: (quote: StockQuote) => void;
    updateQuotes: (quotes: StockQuote[]) => void;
    addWatchedSymbol: (symbol: string) => void;
    removeWatchedSymbol: (symbol: string) => void;
    setWatchedSymbols: (symbols: string[]) => void;
    setConnected: (connected: boolean) => void;
    getQuote: (symbol: string) => StockQuote | undefined;
}

export const useMarketStore = create<MarketState>((set, get) => ({
    quotes: new Map(),
    watchedSymbols: new Set(),
    isConnected: false,
    lastUpdate: null,

    updateQuote: (quote) => {
        set((state) => {
            const newQuotes = new Map(state.quotes);
            newQuotes.set(quote.symbol, quote);
            return { quotes: newQuotes, lastUpdate: new Date() };
        });
    },

    updateQuotes: (quotes) => {
        set((state) => {
            const newQuotes = new Map(state.quotes);
            quotes.forEach((quote) => {
                newQuotes.set(quote.symbol, quote);
            });
            return { quotes: newQuotes, lastUpdate: new Date() };
        });
    },

    addWatchedSymbol: (symbol) => {
        set((state) => {
            const newWatched = new Set(state.watchedSymbols);
            newWatched.add(symbol.toUpperCase());
            return { watchedSymbols: newWatched };
        });
    },

    removeWatchedSymbol: (symbol) => {
        set((state) => {
            const newWatched = new Set(state.watchedSymbols);
            newWatched.delete(symbol.toUpperCase());
            return { watchedSymbols: newWatched };
        });
    },

    setWatchedSymbols: (symbols) => {
        set({ watchedSymbols: new Set(symbols.map((s) => s.toUpperCase())) });
    },

    setConnected: (isConnected) => {
        set({ isConnected });
    },

    getQuote: (symbol) => {
        return get().quotes.get(symbol.toUpperCase());
    },
}));
