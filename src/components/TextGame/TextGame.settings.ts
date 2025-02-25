type TextGameSettings = {
  mode: TextGameMode
  sfx: boolean
  highestNote: string
  lowestNote: string
  scale: TextGameScale // text game will only support keys with no sharps
  noteCount: number
  maxInterval: number
  inputMode: TextGameInputMode
}

export type TextGameMode = 'treble' | 'bass'
export type TextGameScale = 'C major' | 'A minor'
export type TextGameInputMode = 'text' | 'keyboardletters' | 'keyboard'

export default TextGameSettings
