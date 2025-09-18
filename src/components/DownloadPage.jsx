
"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download as DownloadIcon, FileText, AlertTriangle } from 'lucide-react';

function DownloadPage() {
    const searchParams = useSearchParams();
    const fileUrl = searchParams.get('fileUrl');
    const fileName = searchParams.get('fileName');

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center dark-bg-futuristic animated-bg p-4">
            <Card className="w-full max-w-md shadow-2xl animate-fade-in-scale glass-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl md:text-3xl font-headline gradient-text">Download Your Report</CardTitle>
                    <CardDescription className="text-muted-foreground/80">
                        Your generated report is ready for download.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    {fileUrl ? (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-lg border border-white/10">
                                <FileText className="w-16 h-16 text-blue-400 mb-4" />
                                <p className="text-lg font-semibold text-white/90">{fileName || 'Report'}</p>
                                <p className="text-sm text-muted-foreground">Click the button below to start the download.</p>
                            </div>
                            <Button onClick={handleDownload} className="w-full py-6 text-lg btn-gradient-glow">
                                <DownloadIcon className="mr-2 h-5 w-5" />
                                Download Now
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 bg-red-500/10 rounded-lg border border-red-400/30">
                            <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
                            <p className="text-lg font-semibold text-white/90">No File to Download</p>
                            <p className="text-sm text-muted-foreground">It seems there was an error generating the file link. Please go back and try again.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default DownloadPage;
