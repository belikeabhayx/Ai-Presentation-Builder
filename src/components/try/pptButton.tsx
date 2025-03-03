"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { downloadProjectAsPPTX } from "@/actions/project";
import { useSlideStore } from "@/store/useSlideStore";
import { useToast } from "@/hooks/use-toast";

interface DownloadPPTButtonProps {
  projectId: string;
}

const DownloadPPTButton = ({ projectId }: DownloadPPTButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { project } = useSlideStore();

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      const response = await downloadProjectAsPPTX(projectId);

      if (response.status !== 200 || !response.data) {
        throw new Error(response.error || "Failed to download presentation");
      }

      // Convert base64 to blob
      const byteCharacters = atob(response.data.buffer);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = response.data.filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Presentation downloaded successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to download presentation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isLoading || !project}
    >
      {isLoading ? (
        <span className="animate-spin mr-2">⏳</span>
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Export to PowerPoint
    </Button>
  );
};

export default DownloadPPTButton;
