import { ReactNode } from 'react';

export type Message = {
    text: string | ReactNode;
    role: 'assistant' | 'system' | 'user';
};
