
"use client";

import { Howl } from 'howler';
import { useEffect, useRef, useCallback } from 'react';

const useSound = (soundUrl, options = {}) => {
    const soundRef = useRef(null);

    useEffect(() => {
        let sound;
        try {
            sound = new Howl({
                src: [soundUrl],
                ...options,
                html5: true, // Enable for broader browser compatibility
            });
            soundRef.current = sound;
        } catch (error) {
            console.warn('Failed to load sound:', error);
        }

        return () => {
            if (sound) {
                sound.unload();
            }
        };
    }, [soundUrl, options.volume, options.rate]); // Re-create Howl instance if essential options change

    const play = useCallback((playOptions) => {
        if (soundRef.current?.state() === 'loaded') {
            soundRef.current.play(playOptions);
        } else if (soundRef.current) {
            soundRef.current.once('load', () => {
                soundRef.current.play(playOptions);
            });
        }
    }, []);

    const stop = useCallback(() => {
        if (soundRef.current) {
            soundRef.current.stop();
        }
    }, []);

    const pause = useCallback(() => {
        if (soundRef.current) {
            soundRef.current.pause();
        }
    }, []);

    return { play, stop, pause, sound: soundRef.current };
};

export default useSound;
