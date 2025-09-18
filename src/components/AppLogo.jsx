
export default function AppLogo({ className, iconClassName, variant = 'default' }) {
    if (variant === 'professional') {
        return (
            <div className={`inline-block ${className}`}>
                <svg viewBox="0 0 140 50" className="w-full h-full">
                    <defs>
                        <linearGradient id="proGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#1e293b' }} /> 
                            <stop offset="100%" style={{ stopColor: '#475569' }} />
                        </linearGradient>
                        <linearGradient id="proAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#3b82f6' }} /> 
                            <stop offset="100%" style={{ stopColor: '#1d4ed8' }} />
                        </linearGradient>
                        <linearGradient id="proGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} /> 
                            <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 0.1 }} />
                        </linearGradient>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Professional Building Icon */}
                    <g transform="translate(8, 8)">
                        {/* Main Building Structure */}
                        <rect 
                            x="0" y="8" width="24" height="26" rx="3" ry="3"
                            fill="none" 
                            stroke="url(#proGradient)" 
                            strokeWidth="2.5"
                            filter="url(#glow)"
                        />
                        
                        {/* Building Floors */}
                        <line x1="3" y1="16" x2="21" y2="16" stroke="url(#proGradient)" strokeWidth="1.5"/>
                        <line x1="3" y1="20" x2="21" y2="20" stroke="url(#proGradient)" strokeWidth="1.5"/>
                        <line x1="3" y1="24" x2="21" y2="24" stroke="url(#proGradient)" strokeWidth="1.5"/>
                        <line x1="3" y1="28" x2="21" y2="28" stroke="url(#proGradient)" strokeWidth="1.5"/>
                        
                        {/* Central Hub */}
                        <circle cx="12" cy="18" r="4" fill="url(#proAccent)" opacity="0.9"/>
                        <circle cx="12" cy="18" r="2" fill="white" opacity="0.95"/>
                        
                        {/* Connection Points */}
                        <circle cx="6" cy="18" r="1.5" fill="url(#proGradient)"/>
                        <circle cx="18" cy="18" r="1.5" fill="url(#proGradient)"/>
                        <circle cx="12" cy="12" r="1.5" fill="url(#proGradient)"/>
                        <circle cx="12" cy="24" r="1.5" fill="url(#proGradient)"/>
                        
                        {/* Connection Lines */}
                        <line x1="6" y1="18" x2="8" y2="18" stroke="url(#proGradient)" strokeWidth="1" opacity="0.6"/>
                        <line x1="16" y1="18" x2="18" y2="18" stroke="url(#proGradient)" strokeWidth="1" opacity="0.6"/>
                        <line x1="12" y1="12" x2="12" y2="14" stroke="url(#proGradient)" strokeWidth="1" opacity="0.6"/>
                        <line x1="12" y1="22" x2="12" y2="24" stroke="url(#proGradient)" strokeWidth="1" opacity="0.6"/>
                    </g>

                    {/* Professional Text */}
                    <text x="45" y="18" fontSize="16" fontWeight="800" fill="url(#proGradient)" fontFamily="Inter, sans-serif" letterSpacing="1px">
                        ESTATEFLOW
                    </text>
                    <text x="45" y="32" fontSize="10" fontWeight="600" fill="url(#proAccent)" fontFamily="Inter, sans-serif" letterSpacing="2px">
                        PROFESSIONAL
                    </text>
                </svg>
            </div>
        );
    }

    if (variant === 'minimal') {
        return (
            <div className={`inline-block ${className}`}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#1e293b' }} /> 
                            <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
                        </linearGradient>
                    </defs>
                    
                    {/* Minimal Building */}
                    <rect x="20" y="30" width="60" height="50" rx="4" fill="none" stroke="url(#minimalGradient)" strokeWidth="3"/>
                    <rect x="25" y="40" width="50" height="3" fill="url(#minimalGradient)" opacity="0.7"/>
                    <rect x="25" y="50" width="50" height="3" fill="url(#minimalGradient)" opacity="0.7"/>
                    <rect x="25" y="60" width="50" height="3" fill="url(#minimalGradient)" opacity="0.7"/>
                    <circle cx="50" cy="55" r="6" fill="url(#minimalGradient)"/>
                </svg>
            </div>
        );
    }

    // Default colorful logo
    return (
        <div className={`inline-block ${className}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#6366f1' }} /> 
                        <stop offset="50%" style={{ stopColor: '#8b5cf6' }} />
                        <stop offset="100%" style={{ stopColor: '#ec4899' }} />
                    </linearGradient>
                    <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#06b6d4' }} /> 
                        <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
                    </linearGradient>
                    <linearGradient id="logoGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#f59e0b' }} /> 
                        <stop offset="100%" style={{ stopColor: '#ef4444' }} />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Main Building Structure - Modern High-tech Design */}
                <rect 
                    x="15" y="25" width="70" height="55" rx="8" ry="8"
                    fill="none" 
                    stroke="url(#logoGradient)" 
                    strokeWidth="6"
                    filter="url(#glow)"
                />

                {/* Building Floors - Representing Multiple Properties */}
                <rect x="20" y="35" width="60" height="3" fill="url(#logoGradient2)" opacity="0.8"/>
                <rect x="20" y="45" width="60" height="3" fill="url(#logoGradient2)" opacity="0.8"/>
                <rect x="20" y="55" width="60" height="3" fill="url(#logoGradient2)" opacity="0.8"/>
                <rect x="20" y="65" width="60" height="3" fill="url(#logoGradient2)" opacity="0.8"/>

                {/* Digital Data Flow Lines */}
                <path 
                    d="M25,30 Q35,20 45,30 T65,30 T85,30" 
                    fill="none" 
                    stroke="url(#logoGradient3)" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.9"
                />
                <path 
                    d="M25,40 Q35,35 45,40 T65,40 T85,40" 
                    fill="none" 
                    stroke="url(#logoGradient3)" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.7"
                />

                {/* Central Hub - Management Center */}
                <circle cx="50" cy="50" r="8" fill="url(#logoGradient)" opacity="0.9"/>
                <circle cx="50" cy="50" r="4" fill="white" opacity="0.8"/>

                {/* Connection Nodes */}
                <circle cx="30" cy="50" r="3" fill="url(#logoGradient2)" opacity="0.8"/>
                <circle cx="70" cy="50" r="3" fill="url(#logoGradient2)" opacity="0.8"/>
                <circle cx="50" cy="30" r="3" fill="url(#logoGradient2)" opacity="0.8"/>
                <circle cx="50" cy="70" r="3" fill="url(#logoGradient2)" opacity="0.8"/>

                {/* Connection Lines */}
                <line x1="30" y1="50" x2="42" y2="50" stroke="url(#logoGradient2)" strokeWidth="2" opacity="0.6"/>
                <line x1="58" y1="50" x2="70" y2="50" stroke="url(#logoGradient2)" strokeWidth="2" opacity="0.6"/>
                <line x1="50" y1="30" x2="50" y2="42" stroke="url(#logoGradient2)" strokeWidth="2" opacity="0.6"/>
                <line x1="50" y1="58" x2="50" y2="70" stroke="url(#logoGradient2)" strokeWidth="2" opacity="0.6"/>

                {/* Tech Accent - Digital Elements */}
                <rect x="25" y="15" width="8" height="2" fill="url(#logoGradient3)" rx="1"/>
                <rect x="35" y="15" width="6" height="2" fill="url(#logoGradient3)" rx="1"/>
                <rect x="43" y="15" width="4" height="2" fill="url(#logoGradient3)" rx="1"/>
                <rect x="49" y="15" width="6" height="2" fill="url(#logoGradient3)" rx="1"/>
                <rect x="57" y="15" width="8" height="2" fill="url(#logoGradient3)" rx="1"/>
                <rect x="67" y="15" width="6" height="2" fill="url(#logoGradient3)" rx="1"/>
            </svg>
        </div>
    );
}
