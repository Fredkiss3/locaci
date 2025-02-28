import * as React from 'react';
import { IconProps } from './types';

export function CaretDoubleRightIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <polyline
                    points="56 48 136 128 56 208"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"></polyline>
                <polyline
                    points="136 48 216 128 136 208"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"></polyline>
            </svg>
        </>
    );
}
