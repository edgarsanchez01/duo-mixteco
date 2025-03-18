"use client";

import { useState } from "react";

type FillInProps = {
  sentence: string;
  missingWord: string;
  onSubmit: (isCorrect: boolean) => void;
};

export const FillIn = ({ sentence, missingWord, onSubmit }: FillInProps) => {
  const [input, setInput] = useState("");

  const handleCheck = () => {
    onSubmit(input.trim().toLowerCase() === missingWord.trim().toLowerCase());
  };

  return (
    <div className="flex flex-col gap-4">
      <p>{sentence.replace(missingWord, "____")}</p>
      <input
        type="text"
        placeholder="Completa la palabra..."
        className="border p-2 rounded-md"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleCheck} className="bg-blue-500 text-white p-2 rounded-md">
        Verificar
      </button>
    </div>
  );
};
