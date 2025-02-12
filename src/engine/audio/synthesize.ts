import { Note } from "tonal";
import getAudioContext from "./getAudioContext";

export default function synthesize(note: string, duration: number) {
    return new Promise<void>((resolve) => {
        const audioCtx = getAudioContext();

        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        const freq = Note.get(note).freq;
        if (!freq) {
            throw new Error(`No frequency found for note ${note}`);
        }
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
        oscillator.connect(audioCtx.destination);
        oscillator.start();
    
        setTimeout(() => {
            oscillator.stop();
            resolve();
        }, duration);
    });
}

export async function synthesizeSequence(notes: string[], duration: number) {
    for (let i = 0; i < notes.length; i++) {
        await synthesize(notes[i], duration);
    }
}