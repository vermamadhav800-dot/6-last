
"use client";

import DownloadPage from '@/components/DownloadPage';
import { Suspense } from 'react';

function Download() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DownloadPage />
        </Suspense>
    );
}

export default Download;
