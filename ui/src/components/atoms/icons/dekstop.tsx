import * as React from 'react';
import { IconProps } from './types';

export function DesktopIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                {...props}
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor">
                <path d="M26 2a1 1 0 0 1 .922.612l.04.113 2 7a1 1 0 0 1-.847 1.269L28 11h-3v5h6v2h-2v13h-2l.001-2.536a3.976 3.976 0 0 1-1.73.527L25 29H7a3.982 3.982 0 0 1-2-.535V31H3V18H1v-2h5v-4a1 1 0 0 1 .883-.993L7 11h.238L6.086 8.406l1.828-.812L9.427 11H12a1 1 0 0 1 .993.883L13 12v4h10v-5h-3a1 1 0 0 1-.987-1.162l.025-.113 2-7a1 1 0 0 1 .842-.718L22 2h4zm1 16H5v7a2 2 0 0 0 1.697 1.977l.154.018L7 27h18a2 2 0 0 0 1.995-1.85L27 25v-7zm-16-5H8v3h3v-3zm14.245-9h-2.491l-1.429 5h5.349l-1.429-5z"></path>
            </svg>
        </>
    );
}
