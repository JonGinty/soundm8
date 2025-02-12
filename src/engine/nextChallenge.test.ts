
import { test, expect, vi } from 'vitest';
import nextChallenge from './nextChallenge';
import * as randomNote from './randomNote';

test("note stuff", () => {
    
    //const scale = Scale.get("c major")
    //const v = Interval.distance("C", "C2")

    //const v = Range.chromatic(["C4", "C2"])
    //const v = Scale.rangeOf("C major")("C0", "C3")
    //const v = Interval.get(Interval.distance("C1", "C2")).num;
    const v = "";
    expect(v).toEqual("")
})

test("nextChallenge", async () => {
    // Arrange

    // mock some notes
    const mockValues = ["C1", "C2", "A1", "B1"];
    let callIndex = 0;
    vi.spyOn(randomNote, 'default').mockImplementation(() => mockValues[callIndex++]);

    // Act
    const val = await nextChallenge({
        scale: "C major",
        lowestNote: "C1",
        highestNote: "C5",
        noteCount: 3,
        maxInterval: 7
    })

    // Assert
    expect(val).toEqual(["C1", "A1", "B1"]); // C2 is not in the range
})