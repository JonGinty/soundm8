import { Button, Fieldset, Group, Input, Select, Slider, Stack, Switch } from "@mantine/core";
import TextGameSettings from "./TextGame.settings";
import NoteRange from "../NoteRange/NoteRange";
import { synthesizeSequence } from "../../engine/audio/synthesize";


const TextGameConfig = ({ settings, handleChange }: TextGameConfigProps) => {

    const makeChange = (setting: keyof TextGameSettings) => {
        return (v: any) => {
            const val: Partial<TextGameSettings> = {};
            val[setting] = v;
            handleChange({ ...settings, ...val })
        }
    }

    const testSfx = async () => {
        try {
            await synthesizeSequence(["C4", "E4", "G4", "C5"], 100);
        } catch (e: unknown) {
            alert("Error playing sound: " + e);
        }
    }
    
    return (
        <Fieldset m="xs" legend="Settings">
            <Stack>
                <Select label="Scale" data={["C major", "A minor"]} value={settings.scale} onChange={makeChange("scale")}></Select>
                <Input.Wrapper label={"Notes per round: " + settings.noteCount}><Slider value={settings.noteCount} max={10} min={1} onChange={makeChange("noteCount")}></Slider></Input.Wrapper>
                <Input.Wrapper label="Sound effects (may be loud!)">
                    <Group>
                        <Switch checked={settings.sfx} onChange={() => handleChange({...settings, sfx: !settings.sfx})} ></Switch>
                        <Button variant="subtle" onClick={() => testSfx()}>Test</Button>
                    </Group>
                </Input.Wrapper>
                <Input.Wrapper label={`Note range: (${settings.lowestNote} - ${settings.highestNote})`}><NoteRange lowest={settings.lowestNote} highest={settings.highestNote} lowChange={makeChange("lowestNote")} highChange={makeChange("highestNote")}></NoteRange></Input.Wrapper>
                <Input.Wrapper label={"Max interval between notes: " + settings.maxInterval}><Slider value={settings.maxInterval} max={100} min={1} onChange={makeChange("maxInterval")}></Slider></Input.Wrapper>
            </Stack>
        </Fieldset>
    )
}

type TextGameConfigProps = {
    settings: TextGameSettings,
    handleChange: (newSettings: TextGameSettings) => void
}

export default TextGameConfig;