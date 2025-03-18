"use client";

import { useState, useEffect, useRef } from "react";
import { useAudio } from "react-use";
import { Button, buttonVariants } from "@/components/ui/button"; // ✅ Importa el botón con estilos
import { cn } from "@/lib/utils";

type MatchProps = {
  pairs: { left: string; right: string }[];
  onSubmit: (status: "correct" | "wrong") => void;
};

export const Match = ({ pairs, onSubmit }: MatchProps) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ left: string; right: string }[]>([]);
  const [shakeLeft, setShakeLeft] = useState<string | null>(null);
  const [shakeRight, setShakeRight] = useState<string | null>(null);

  // ✅ Sonidos de correcto e incorrecto
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.wav" });

  // ✅ useRef para evitar que el sonido se repita
  const hasPlayedSound = useRef(false);

  const handleSelectLeft = (word: string) => {
    if (!matchedPairs.some(pair => pair.left === word)) {
      setSelectedLeft(word);
    }
  };

  const handleSelectRight = (word: string) => {
    if (!matchedPairs.some(pair => pair.right === word)) {
      setSelectedRight(word);
    }
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const isCorrectPair = pairs.some(pair => pair.left === selectedLeft && pair.right === selectedRight);

      if (isCorrectPair) {
        setMatchedPairs([...matchedPairs, { left: selectedLeft, right: selectedRight }]);
      } else {
        // ✅ Aplica shake individualmente
        setShakeLeft(selectedLeft);
        setShakeRight(selectedRight);
        void incorrectControls.play(); // 🔊 Sonido incorrecto

        setTimeout(() => {
          setShakeLeft(null);
          setShakeRight(null);
        }, 500); // ⏳ Shake dura 0.5s
      }

      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }, [selectedLeft, selectedRight, pairs, matchedPairs, incorrectControls]);

  useEffect(() => {
    if (matchedPairs.length === pairs.length && matchedPairs.length > 0) {
      if (!hasPlayedSound.current) {
        const isCorrect = matchedPairs.every(pair =>
          pairs.some(correctPair => correctPair.left === pair.left && correctPair.right === pair.right)
        );

        if (isCorrect) {
          void correctControls.play(); // 🔊 Sonido correcto
          onSubmit("correct");
        } else {
          void incorrectControls.play(); // 🔊 Sonido incorrecto
          onSubmit("wrong");
        }

        hasPlayedSound.current = true; // ✅ Evita que el sonido se repita
      }
    } else {
      hasPlayedSound.current = false; // ✅ Reiniciar control si no se ha terminado
    }
  }, [matchedPairs, pairs, onSubmit, correctControls, incorrectControls]);

  // ✅ Agregar soporte para selección con teclado (1-4 izquierda, 5-8 derecha)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      const index = parseInt(key) - 1; // Convierte la tecla en índice (1 → 0, 2 → 1, etc.)

      if (index >= 0 && index < 4) {
        // ✅ Números 1-4 → Selecciona de la columna izquierda
        handleSelectLeft(pairs[index]?.left);
      } else if (index >= 4 && index < 8) {
        // ✅ Números 5-8 → Selecciona de la columna derecha
        handleSelectRight(pairs[index - 4]?.right);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [pairs]);

  return (
    <div className="flex flex-col gap-4">
      {correctAudio} {/* 🔊 Sonido correcto */}
      {incorrectAudio} {/* 🔊 Sonido incorrecto */}

      <div className="grid grid-cols-2 gap-4">
        {/* Columna de palabras en inglés */}
        <div className="flex flex-col gap-2">
          {pairs.slice(0, 4).map((pair, index) => ( // ✅ Solo muestra 4 palabras en la izquierda
            <Button
              key={`left-${index}`}
              onClick={() => handleSelectLeft(pair.left)}
              variant={
                matchedPairs.some(p => p.left === pair.left)
                  ? "locked" // ✅ Locked cuando es correcto
                  : selectedLeft === pair.left
                  ? "sidebarOutline" // ✅ Resalta cuando está seleccionado
                  : "default"
              }
              size="lg"
              className={cn(
                matchedPairs.some(p => p.left === pair.left) && "opacity-70 border-none",
                shakeLeft === pair.left && "bg-red-500 text-white"
              )}
            >
              {index + 1}. {pair.left} {/* ✅ Muestra el número de atajo */}
            </Button>
          ))}
        </div>

        {/* Columna de palabras en español */}
        <div className="flex flex-col gap-2">
          {pairs.slice(0, 4).map((pair, index) => ( // ✅ Solo muestra 4 palabras en la derecha
            <Button
              key={`right-${index}`}
              onClick={() => handleSelectRight(pair.right)}
              variant={
                matchedPairs.some(p => p.right === pair.right)
                  ? "locked" // ✅ Locked cuando es correcto
                  : selectedRight === pair.right
                  ? "sidebarOutline" // ✅ Resalta cuando está seleccionado
                  : "default"
              }
              size="lg"
              className={cn(
                matchedPairs.some(p => p.right === pair.right) && "opacity-70 border-none",
                shakeRight === pair.right && "bg-red-500 text-white"
              )}
            >
              {index + 5}. {pair.right} {/* ✅ Muestra el número de atajo */}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
