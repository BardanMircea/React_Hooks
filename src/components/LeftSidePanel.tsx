import React, { useEffect, useState } from "react"
import { Task } from "../models/Task"
import { ProgressBar } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";
import { RightSidePanel } from "./RightSidePanel";

export const LeftSidePanel : React.FC = () => {
    
    const [value, setValue] = useState("")

    // set the initial value of the completed tasks counter at each component mount (e.g.: at pagerefesh)
    const storedCount = localStorage.getItem("completedTasksCounter")
    console.log("storedCount", storedCount)
    let counterInitialValue = 0;
    if(storedCount){
        try {
        counterInitialValue = parseInt(JSON.parse(storedCount))
        } catch(error) {
            console.error("Error parsing stored completed tasks cunter from localStorage")
        }
    }

    const [completedTasksCounter, setCompletedTasksCounter] = useState(counterInitialValue)
    console.log(completedTasksCounter)


    // set the initial value of the id in the tasks array at each component mount (e.g.: at page refesh)
    const storedId = localStorage.getItem("nextId")
    let idInitialValue = 0;
    if(storedId){
        try{
            const parsedId = JSON.parse(storedId)
            idInitialValue = parseInt(parsedId);
        } catch (error){
            console.error("Error parsing stored id")
        }
    }

    const [nextId, setNextId] = useState(idInitialValue)


    // set the initial value of the current task at each component mount (e.g.: at page refesh)
    const storedCurrentTask = localStorage.getItem("currentTask")
    let currentTaskInitialValue = null
    console.log(storedCurrentTask)

    if(storedCurrentTask) {
        try{
            let parsedCurrentTask = JSON.parse(storedCurrentTask) 
            currentTaskInitialValue = new Task(parsedCurrentTask.text, parsedCurrentTask.id, parsedCurrentTask.finished)
        } catch (error) {
            console.error("Error parsing stored currentTask")
        }
    }

    const [currentTask, setCurrentTask] = useState<Task | null>(currentTaskInitialValue)

    // set the initial value of the tasks at each component mount (e.g.: at page refesh)
    const storedTasks = localStorage.getItem("tasks")
    let tasksInitialValue = [];
    if (storedTasks) {
        try {
          let parsedTasks = JSON.parse(storedTasks);
          if (Array.isArray(parsedTasks)) {
            // convert each deserialized element of the array back to a Task object, so we can access its methods
            parsedTasks = parsedTasks.map((element) => {return new Task(element.text, element.id, element.finished)})
            tasksInitialValue = parsedTasks;
          } else {
            // Handle unexpected format
            console.error("Unexpected format of stored tasks in LocalStorage");
          }
        } catch (error) {
          // Handle parsing error
          console.error("Error parsing stored tasks from LocalStorage", error);
        }
      }
    const [tasks, setTasks] = useState<Task[]>(tasksInitialValue)
   
    // persist the tasks, currentTask, id, progress bar and completedTasksCounter inside localStorage every time any of them gets updated
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks))
        localStorage.setItem("currentTask", JSON.stringify(currentTask))
        localStorage.setItem("nextId", JSON.stringify(nextId))
        localStorage.setItem("completedTasksCounter", JSON.stringify(completedTasksCounter))
    }, [tasks, currentTask, nextId, completedTasksCounter])

    
    const addToList = (e : React.FormEvent<HTMLFormElement> | React.BaseSyntheticEvent<EventTarget> ) => {
        e.preventDefault()
        const tasksCopy = [...tasks]
        tasksCopy.push(new Task(value, nextId))
        
        // increment the id for the next added task
        console.log("old ", nextId)
        setNextId(nextId+1)
        console.log("new ", nextId)

        // update tasks
        setTasks(tasksCopy)

        // clear the input after submitting
        setValue("")
        // e.target.reset();    
    }

    const removeTask = (taskId : number) => {
        let remainingTasks = [...tasks]

        // get the task to be removed, so we can check if it's finished or not
        const removedTask = remainingTasks.find(task => task.id === taskId)

        // update the list of tasks to a list without the task to be removed
        remainingTasks = remainingTasks.filter((task) => {return task.id !== taskId})

        // if the removed task was finished, subtract it from the completed tasks counter, to keep the progress bar accurate
        if(removedTask?.finished){
            console.log("count before removing finished task", completedTasksCounter)
            setCompletedTasksCounter(completedTasksCounter-1)
            console.log("after", completedTasksCounter)
        }

        // if this was the task currently being done, set the current task to null
        if(removedTask?.id === currentTask?.id){
            setCurrentTask(null);
        }
        
        // update tasks state
        setTasks(remainingTasks);
    }

    useEffect(() => {
        console.log("HERE!!!!! ", completedTasksCounter)
    }, [completedTasksCounter]) 

    const switchStatus = (taskId : number) => {
        const updatedTasks = [...tasks]
        // const updatedTask = tasks.find((task) => { return task.id === taskId})
        
        // updatedTask?.toggleFinishedUnfinished()
        updatedTasks.forEach((task) => {
            
            if(task.id === taskId){
                console.log(task.finished)
                // toggle task status
                console.log("count before switching status ", completedTasksCounter)
                console.log(task, task.finished)
                task.finished = !task.finished
                
                
                console.log(completedTasksCounter)
                
                const newCount = task.finished ? (completedTasksCounter+1) : (completedTasksCounter-1)
                console.log("expected value for count ", newCount)
                setCompletedTasksCounter(newCount)
                console.log("actual value for count after switching status ", completedTasksCounter)
                console.log(task, task.finished)
                
                // if this task was the one currently being done, set the current task to null
                if(task.finished && task.id === currentTask?.id){
                    // props.setMessage("Not currently doing anything")
                    // and reset the current task id back to its initial value, so we can display the finished task's Do Now button, if later we decide to mark it as not finished again
                    setCurrentTask(null);
                }

                // update visual feedback on checkbox
                // setChecked(!checked)

                // // update taskbar progress
                // setProgress((completedTasksCounter * 100) / updatedTasks.length)

                // update tasks
                setTasks(updatedTasks)
                console.log("completedTasksCounter, later",completedTasksCounter)
                return
            }
        })
    }
    
    const switchCurrentTask = (taskId : number) => {
        const newCurrentTask = tasks.find(task => task.id === taskId)
        if(newCurrentTask) setCurrentTask(newCurrentTask)
    }
    
    const progressBar = (completedTasksCounter * 100) / tasks.length;

    return(
        <>
             <div className="left-side-container">   

                <div className="progress-bar-container">
                    <h4>Progress:</h4> 
                    <ProgressBar now={progressBar} label={`${progressBar.toFixed(0)}%`} />
                </div>
                

                <form onSubmit={(e) => addToList(e)}>
                    <h3 id="newTask">New Task</h3>
                    <input aria-labelledby="newTask" value={value} type="text" onChange={(e) => setValue(e.target.value)}/>
                </form>
                <div>
                    <h3 id="tasks">My tasks:</h3>
                    <ul aria-labelledby="tasks">
                        {tasks.map((task) => {
                            return(
                                <div className="task-row" key={task.id}>
                                    <div className="checkbox-item"> 
                                        <input type="checkbox" checked={task.finished ? true : false} onChange={() => {switchStatus(task.id)}}/>
                                        <p>{task.text}</p>
                                    </div>
                                    <div className="button-container">
                                        {task.id === currentTask?.id || task.finished ? 
                                            (<></>) 
                                            :
                                            (<button className="do-now-button" onClick={() => {switchCurrentTask(task.id)}}>Do Now</button>)}
                                        <button className="delete-button" onClick={()=> {removeTask(task.id)}}>X</button>
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </div>   

            <RightSidePanel switchStatus={switchStatus} currentTask={currentTask}/>          
        </>
    )
}