import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { Quiz } from "./quiz";

const LessonPage = async () => {
  const lessonData = getLesson();
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) return redirect("/learn");

  // 🔹 Transformamos los retos para que tengan el tipo correcto
  const formattedChallenges = lesson.challenges.map((challenge) => ({
    id: challenge.id,
    order: challenge.order,
    lessonId: challenge.lessonId,
    type: challenge.type,
    question: challenge.question,
    completed: challenge.completed,
    options: Array.isArray(challenge.options) ? challenge.options : [],
    answer: typeof challenge.answer === "string" ? challenge.answer : "",
    pairs: Array.isArray(challenge.pairs) ? challenge.pairs : [],
  }));

  const initialPercentage =
    lesson.challenges.length > 0
      ? (lesson.challenges.filter((challenge) => challenge.completed).length / lesson.challenges.length) * 100
      : 0;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={formattedChallenges} // ✅ Ahora pasamos los datos corregidos
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  );
};

export default LessonPage;
