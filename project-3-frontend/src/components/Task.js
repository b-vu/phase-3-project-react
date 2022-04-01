import React from "react";

const Task = ({ task }) => {
    return(
        <div className="m-auto text-center mb-3">
            <div className="flex flex-col p-3 rounded-lg shadow-lg bg-green-500 hover:bg-green-600 max-w-sm">
                <div className="text-white text-xl leading-tight font-medium mb-2">{task.description}</div>
                <div className="text-white text-base">
                    Deadline: {task.deadline}
                </div>
            </div>
        </div>
    )
}

export default Task;