const createAudioContext = () =>
  new (window.AudioContext || (window as unknown as any).webkitAudioContext)()

const getAudioContext = (() => {
  const audioContext = createAudioContext()
  return () => audioContext
})()

export default getAudioContext
