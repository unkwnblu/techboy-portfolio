"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type CursorContextType = {
    cursorText: string;
    setCursorText: (text: string) => void;
    cursorVariant: "default" | "project" | "video";
    setCursorVariant: (variant: "default" | "project" | "video") => void;
};

const CursorContext = createContext<CursorContextType>({
    cursorText: "",
    setCursorText: () => { },
    cursorVariant: "default",
    setCursorVariant: () => { },
});

export const useCursor = () => useContext(CursorContext);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
    const [cursorText, setCursorText] = useState("");
    const [cursorVariant, setCursorVariant] = useState<"default" | "project" | "video">("default");

    return (
        <CursorContext.Provider value={{ cursorText, setCursorText, cursorVariant, setCursorVariant }}>
            {children}
        </CursorContext.Provider>
    );
};
