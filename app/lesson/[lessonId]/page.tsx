import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { Quiz } from "../quiz";

type LessonIdPageProps = {
  params: {
    lessonId: string;
  };
};

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
  const lessonData = getLesson(Number(params.lessonId));
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) return redirect("/learn");

  const formattedChallenges = lesson.challenges.map((challenge) => ({
    id: challenge.id,
    lessonId: challenge.lessonId,
    order: challenge.order,
    type: challenge.type,
    question: challenge.question,
    completed: challenge.completed,
    options: challenge.options,
    answer: typeof challenge.answer === "string" ? challenge.answer : undefined,
    pairs: Array.isArray(challenge.pairs)
      ? challenge.pairs.map((pair: any) => ({
          left: typeof pair.left === "string" ? pair.left : "",
          right: typeof pair.right === "string" ? pair.right : "",
        }))
      : undefined,
    imageSrc: typeof challenge.imageSrc === "string" ? challenge.imageSrc : null,
    audioSrc: typeof challenge.audioSrc === "string" ? challenge.audioSrc : null,
  }));  

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length / lesson.challenges.length) * 100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={formattedChallenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  );
};

export default LessonIdPage;
