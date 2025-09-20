
"use client";

import { useEffect, useRef } from "react";

const AuthBackground = () => {
    const bgRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!bgRef.current) return;
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
            const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1

            bgRef.current.style.transform = `translateX(${x * 15}px) translateY(${y * 15}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const starLayers = [
        { numStars: 400, size: 1, speed: 500, twinkleSpeed: 7 },
        { numStars: 150, size: 1.5, speed: 300, twinkleSpeed: 5 },
        { numStars: 50, size: 2, speed: 150, twinkleSpeed: 3 },
    ];

    return (
        <div ref={bgRef} className="animated-bg-container">
            <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => {
                    const seed = i * 137.508;
                    const top = (Math.sin(seed) * 50 + 50) % 100;
                    const left = (Math.cos(seed) * 50 + 50) % 100;
                    const animationDelay = (i * 0.1) % 3;
                    const animationDuration = 3 + (i % 3);
                    
                    return (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-60 animate-pulse"
                            style={{ top: `${top}%`, left: `${left}%`, animationDelay: `${animationDelay}s`, animationDuration: `${animationDuration}s` }}
                        />
                    );
                })}
            </div>
            <div className="absolute inset-0 opacity-10">
                <div className="grid-pattern"></div>
            </div>
            {starLayers.map((layer, i) => (
                <div key={i} className="stars-layer" style={{ animationDuration: `${layer.speed}s` }}>
                    {Array.from({ length: layer.numStars }).map((_, j) => {
                        const duplicate = j >= layer.numStars / 2;
                        let leftPosition = Math.random() * 100;
                        if (duplicate) leftPosition += 100;

                        return (
                            <div 
                                key={j}
                                className="star"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${leftPosition}%`,
                                    width: `${layer.size}px`,
                                    height: `${layer.size}px`,
                                    animationDelay: `${Math.random() * layer.twinkleSpeed}s, ${Math.random() * layer.speed}s`,
                                    animationDuration: `${layer.twinkleSpeed}s, ${layer.speed}s`,
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default AuthBackground;
