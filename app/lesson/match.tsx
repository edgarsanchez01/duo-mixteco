"use client";

import { useState, useEffect, useRef } from "react";
import { useAudio } from "react-use";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MatchProps = {
  pairs: { left: string; right: string }[];
  onSubmit: (status: "correct" | "wrong") => void;
};

const shuffleArray = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

export const Match = ({ pairs, onSubmit }: MatchProps) => {
  const [leftWords, setLeftWords] = useState<string[]>([]);
  const [rightWords, setRightWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<"left" | "right" | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ left: string; right: string }[]>([]);
  const [shakeWord, setShakeWord] = useState<string | null>(null);

  const [correctAudio, , correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, , incorrectControls] = useAudio({ src: "/incorrect.wav" });

  const hasPlayedSound = useRef(false);

  useEffect(() => {
    const left = shuffleArray(pairs.map(p => p.left));
    let right = shuffleArray(pairs.map(p => p.right));

    const isMatchingSameIndex = () => {
      return left.some((leftWord, i) =>
        pairs.some(pair => pair.left === leftWord && pair.right === right[i])
      );
    };

    let attempts = 0;
    while (isMatchingSameIndex() && attempts < 10) {
      right = shuffleArray(pairs.map(p => p.right));
      attempts++;
    }

    setLeftWords(left);
    setRightWords(right);
    setSelectedWord(null);
    setSelectedColumn(null);
    setMatchedPairs([]);
    setShakeWord(null);
    hasPlayedSound.current = false;
  }, [pairs]);

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
        const newPair = column === "left"
          ? { left: word, right: selectedWord! }
          : { left: selectedWord!, right: word };

        setMatchedPairs([...matchedPairs, newPair]);
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
          {leftWords.map((word, index) => (
            <Button
              key={`left-${index}`}
              onClick={() => handleSelectWord(word, "left")}
              variant={
                matchedPairs.some(p => p.left === word || p.right === word)
                  ? "locked"
                  : selectedWord === word
                  ? "sidebarOutline"
                  : "default"
              }
              size="lg"
              className={cn(
                matchedPairs.some(p => p.left === word) && "opacity-70 border-none",
                shakeWord === word && "bg-primary-light text-white"
              )}
              disabled={matchedPairs.some(p => p.left === word)}
            >
              {word}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {rightWords.map((word, index) => (
            <Button
              key={`right-${index}`}
              onClick={() => handleSelectWord(word, "right")}
              variant={
                matchedPairs.some(p => p.left === word || p.right === word)
                  ? "locked"
                  : selectedWord === word
                  ? "sidebarOutline"
                  : "default"
              }
              size="lg"
              className={cn(
                matchedPairs.some(p => p.right === word) && "opacity-70 border-none",
                shakeWord === word && "bg-primary-light text-white"
              )}
              disabled={matchedPairs.some(p => p.right === word)}
            >
              {word}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
