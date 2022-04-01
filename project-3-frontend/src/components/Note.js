import React from "react";

const Note = ({ note }) => {



  const handleClick = (e) => {
    console.log(e)
  }

    return(
        <div class="font-mono my-3">
        <div className="flex flex-col p-2 rounded-lg shadow-md bg-gray-200 hover:bg-blue-300 max-w-sm">
          <div className="m-center text-left mt-1">
            <div onClick={handleClick} className="text-black text-xl leading-tight font-small m-3">
            {note.description}
            </div>
          </div> 
        </div>
        </div>
    )
}

export default Note;