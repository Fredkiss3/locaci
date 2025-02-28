import * as React from 'react';
import type { WeighedIconProps } from './types';

export function LinkIcon({ weight = 'regular', ...props }: WeighedIconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path
                    d="M122.3,71.4l19.8-19.8a44.1,44.1,0,0,1,62.3,62.3l-28.3,28.2a43.9,43.9,0,0,1-62.2,0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></path>
                <path
                    d="M133.7,184.6l-19.8,19.8a44.1,44.1,0,0,1-62.3-62.3l28.3-28.2a43.9,43.9,0,0,1,62.2,0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={weight === 'bold' ? '24' : '16'}></path>
            </svg>
        </>
    );
}
