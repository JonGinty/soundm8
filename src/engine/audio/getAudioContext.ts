





const createAudioContext = () => new (window.AudioContext || (window as any).webkitAudioContext)();

const getAudioContext = (() => {
    const audioContext = createAudioContext();
    return () => audioContext;
})();


export default getAudioContext;



