"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Option = {
  text: string;
  correct: boolean;
};

type FillInProps = {
  sentence: string;
  options: Option[];
  onValidate: (selected: string | null) => void;
  locked: boolean;
  correctAnswer?: string;
  selected: string | null;
  imageSrc?: string | null;
};

export const FillIn = ({
  sentence,
  options,
  onValidate,
  locked,
  correctAnswer,
  selected: externalSelected,
  imageSrc,
}: FillInProps) => {
  const [selected, setSelected] = useState<string | null>(externalSelected);

  useEffect(() => {
    setSelected(externalSelected);
  }, [externalSelected]);

  useEffect(() => {
    onValidate(selected);
  }, [selected]);

  const renderSentence = () => {
    const parts = sentence.split("____");

    return (
      <div className="flex items-center justify-center gap-6 flex-wrap px-4 text-center lg:text-left">
        {imageSrc && (
          <div className="w-32 h-32 relative flex-shrink-0">
            <Image
              src={imageSrc}
              alt="Ilustración"
              fill
              className="rounded-lg object-contain"
            />
          </div>
        )}

        <p className="text-lg lg:text-2xl font-semibold text-text-dark leading-relaxed">
          {parts[0]}
          <span className="mx-2 inline-flex items-center justify-center min-w-[100px] h-[2rem] border-b-4 border-dotted border-border">
            {selected ? (
              <span
                className={cn(
                  "inline-block px-3 py-1 rounded-full transition-colors text-base",
                  locked
                    ? selected === correctAnswer
                      ? "bg-primary/20 text-primary"
                      : "bg-primary-light/20 text-primary-light"
                    : "bg-accent/30 text-accent"
                )}
              >
                {selected}
              </span>
            ) : (
              <span className="inline-block w-full h-[1.25rem]"></span>
            )}
          </span>
          {parts[1]}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-6">
      {renderSentence()}

      <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl">
        {options.map((option, index) => {
          const isSelected = selected === option.text;
          const isCorrect = option.correct;

          const getVariant = () => {
            if (!locked) return isSelected ? "primary" : "default";
            if (locked && isSelected && isCorrect) return "secondary";
            if (locked && isSelected && !isCorrect) return "danger";
            return "locked";
          };

          return (
            <Button
              key={index}
              variant={getVariant()}
              size="default"
              onClick={() => !locked && setSelected(option.text)}
              disabled={locked}
              className="rounded-xl px-6 py-2 text-sm min-w-[110px] text-center"
            >
              {option.text}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
