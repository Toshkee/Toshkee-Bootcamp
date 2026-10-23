import type { Metadata } from "next";
import { Review, type ReviewCard } from "@/components/review/review";
import { Md } from "@/components/ui/md";
import { allLessons, lessonHref } from "@/content/curriculum";

export const metadata: Metadata = { title: "Ponavljanje" };

export default function ReviewPage() {
  const cards: ReviewCard[] = allLessons.flatMap((ref) =>
    ref.lesson.flashcards.map((c) => ({
      id: c.id,
      front: <Md tight className="text-[22px] leading-snug text-fg sm:text-[24px]">{c.front}</Md>,
      back: <Md tight className="text-[17px]">{c.back}</Md>,
      lessonTitle: ref.lesson.title,
      lessonHref: lessonHref(ref),
      moduleTitle: ref.module.title,
      hue: ref.module.hue,
    })),
  );
  return <Review cards={cards} />;
}
