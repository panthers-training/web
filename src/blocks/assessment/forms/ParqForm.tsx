import { useState, useEffect, useCallback } from 'react';
import Stepper from '../../Stepper/index';

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  "¿Le ha dicho su médico alguna vez que padece una enfermedad cardiaca y que solo debe hacer aquella actividad física que le aconseje un médico?",
  "¿Tiene dolor en el pecho cuando hace actividad física?",
  "En el último mes, ¿ha tenido dolor en el pecho cuando no hacía actividad física?",
  "¿Pierde el equilibrio debido a mareos o se ha desmayado alguna vez?",
  "¿Tiene problemas en huesos o articulaciones (por ejemplo, espalda, rodilla o cadera) que puedan empeorar si aumenta la actividad física?",
  "¿Le receta su médico algún medicamento para la tensión arterial o un problema cardíaco?",
  "¿Conoce alguna razón por la cual no debería realizar actividad física?",
];

const TOTAL = QUESTIONS.length;

// ─── Types ────────────────────────────────────────────────────────────────────

type Answer = 'Sí' | 'No';
type Answers = Record<number, Answer>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// ─── Answer button ────────────────────────────────────────────────────────────

function AnswerButton({
  label,
  shortcut,
  selected,
  onClick,
}: {
  label: Answer;
  shortcut: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex items-center gap-4 px-6 py-4 border transition-all duration-200 text-sm font-medium tracking-wide focus:outline-none focus-visible:ring-1 focus-visible:ring-accent',
        selected
          ? 'bg-accent border-accent text-black'
          : 'border-white/20 text-white/60 hover:border-accent hover:text-white',
      )}
    >
      <span
        className={cn(
          'flex size-7 shrink-0 items-center justify-center border text-xs font-semibold tracking-widest transition-colors duration-200',
          selected
            ? 'border-black/20 text-black/60'
            : 'border-white/20 text-white/30 group-hover:border-accent/40 group-hover:text-accent/60',
        )}
      >
        {shortcut}
      </span>
      {label}
    </button>
  );
}

// ─── Question step ────────────────────────────────────────────────────────────

function QuestionStep({
  index,
  question,
  answer,
  onAnswer,
  onPrev,
  isFirst,
}: {
  index: number;
  question: string;
  answer: Answer | undefined;
  onAnswer: (a: Answer) => void;
  onPrev: () => void;
  isFirst: boolean;
}) {
  const progress = ((index) / TOTAL) * 100;

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="h-px w-full bg-white/10">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center flex-1 px-8 md:px-16 lg:px-24 max-w-3xl mx-auto w-full py-16">
        <span className="text-accent/50 text-xs font-medium tracking-[0.2em] uppercase mb-8">
          {pad(index + 1)} / {pad(TOTAL)}
        </span>

        <p className="text-white text-xl md:text-2xl lg:text-3xl font-medium leading-snug mb-12">
          {question}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <AnswerButton
            label="Sí"
            shortcut="S"
            selected={answer === 'Sí'}
            onClick={() => onAnswer('Sí')}
          />
          <AnswerButton
            label="No"
            shortcut="N"
            selected={answer === 'No'}
            onClick={() => onAnswer('No')}
          />
        </div>

        {!isFirst && (
          <button
            type="button"
            onClick={onPrev}
            className="mt-10 self-start text-white/30 text-xs tracking-widest uppercase hover:text-white/60 transition-colors duration-200 focus:outline-none focus-visible:text-white/60"
          >
            ← Anterior
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Result screen ────────────────────────────────────────────────────────────

function ResultScreen({
  answers,
  onRestart,
}: {
  answers: Answers;
  onRestart: () => void;
}) {
  const flagged = Object.entries(answers)
    .filter(([, a]) => a === 'Sí')
    .map(([i]) => Number(i));

  const cleared = flagged.length === 0;

  return (
    <div className="flex flex-col justify-center items-start h-full px-8 md:px-16 lg:px-24 max-w-3xl mx-auto w-full py-16">
      {cleared ? (
        <>
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-6">
            Resultado
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-semibold leading-tight mb-4">
            Listo para entrenar.
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10 max-w-lg">
            Respondiste "No" a todas las preguntas. No existe ninguna contraindicación conocida para iniciar un programa de actividad física supervisada.
          </p>
        </>
      ) : (
        <>
          <span className="text-red-400 text-xs font-medium tracking-[0.2em] uppercase mb-6">
            Atención
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-semibold leading-tight mb-4">
            Consulta con tu médico.
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-8 max-w-lg">
            Respondiste "Sí" a {flagged.length === 1 ? 'una pregunta' : `${flagged.length} preguntas`}. Se recomienda obtener autorización médica antes de iniciar o aumentar tu actividad física.
          </p>
          <ul className="flex flex-col gap-3 mb-10">
            {flagged.map((i) => (
              <li key={i} className="flex gap-3 items-start text-sm text-white/40 leading-snug">
                <span className="shrink-0 text-red-400/60 font-semibold">{pad(i + 1)}</span>
                {QUESTIONS[i]}
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors duration-200 focus:outline-none focus-visible:text-white/60"
      >
        ← Volver a empezar
      </button>
    </div>
  );
}

// ─── ParqForm ─────────────────────────────────────────────────────────────────

export default function ParqForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const isDone = step >= TOTAL;

  function handleAnswer(index: number, answer: Answer) {
    setAnswers((prev) => ({ ...prev, [index]: answer }));

    // Auto-advance after a brief pause so selection registers visually
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, TOTAL));
    }, 500);
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleRestart() {
    setStep(0);
    setAnswers({});
  }

  // Keyboard shortcuts: S → Sí, N → No
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (isDone) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 's') handleAnswer(step, 'Sí');
      if (e.key.toLowerCase() === 'n') handleAnswer(step, 'No');
    },
    [step, isDone],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  if (isDone) {
    return (
      <div className="h-[calc(100dvh-5rem)]">
        <ResultScreen answers={answers} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <Stepper
      step={step}
      onStepChange={setStep}
      variant="typeform"
      animation="slide-y"
      className="h-[calc(100dvh-5rem)]"
    >
      {QUESTIONS.map((question, index) => (
        <Stepper.Step key={index}>
          <QuestionStep
            index={index}
            question={question}
            answer={answers[index]}
            onAnswer={(answer) => handleAnswer(index, answer)}
            onPrev={handlePrev}
            isFirst={index === 0}
          />
        </Stepper.Step>
      ))}
    </Stepper>
  );
}
