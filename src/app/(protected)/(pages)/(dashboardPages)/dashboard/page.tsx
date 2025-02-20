import React from "react";
import { getAllprojects } from "@/actions/project";
import NotFound from "@/components/global/not-found/page";
import Projects from "@/components/global/projects";

const DashboardPage = async () => {
  const allProjects = await getAllprojects();
  return (
    <div className="w-full flex flex-col gap-6 relative">
      <div
        className="flex flex-col-reverse items-start w-full
     gap-6 sm:flex-row sm:justify-between sm:items-center"
      >
        <div className="flex flex-col items-start">
          <h1
            className="text-2xl font-semibold dark:text-primary
       backdrop-blur-lg"
          >
            Projects
          </h1>
          <p className="text-base font-normal dark:text-secondary">
            All of your work in one place
          </p>
        </div>
      </div>
      {/* Projects */}
      {allProjects.data && allProjects.data.length > 0 ? (
        <Projects projects={allProjects.data} />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default DashboardPage;
