import { useEffect, useRef } from "react";
import VexFlow from "vexflow";

// I may ditch vexflow / easyscore for a different library, had to do some hacky stuff here to make this work
const flow = VexFlow.Flow;


export default function Notation({sequence, clef}: {sequence: string[], clef: string}) {
    const container = useRef<HTMLDivElement>(null);
    const id = "score-" + crypto.randomUUID();


    // TODO: centering this is kind of awkward seeing as we don't control how wide the stave itself is
    const width = 200;
    const height = 130;

    useEffect(() => {
        if (!sequence || !sequence.length) return;

        const vf = new flow.Factory({
            renderer: { elementId: id, width, height}
        });
        vf.reset();

        const score = vf.EasyScore();
        const system = vf.System();

        system.addStave({
            voices: [
                score.voice(score.notes(sequence.join("/q, "), {clef}), { time: sequence.length + "/4" })
            ]
        }).addClef(clef);

        vf.draw();
        return () => {
            if (container.current) {
                container.current.innerHTML = "";
            }
        }
    }, [sequence]);

    return (
        <>
            <div ref={container} id={id}></div>
        </>
    )
}