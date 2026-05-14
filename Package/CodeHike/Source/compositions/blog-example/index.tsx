import React from "react"
import { z } from "zod"
import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks"
import {
    AbsoluteFill,
    Composition,
    Sequence,
    interpolateColors,
    useCurrentFrame,
} from "remotion"
import { InnerLine, Pre } from "codehike/code"
import { tokenTransitions, useTokenTransitions } from "./token-transitions"

import Content from "./content.md";

const Schema = Block.extend({
    steps: z.array(
        Block.extend({
            code: HighlightedCodeBlock,
        })
    ),
})

const { steps: Steps } = parseRoot(Content, Schema)

function Video({ steps }) {
    return (
        <AbsoluteFill
            style={{
                alignItems: "center",
                background: "#0D1117",
                fontSize: 24
            }}>
            {Steps.map((step, index) => (
                <Sequence
                    durationInFrames={STEP_FRAMES}
                    from={STEP_FRAMES * index}
                    key={index}
                    layout="none"
                    name={step.title}>
                    <Code
                        newCode={step.code}
                        oldCode={steps[index - 1]?.code}
                    />
                </Sequence>
            ))}
        </AbsoluteFill>
    )
}

function Code({ oldCode, newCode })
{
    const { code, ref } = useTokenTransitions(oldCode, newCode, STEP_FRAMES)
    return <Pre ref={ref} code={code} handlers={[Mark, tokenTransitions]} />
}

const Mark =
{
    name: "mark",
    Line: (props) => <InnerLine merge={props} style={{ padding: "0 4px" }} />,
    Block: ({ children, annotation }) => 
    {
        const Delay = +(annotation.query || 0)
        const Frame = useCurrentFrame()
        const Background = interpolateColors(
            Frame,
            [Delay, Delay + 10],
            ["#0000", "#F2CC6044"]
        );

        return <div style={{ background: Background }}>{children}</div>
    },
}

const STEP_FRAMES: number = 120
export default function () {
    return (
        <Composition
            component={Video}
            defaultProps={{ steps: Steps }}
            durationInFrames={STEP_FRAMES * Steps.length}
            fps={60}
            id="BlogExample"
            width={140 * 2}
            height={90 * 2}
        />
    )
}
