import React from "react";

const ProjectInfoTags = ({Icon, value}) => {
  return (
    <span className="bg-sky-op border-2 border-sky px-2 py-1 rounded-md text-sky font-semibold text-sm flex items-center gap-x-2">
      <Icon />
      <p>{value}</p>
    </span>
  );
};

export default ProjectInfoTags;
