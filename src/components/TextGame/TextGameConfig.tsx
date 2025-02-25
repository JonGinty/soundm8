import {
  Button,
  Fieldset,
  Group,
  Input,
  Select,
  Stack,
  Switch,
} from '@mantine/core'
import TextGameSettings, {
  TextGameInputMode,
  TextGameMode,
  TextGameScale,
} from './TextGame.settings'
import NoteRange from '../NoteRange/NoteRange'
import { synthesizeSequence } from '../../engine/audio/synthesize'
import calculateLedgerLines from '../../engine/notation/calculateLedgerLines'
import { useId } from 'react'
import SliderWithLabel from '../SliderWithLabel'

const TextGameConfig = ({ settings, handleChange }: TextGameConfigProps) => {
  const testSfx = async () => {
    try {
      await synthesizeSequence(['C4', 'E4', 'G4', 'C5'], 100)
    } catch (e: unknown) {
      alert('Error playing sound: ' + e)
    }
  }

  const ledgerWarning = () => {
    const warnings: string[] = []
    if (calculateLedgerLines(settings.highestNote, settings.mode) > 2)
      warnings.push(
        `${settings.highestNote} has ${calculateLedgerLines(settings.highestNote, settings.mode)} ledger lines`,
      )
    if (calculateLedgerLines(settings.lowestNote, settings.mode) > 2)
      warnings.push(
        `${settings.lowestNote} has ${calculateLedgerLines(settings.lowestNote, settings.mode)} ledger lines`,
      )

    if (warnings.length) {
      return {
        description: `Warning: ${warnings.join(' and ')} in ${settings.mode} clef`,
      }
    }
    return {}
  }

  const noteRangeId = useId()
  const sfxSwitchId = useId()

  return (
    <Fieldset m="xs" legend="Settings">
      <Stack>
        <Select
          label="Clef"
          data={['treble', 'bass']}
          value={settings.mode}
          onChange={v => handleChange({ mode: v as TextGameMode })}
        ></Select>
        <Select
          label="Scale"
          data={['C major', 'A minor']}
          value={settings.scale}
          onChange={v => handleChange({ scale: v as TextGameScale })}
        ></Select>
        <Select
          label="Input mode"
          data={[
            {
              label: 'Text Box',
              value: 'text',
            },
            {
              label: 'Piano Keyboard with Letters',
              value: 'keyboardletters',
            },
            {
              label: 'Empty Piano Keyboard',
              value: 'keyboard',
            },
          ]}
          value={settings.inputMode}
          onChange={v => handleChange({ inputMode: v as TextGameInputMode })}
        ></Select>
        <SliderWithLabel
          wrapper={{ label: 'Notes per round: ' + settings.noteCount }}
          value={settings.noteCount}
          max={10}
          min={1}
          onChange={v => handleChange({ noteCount: v })}
        ></SliderWithLabel>
        <Input.Wrapper id={sfxSwitchId} label="Sound effects (may be loud!)">
          <Group>
            <Switch
              id={sfxSwitchId}
              checked={settings.sfx}
              onChange={() => handleChange({ ...settings, sfx: !settings.sfx })}
            ></Switch>
            <Button variant="subtle" onClick={() => testSfx()}>
              Test
            </Button>
          </Group>
        </Input.Wrapper>
        {/* TODO: this would maybe be better if we just select a number of ledger lines here instead of a note range */}
        <Input.Wrapper
          id={noteRangeId}
          label={`Note range: (${settings.lowestNote} - ${settings.highestNote})`}
          {...ledgerWarning()}
        >
          <NoteRange
            id={noteRangeId}
            lowest={settings.lowestNote}
            highest={settings.highestNote}
            lowChange={v => handleChange({ lowestNote: v })}
            highChange={v => handleChange({ highestNote: v })}
          ></NoteRange>
        </Input.Wrapper>
        <SliderWithLabel
          wrapper={{
            label: 'Max interval between notes: ' + settings.maxInterval,
          }}
          value={settings.maxInterval}
          max={100}
          min={1}
          onChange={v => handleChange({ maxInterval: v })}
        ></SliderWithLabel>
      </Stack>
    </Fieldset>
  )
}

type TextGameConfigProps = {
  settings: TextGameSettings
  handleChange: (newSettings: Partial<TextGameSettings>) => void
}

export default TextGameConfig
