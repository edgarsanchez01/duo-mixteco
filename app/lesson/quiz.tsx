"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { MAX_HEARTS } from "@/constants";
import { challenges, userSubscription } from "@/db/schema";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import { Challenge } from "./challenge";
import { Write } from "./write";
import { Match } from "./match";
import { FillIn } from "./fill-in";

import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";

type QuizProps = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    options?: { text: string; correct: boolean }[];
    answer?: string;
    pairs?: { left: string; right: string }[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: QuizProps) => {
  // ✅ Sonidos de respuesta correcta e incorrecta
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.wav" });
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });

  const { width, height } = useWindowSize();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
  });

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => (initialPercentage === 100 ? 0 : initialPercentage));
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

  const challenge = challenges[activeIndex];
  const options = challenge?.options ?? [];

  const onNext = () => {
    setActiveIndex((current) => current + 1);
    setStatus("none");
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then(() => {
            void correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then(() => {
            void incorrectControls.play();
            setStatus("wrong");
            setHearts((prev) => Math.max(prev - 1, 0));
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };

  const onContinue = () => {
    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setSelectedOption(undefined);
      return;
    }

    if (challenge.type === "SELECT" || challenge.type === "ASSIST") {
      const correctOption = options.find((option) => option.correct);
      if (!correctOption) return;
      handleAnswerSubmit(options[selectedOption!]?.correct ?? false);
    }
  };

  const handleMatchSubmit = (newStatus: "correct" | "wrong") => {
    setStatus(newStatus);
  };

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti recycle={false} numberOfPieces={500} tweenDuration={10000} width={width} height={height} />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image src="/finish.svg" alt="Finish" className="hidden lg:block" height={100} width={100} />
          <Image src="/finish.svg" alt="Finish" className="block lg:hidden" height={100} width={100} />
          <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">¡Bien hecho! <br /> Has completado la lección.</h1>
          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={userSubscription?.isActive ? Infinity : hearts} />
          </div>
        </div>
        <Footer lessonId={lessonId} status="completed" onCheck={() => router.push("/learn")} />
      </>
    );
  }

  const title = challenge.type === "ASSIST" ? "Selecciona el significado correcto" : challenge.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header hearts={hearts} percentage={percentage} hasActiveSubscription={!!userSubscription?.isActive} />
      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">{title}</h1>
            <div>
              {challenge.type === "ASSIST" && <QuestionBubble question={challenge.question} />}
              {challenge.type === "SELECT" || challenge.type === "ASSIST" ? (
                <Challenge options={options} onSelect={onSelect} status={status} selectedOption={selectedOption} disabled={pending} type={challenge.type} />
              ) : challenge.type === "WRITE" ? (
                <Write correctAnswer={challenge.answer ?? ""} onSubmit={handleAnswerSubmit} />
              ) : challenge.type === "MATCH" ? (
                <Match pairs={challenge.pairs ?? []} onSubmit={handleMatchSubmit} />
              ) : challenge.type === "FILL-IN" ? (
                <FillIn sentence={challenge.question} missingWord={challenge.answer ?? ""} onSubmit={handleAnswerSubmit} />
              ) : (
                <p>Tipo de desafío no soportado</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={pending} status={status} onCheck={onContinue} />
    </>
  );
};
