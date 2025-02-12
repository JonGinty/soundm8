import { IconCircleCheck, IconHeadphones, IconMusic,IconPlayCard8 } from "@tabler/icons-react";


export default function HeaderLogo() {
    return (<span style={{ display: "flex", color: "white", backgroundColor: "#4444ff", padding: "5px 20px", borderRadius: "20px" }}>
        <IconMusic/>
        {/* <IconHeadphones /> */}
        {/* <IconCircleCheck /> */}
        <IconPlayCard8/>
        {/* <IconPlayCard8/> <IconPlayCard8/> <IconPlayCard8/> <IconPlayCard8/> */}
    </span>)
}