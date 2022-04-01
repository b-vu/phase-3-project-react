import React from "react";

const Member = ({ member }) => {
    return(
        <div className="m-auto pb-2 mb-2">
            <div className="flex bg-gray-200 max-w-sm py-4 px-10 md:px-8 rounded-md shadow-lg">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <img className="rounded-full border-4 border-gray-300 h-24 w-24 mx-auto" src={member.picture} alt={member.first_name} />
                    <div className="flex flex-col md:text-left">
                        <div className="font-medium text-lg text-gray-800">{member.first_name} {member.last_name}</div>
                        <div className="text-gray-800">{member.title}</div>
                        <div className="text-gray-800">{member.email}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Member;