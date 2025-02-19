"use client";
import usePromptStore from "@/store/usePromptStore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import CreatePage from "./CreatePage/CreatePage";
import CreateAI from "./GenerateAi/CreativeAi";

type Props = {};

const RenderPage = (props: Props) => {
  const router = useRouter();
  const { page, setPage } = usePromptStore();

  const handleBack = () => {
    setPage("create");
  };

  const handleSelectOptions = (option: string) => {
    if (option === "template") {
      router.push("/templates");
    } else if (option === "create-scratch") {
      setPage("create-scratch");
    } else if (option === "creative-ai") {
      setPage("creative-ai");
    }
  };

  const renderStep = () => {
    switch (page) {
      case "create":
        return (
          <>
            <CreatePage onSelectOptions={handleSelectOptions} />
          </>
        );
      case "create-scratch":
        return (
          <>
            <CreateAI onBack={handleBack}/>
          </>
        );
      case "creative-ai":
        return <></>;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
};

export default RenderPage;
