import { Scale, Interval } from "tonal"
import randomNote from "./randomNote";

export default async function nextChallenge(ops: NextChallengeOptions) {
    
    //const scale = Scale.get(ops.scale)
    const availableNotes = Scale.rangeOf(ops.scale)(ops.lowestNote, ops.highestNote).filter(n => n !== undefined) as string[];
    const result: string[] = [];


    for (let i = 0; i < ops.noteCount; i++) {
        let note = randomNote(availableNotes);

        let panic = 0;
        while (i > 0 && ops.maxInterval && (panic++ > 100 || !isInRange(result[i - 1], note, ops.maxInterval))) {
            note = randomNote(availableNotes);
        }

        result.push(note);
    }
    
    return result;
}

function isInRange(lastNote: string, thisNote: string, maxInterval: number) {
    const interval = Interval.distance(lastNote, thisNote);
    const distance = Math.abs(Interval.get(interval).num);
    return distance <= maxInterval;
}


export type NextChallengeOptions = {
    scale: string;
    lowestNote: string;
    highestNote: string;
    noteCount: number;
    maxInterval?: number;
}
