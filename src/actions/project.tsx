"use server";

import { client } from "@/lib/prisma";
import { onAuthenticateUser } from "./user";
import { OutlineCard } from "@/lib/types";
import { JsonValue } from "@prisma/client/runtime/library";
import PptxGenJS from "pptxgenjs";

export const getAllprojects = async () => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }

    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    if (projects.length === 0) {
      return { status: 404, error: "No projects found" };
    }
    return { status: 200, data: projects };
  } catch (error) {
    console.log("error", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const getRecentProjects = async () => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }

    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });
    if (projects.length === 0) {
      return { status: 404, error: "No recent projects available" };
    }
    return { status: 200, data: projects };
  } catch (error) {
    console.log("error", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const recoverProject = async (projectId: string) => {
  try {
    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }

    const updatedProject = await client.project.update({
      where: {
        id: projectId,
      },
      data: {
        isDeleted: false,
      },
    });

    if (!updatedProject) {
      return { status: 500, error: "Failed to recover project" };
    }
    return { status: 200, data: updatedProject };
  } catch (error) {
    console.log("error", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const checkUser = await onAuthenticateUser();

    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }

    const updatedProject = await client.project.update({
      where: {
        id: projectId,
      },
      data: {
        isDeleted: true,
      },
    });

    if (!updatedProject) {
      return { status: 500, error: "Failed to delete project" };
    }
    return { status: 200, data: updatedProject };
  } catch (error) {
    console.log("error", error);
    return { status: 500, error: "Internal Server Error" };
  }
};

export const createProject = async (title: string, outlines: OutlineCard[]) => {
  try {
    if (!title || !outlines || outlines.length === 0) {
      return { status: 400, error: "Title and outlines are required." };
    }

    const allOutlines = outlines.map((outline) => outline.title);
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not authenticated" };
    }

    const project = await client.project.create({
      data: {
        title,
        outlines: allOutlines,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: checkUser.user.id,
      },
    });

    if (!project) {
      return { status: 500, error: "Failed to create project" };
    }
    return { status: 200, data: project };
  } catch (error) {
    console.error("error", error);
    return { status: 500, error: "Internal server error" };
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }
    const project = await client.project.findFirst({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return { status: 404, error: "Project not found" };
    }
    return { status: 200, data: project };
  } catch (error) {
    console.error("error", error);
    return { status: 500, error: "Internal server error" };
  }
};

export const updateSlides = async (projectId: string, slides: JsonValue) => {
  try {
    if (!projectId || !slides) {
      return { status: 400, error: "Project ID and slides are required" };
    }
    const updatedProject = await client.project.update({
      where: {
        id: projectId,
      },
      data: {
        slides,
      },
    });
    if (!updatedProject) {
      return { status: 500, error: "Failed to update project" };
    }
    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("error", error);
    return { status: 500, error: "Internal server error" };
  }
};

export const updateTheme = async (projectId: string, theme: string) => {
  try {
    if (!projectId || !theme) {
      return { status: 400, error: "Project ID and theme are required" };
    }
    const updatedProject = await client.project.update({
      where: {
        id: projectId,
      },
      data: {
        themeName: theme,
      },
    });
    if (!updatedProject) {
      return { status: 500, error: "Failed to update project" };
    }
    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("error", error);
    return { status: 500, error: "Internal server error" };
  }
};

export const deleteAllProjects = async (projectIds: string[]) => {
  try {
    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return { status: 400, error: "No Project IDs are required" };
    }

    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }

    const userId = checkUser.user.id;

    const projectsToDelete = await client.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
        userId: userId,
      },
    });
    if (projectsToDelete.length === 0) {
      return { status: 404, error: "No projects found for the given IDs" };
    }
    const deletedProjects = await client.project.deleteMany({
      where: {
        id: {
          in: projectsToDelete.map((project) => project.id),
        },
      },
    });
    return {
      status: 200,
      message: `${deletedProjects.count} projects deleted successfully`,
    };
  } catch (error) {
    console.error("error", error);
    return { status: 500, error: "Internal server error" };
  }
};

export const getDeletedProjects = async () => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not Authenticated" };
    }

    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        isDeleted: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (projects.length === 0) {
      return { status: 400, error: "No deleted projects found", data: [] };
    }

    return { status: 200, data: projects };
  } catch (error) {
    console.error("error", error);
    return { status: 500, error: "Internal server error" };
  }
};

export const downloadProjectAsPPTX = async (projectId: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }

    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not authenticated" };
    }

    // Get project data
    const project = await client.project.findFirst({
      where: {
        id: projectId,
        userId: checkUser.user.id,
        isDeleted: false,
      },
    });

    if (!project || !project.slides) {
      return { status: 404, error: "Project not found or has no slides" };
    }

    // Create a new PowerPoint presentation
    const pptx = new PptxGenJS();
    const slides = JSON.parse(JSON.stringify(project.slides));

    // Set presentation properties
    pptx.author = checkUser.user.name || "User";
    pptx.title = project.title;
    pptx.company = "Presentation App";
    pptx.revision = "1";

    // Process each slide
    for (const slide of slides) {
      const pptxSlide = pptx.addSlide();
      
      // Process slide content
      if (slide.content) {
        processSlideContent(pptxSlide, slide.content);
      }
    }

    // Generate the PowerPoint file
    const buffer = await (pptx as any).stream();
    const base64Data = Buffer.from(buffer).toString('base64');
    const filename = `${project.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${Date.now()}.pptx`;

    return {
      status: 200,
      data: {
        buffer: base64Data,
        filename,
      },
    };
  } catch (error) {
    console.error("Download error:", error);
    return { status: 500, error: "Failed to generate PowerPoint file" };
  }
};

// Helper function to process slide content recursively
function processSlideContent(pptxSlide: any, content: any) {
  if (!content) return;

  // Handle array of content
  if (Array.isArray(content)) {
    content.forEach(item => processSlideContent(pptxSlide, item));
    return;
  }

  // Handle nested content structures
  if (content.content) {
    if (typeof content.content === 'object') {
      processSlideContent(pptxSlide, content.content);
    } else {
      addContentToSlide(pptxSlide, content);
    }
  }

  // Process children if they exist
  if (content.children) {
    processSlideContent(pptxSlide, content.children);
  }
}

// Helper function to add content to slide based on type
function addContentToSlide(pptxSlide: any, content: any) {
  const baseTextOptions = {
    x: content.x || 0.5,
    y: content.y || 0.5,
    w: content.w || "90%",
    color: content.color || "000000",
    align: content.align || "left",
  };

  switch (content.type) {
    case "title":
    case "heading1":
      pptxSlide.addText(content.content || "", {
        ...baseTextOptions,
        fontSize: 44,
        bold: true,
      });
      break;

    case "heading2":
      pptxSlide.addText(content.content || "", {
        ...baseTextOptions,
        fontSize: 36,
        bold: true,
      });
      break;

    case "heading3":
      pptxSlide.addText(content.content || "", {
        ...baseTextOptions,
        fontSize: 28,
        bold: true,
      });
      break;

    case "heading4":
      pptxSlide.addText(content.content || "", {
        ...baseTextOptions,
        fontSize: 24,
        bold: true,
      });
      break;

    case "paragraph":
      pptxSlide.addText(content.content || "", {
        ...baseTextOptions,
        fontSize: 18,
      });
      break;

    case "bulletList":
    case "numberedList":
      if (Array.isArray(content.content)) {
        content.content.forEach((item: string, index: number) => {
          if (item.trim()) {
            pptxSlide.addText(item, {
              ...baseTextOptions,
              y: baseTextOptions.y + (index * 0.3),
              fontSize: 18,
              bullet: content.type === "bulletList",
              indentLevel: content.type === "numberedList" ? 1 : 0,
            });
          }
        });
      }
      break;

    case "image":
      if (content.content && !content.content.includes("placeholder")) {
        pptxSlide.addImage({
          path: content.content,
          x: content.x || 0.5,
          y: content.y || 0.5,
          w: content.w || 5,
          h: content.h || 3,
        });
      }
      break;

    case "table":
      if (Array.isArray(content.content) && content.content.length > 0) {
        pptxSlide.addTable(content.content, {
          x: content.x || 0.5,
          y: content.y || 0.5,
          w: content.w || "90%",
          fontSize: 16,
        });
      }
      break;

    case "calloutBox":
      const calloutColors = {
        success: { bg: "D5F5E3", text: "196F3D" },
        info: { bg: "D4E6F1", text: "21618C" },
        warning: { bg: "FCF3CF", text: "B7950B" },
        caution: { bg: "FADBD8", text: "943126" },
        question: { bg: "E8DAEF", text: "6C3483" },
      };
      const calloutStyle = calloutColors[content.callOutType as keyof typeof calloutColors] || calloutColors.info;
      
      pptxSlide.addText(content.content || "", {
        ...baseTextOptions,
        fontSize: 16,
        fill: { color: calloutStyle.bg },
        color: calloutStyle.text,
        padding: 10,
      });
      break;
  }
}
