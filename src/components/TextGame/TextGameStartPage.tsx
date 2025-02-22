import { Button, Stack } from "@mantine/core"
import TextGameConfig from "./TextGameConfig"
import { useState } from "react"
import TextGameSettings from "./TextGame.settings";
import TextGame from "./TextGame";

const TextGameStartPage = () => {
    const [settings, setSettings] = useState<TextGameSettings>({ ...defaultSettings });
    const [playing, setPlaying] = useState<boolean>(false);



    return playing ? (<TextGame {...settings} backClicked={() => setPlaying(false)} ></TextGame>) : (
        
        <>
            <Stack>
                <TextGameConfig settings={settings} handleChange={(s) => setSettings(prev => ({...prev, ...s}))}></TextGameConfig>
                <Button onClick={() => setPlaying(true)}>Start!</Button>
            </Stack>
        </>
    )
}

// todo: persist
const defaultSettings: TextGameSettings = {
    mode: "treble",
    sfx: true,
    highestNote: "C6",
    lowestNote: "C4",
    noteCount: 2,
    maxInterval: 12,
    scale: "C major"
}

export default TextGameStartPage