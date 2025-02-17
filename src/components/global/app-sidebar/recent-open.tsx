import { Project } from "@prisma/client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { JsonValue } from "@prisma/client/runtime/library";

type Props = {
  recentProjects: Project[];
};

const RecentOpen = ({ recentProjects }: Props) => {
    const handleClick = (projectId: string, slides:JsonValue) => {}
  return recentProjects.length > 0 ? (
    <SidebarGroup>
      <SidebarGroupLabel>recently Opened</SidebarGroupLabel>
      <SidebarMenu>
        {recentProjects.length > 0
          ? recentProjects.map((item, idx) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`hover:bg-primary-80`}
                >
                  <Button
                    variant={"link"}
                    className="text-xs items-center justify-start"
                    onClick={() => handleClick(item.id, item.slides)}
                  >
                    <span>{item.title}</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          : null}{" "}
        // Render nothing when there are no projects
      </SidebarMenu>
    </SidebarGroup>
  ) : (
    ""
  );
};

export default RecentOpen;
