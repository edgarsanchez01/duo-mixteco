"use client";

import { useState } from "react";

type WriteProps = {
  correctAnswer: string;
  onSubmit: (isCorrect: boolean) => void;
};

export const Write = ({ correctAnswer, onSubmit }: WriteProps) => {
  const [input, setInput] = useState("");

  const handleCheck = () => {
    onSubmit(input.trim().toLowerCase() === correctAnswer.trim().toLowerCase());
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Escribe tu respuesta..."
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
