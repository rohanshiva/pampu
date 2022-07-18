import React from "react";
import Markdoc from "@markdoc/markdoc";

interface LimeProps {
    lime: string
}

function Lime({ lime }: LimeProps) {
    return (
        <>
            {Markdoc.renderers.react(Markdoc.transform(Markdoc.parse(lime)), React)}
        </>
    )
}

export default Lime;