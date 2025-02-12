import { useState } from 'react';
import nextChallenge from '../../engine/nextChallenge';
import Notation from '../Notation/Notation';
import styles from './TextGame.module.css'
import { Button, TextInput, Stack, Flex } from '@mantine/core';
import synthesize, { synthesizeSequence } from '../../engine/audio/synthesize';
import TextGameSettings from './TextGame.settings';

const TextGame = ({ mode, highestNote, lowestNote, noteCount, maxInterval }: TextGameSettings) => {
    const [seq, setSeq] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
    const [correct, setCorrect] = useState<string>("");
    const [incorrect, setIncorrect] = useState<string>("");
    const [score, setScore] = useState<number>(0)

    // const highestNote = mode === "treble" ? "C6" : "C4";
    // const lowestNote = mode === "treble" ? "C4" : "C2";

    const soundOn = true;

    const next = async () => {
        const challenge = await nextChallenge({
            scale: "C major",
            highestNote,
            lowestNote,
            noteCount,
            maxInterval
        })


        setCorrect("");
        setIncorrect("");
        setInput("");
        setSeq(challenge);
        //await synthesizeSequence(challenge, 400);
    }

    const isSameNote = (userInput: string, tonalNote: string) => {
        return userInput.toUpperCase() === tonalNote[0];
    }

    if (input) {
        if (isSameNote(input, seq[correct.length])) {
            setCorrect(correct + input);
            setIncorrect("");
            setScore(score + 10);
            if (soundOn) synthesize(seq[correct.length], 200)
            if (correct.length >= seq.length - 1) {
                next();
            }
        } else {
            setScore(score - 10);
            setIncorrect(input);
            if (soundOn) synthesizeSequence(["G4", "C3", "G3", "C2",], 100)
        }
        setInput("");
    }

    if (!seq?.length) {
        next()
    }

    const skip = () => {
        setScore(score - 10);
        next();
    }

    return (
        <div style={{display: "flex", justifyContent: "center", textAlign:"center"}}>
            <Stack style={{maxWidth: "200px"}}>
                <h1>Text Mode</h1>
                <Stack style={{ "flexGrow": 1 }}>
                    <Notation sequence={seq} clef={mode} />
                    <p>
                        <span style={{ color: "#11cc88" }}>{correct}</span>
                        <span style={{ color: "red" }}>{incorrect}</span>
                        {/* just allocating the space here so it doesn't grow */}
                        <span style={{ visibility: "hidden" }}>|</span></p>
                    <p>Score: {score}</p>
                </Stack>
                <Stack>
                    <TextInput type="text" placeholder='type your answer here' value={input} onChange={(e) => setInput(e.target.value)} />
                    <Button fullWidth variant='outline' onClick={skip}>skip (-10)</Button>
                </Stack>
            </Stack>
        </div>
    )
}

export default TextGame;