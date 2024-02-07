export type Reset = { name: string; interval: 'daily' | 'weekly'; hourOffset: number };

export type Todo = { text: string; lastDone: Date | undefined; reset: Reset };
