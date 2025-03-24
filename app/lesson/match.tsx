"use client";

import { useState, useEffect, useRef } from "react";
import { useAudio } from "react-use";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MatchProps = {
  pairs: { left: string; right: string }[];
  onSubmit: (status: "correct" | "wrong") => void;
};

export const Match = ({ pairs, onSubmit }: MatchProps) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<"left" | "right" | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ left: string; right: string }[]>([]);
  const [shakeWord, setShakeWord] = useState<string | null>(null);

  const [correctAudio, , correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, , incorrectControls] = useAudio({ src: "/incorrect.wav" });

  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (matchedPairs.length === pairs.length && matchedPairs.length > 0) {
      if (!hasPlayedSound.current) {
        onSubmit("correct");
        void correctControls.play();
        hasPlayedSound.current = true;
      }
    } else {
      hasPlayedSound.current = false;
    }
  }, [matchedPairs, pairs, onSubmit]);

  const handleSelectWord = (word: string, column: "left" | "right") => {
    if (selectedColumn === column) return;

    if (!selectedWord) {
      setSelectedWord(word);
      setSelectedColumn(column);
    } else {
      const isCorrectPair = pairs.some(pair =>
        (pair.left === selectedWord && pair.right === word) ||
        (pair.right === selectedWord && pair.left === word)
      );

      if (isCorrectPair) {
        setMatchedPairs([...matchedPairs, { left: selectedWord, right: word }]);
        void correctControls.play();
      } else {
        setShakeWord(selectedWord);
        setTimeout(() => setShakeWord(null), 500);
        void incorrectControls.play();
      }

      setSelectedWord(null);
      setSelectedColumn(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {correctAudio}
      {incorrectAudio}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {pairs.map((pair, index) => (
            <Button
              key={`left-${index}`}
              onClick={() => handleSelectWord(pair.left, "left")}
              variant={
                matchedPairs.some(p => p.left === pair.left || p.right === pair.left)
                  ? "locked"
                  : selectedWord === pair.left
                  ? "sidebarOutline"
                  : "default"
              }
              size="lg"
              className={cn(
                matchedPairs.some(p => p.left === pair.left) && "opacity-70 border-none",
                shakeWord === pair.left && "bg-red-500 text-white"
              )}
              disabled={matchedPairs.some(p => p.left === pair.left)}
            >
              {pair.left}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {pairs.map((pair, index) => (
            <Button
              key={`right-${index}`}
              onClick={() => handleSelectWord(pair.right, "right")}
              variant={
                matchedPairs.some(p => p.left === pair.right || p.right === pair.right)
                  ? "locked"
                  : selectedWord === pair.right
                  ? "sidebarOutline"
                  : "default"
              }
              size="lg"
              className={cn(
                matchedPairs.some(p => p.right === pair.right) && "opacity-70 border-none",
                shakeWord === pair.right && "bg-red-500 text-white"
              )}
              disabled={matchedPairs.some(p => p.right === pair.right)}
            >
              {pair.right}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
