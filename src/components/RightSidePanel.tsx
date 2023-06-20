import React from "react"
import { Task } from "../models/Task"

export const RightSidePanel : React.FC<{switchStatus : any, currentTask : Task | null}> = (props) => {

    return(
        <div className="right-side-container">
            <h3>Currently doing</h3>
            {props.currentTask === null || props.currentTask.finished ? 
                <>
                    <h6 className="currently-doing-message">Not currently doing anything</h6>
                    <button disabled>I'm done 🚀</button>
                    <button></button>
                </>
                :     
                <>
                    <h6 className="currently-doing-message">{props.currentTask.text}</h6> 
                    <button onClick={() => props.switchStatus(props.currentTask?.id)}>I'm done 🚀</button>
                </>
            }
        </div>
    )
}