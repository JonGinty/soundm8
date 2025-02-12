


type TextGameSettings = {
    mode: "treble" | "bass",
    sfx: boolean,
    highestNote: string,
    lowestNote: string,
    scale: "C major" | "A minor", // text game will only support keys with no sharps
    noteCount: number,
    maxInterval: number
}

export default TextGameSettings;