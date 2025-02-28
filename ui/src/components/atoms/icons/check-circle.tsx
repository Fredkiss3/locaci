import * as React from 'react';
import type { WeighedIconProps } from './types';

export function CheckCircleIcon({
    weight = 'regular',
    ...props
}: WeighedIconProps) {
    return (
        <>
            {weight === 'fill' ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path>
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    {...props}
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <polyline
                        points="172 104 113.3 160 84 132"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={
                            weight === 'regular' ? '16' : '24'
                        }></polyline>
                    <circle
                        cx="128"
                        cy="128"
                        r="96"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={
                            weight === 'regular' ? '16' : '24'
                        }></circle>
                </svg>
            )}
        </>
    );
}
