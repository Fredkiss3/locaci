import * as React from 'react';
import { IconProps } from './types';

export function BathtubIcon({ ...props }: IconProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                {...props}
                fill="currentColor"
                viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect>
                <path
                    d="M232,104H200v40H136V104H24a8,8,0,0,0-8,8v32a48,48,0,0,0,48,48H192a48,48,0,0,0,48-48V112A8,8,0,0,0,232,104Z"
                    opacity="0.2"></path>
                <line
                    x1="72"
                    y1="192"
                    x2="72"
                    y2="216"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <line
                    x1="184"
                    y1="192"
                    x2="184"
                    y2="216"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></line>
                <path
                    d="M56,104V52a20,20,0,0,1,40,0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
                <rect
                    x="136"
                    y="96"
                    width="64"
                    height="48"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></rect>
                <path
                    d="M200,104h32a8,8,0,0,1,8,8v32a48,48,0,0,1-48,48H64a48,48,0,0,1-48-48V112a8,8,0,0,1,8-8H136"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"></path>
            </svg>
        </>
    );
}
