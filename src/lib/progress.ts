"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dayKey } from "./dates";
import { newCard, schedule, type CardState, type Grade } from "./srs";

/**
 * Sav tvoj napredak, sačuvan u localStorage-u browsera (ključ "bootcamp-progress").
 * Ovo je Zustand store sa `persist` middleware-om, isti obrazac kao u ReformStudio-u i Looply-ju.
 */
interface ProgressState {
  /** lessonKey → kada je završena */
  completed: Record<string, number>;
  /** exercise id → kada je rešena */
  solved: Record<string, number>;
  /** exercise id → tvoj poslednji kod */
  drafts: Record<string, string>;
  /** quiz id → (indeks pitanja → izabran odgovor) */
  quizzes: Record<string, Record<number, number>>;
  /** terminal id → broj završenih koraka */
  terminals: Record<string, number>;
  /** flashcard id → stanje ponavljanja */
  cards: Record<string, CardState>;
  /** dani sa aktivnošću, "YYYY-MM-DD" */
  days: string[];
  lastLesson?: string;

  touch: () => void;
  visitLesson: (key: string) => void;
  completeLesson: (key: string, cardIds: string[]) => void;
  uncompleteLesson: (key: string) => void;
  markSolved: (exerciseId: string) => void;
  saveDraft: (exerciseId: string, code: string) => void;
  answerQuiz: (quizId: string, question: number, choice: number) => void;
  resetQuiz: (quizId: string) => void;
  advanceTerminal: (terminalId: string, steps: number) => void;
  resetTerminal: (terminalId: string) => void;
  gradeCard: (cardId: string, grade: Grade) => void;
  resetAll: () => void;
}

const initial = {
  completed: {},
  solved: {},
  drafts: {},
  quizzes: {},
  terminals: {},
  cards: {},
  days: [] as string[],
  lastLesson: undefined,
};

const omit = <T,>(obj: Record<string, T>, key: string) => {
  const copy = { ...obj };
  delete copy[key];
  return copy;
};

const withToday = (days: string[]) => {
  const today = dayKey();
  return days.includes(today) ? days : [...days, today];
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,

      touch: () => set((s) => ({ days: withToday(s.days) })),

      visitLesson: (key) => set({ lastLesson: key }),

      completeLesson: (key, cardIds) =>
        set((s) => {
          const cards = { ...s.cards };
          for (const id of cardIds) cards[id] ??= newCard();
          return {
            completed: { ...s.completed, [key]: s.completed[key] ?? Date.now() },
            cards,
            days: withToday(s.days),
          };
        }),

      uncompleteLesson: (key) => set((s) => ({ completed: omit(s.completed, key) })),

      markSolved: (id) =>
        set((s) => ({
          solved: { ...s.solved, [id]: s.solved[id] ?? Date.now() },
          days: withToday(s.days),
        })),

      saveDraft: (id, code) => set((s) => ({ drafts: { ...s.drafts, [id]: code } })),

      answerQuiz: (quizId, question, choice) =>
        set((s) => ({
          quizzes: { ...s.quizzes, [quizId]: { ...s.quizzes[quizId], [question]: choice } },
          days: withToday(s.days),
        })),

      resetQuiz: (quizId) => set((s) => ({ quizzes: omit(s.quizzes, quizId) })),

      advanceTerminal: (id, steps) =>
        set((s) => ({
          terminals: { ...s.terminals, [id]: Math.max(s.terminals[id] ?? 0, steps) },
          days: withToday(s.days),
        })),

      resetTerminal: (id) => set((s) => ({ terminals: omit(s.terminals, id) })),

      gradeCard: (id, grade) =>
        set((s) => ({
          cards: { ...s.cards, [id]: schedule(s.cards[id] ?? newCard(), grade) },
          days: withToday(s.days),
        })),

      resetAll: () => set(initial),
    }),
    { name: "bootcamp-progress", version: 1 },
  ),
);
