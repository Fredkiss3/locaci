'use client';
import * as React from 'react';

// utils
import dynamic from 'next/dynamic';

// types
import type { BottomSheetProps } from '@locaci/ui/components/atoms/bottom-sheet';

const BottomSheet = dynamic(
    () => import(`@locaci/ui/components/atoms/bottom-sheet`),
    {
        ssr: false,
        loading: () => <></>
    }
);

export function LazyBottomSheet(props: BottomSheetProps) {
    return <BottomSheet {...props} />;
}
