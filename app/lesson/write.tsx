"use client";

import { useState, useEffect } from "react";

type WriteProps = {
  correctAnswer: string;
  onSubmit: (isCorrect: boolean) => void;
  question?: string;
};

export const Write = ({ correctAnswer, onSubmit, question }: WriteProps) => {
  const [input, setInput] = useState("");
  const [readyToCheck, setReadyToCheck] = useState(false);

  useEffect(() => {
    if (readyToCheck) {
      onSubmit(input.trim().toLowerCase() === correctAnswer.trim().toLowerCase());
      setReadyToCheck(false);
    }
  }, [readyToCheck]);

  useEffect(() => {
    const handleGlobalCheck = () => setReadyToCheck(true);
    window.addEventListener("write-check", handleGlobalCheck);
    return () => window.removeEventListener("write-check", handleGlobalCheck);
  }, []);

  const renderQuestionWithTooltip = () => {
    if (!question) return null;
  
    const regex = /\[(.+?)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;
  
    while ((match = regex.exec(question)) !== null) {
      const [fullMatch, word] = match;
      const index = match.index;
  
      parts.push(<span key={index + "-pre"}>{question.slice(lastIndex, index)}</span>);
      parts.push(
        <span
          key={index}
          className="relative group font-semibold text-green-600 cursor-help"
        >
          {word}
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-black text-base px-4 py-2 rounded-xl shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {correctAnswer}
          </span>
        </span>

      );
      lastIndex = index + fullMatch.length;
    }
  
    parts.push(<span key="last">{question.slice(lastIndex)}</span>);
    return parts;
  };  

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-neutral-700 text-center">
        {renderQuestionWithTooltip()}
      </h1>

      <input
        type="text"
        placeholder="Escribe tu respuesta..."
        className="w-full max-w-md px-4 py-3 text-lg border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};
