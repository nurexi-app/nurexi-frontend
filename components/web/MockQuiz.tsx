"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const DEMO_QUESTIONS = [
  {
    question:
      "A patient's O₂ saturation drops to 88% post-operatively. What is the nurse's priority action?",
    options: [
      "Reposition the patient upright",
      "Administer supplemental oxygen",
      "Notify the physician immediately",
      "Document and continue monitoring",
    ],
    correct: 1,
    topic: "Respiratory",
    explanation:
      "Administering oxygen directly addresses hypoxia — the immediate physiological threat.",
  },
  {
    question:
      "Which assessment finding should alert the nurse to possible digoxin toxicity?",
    options: [
      "Heart rate of 88 bpm",
      "Blood pressure of 130/85",
      "Yellow-green halos in vision",
      "Urine output of 60 mL/hr",
    ],
    correct: 2,
    topic: "Pharmacology",
    explanation:
      "Visual disturbances like yellow-green halos are a classic sign of digoxin toxicity.",
  },
  {
    question:
      "A nurse notes serum potassium of 2.9 mEq/L. Which intervention is the priority?",
    options: [
      "Restrict fluid intake",
      "Place on cardiac monitor",
      "Administer a diuretic",
      "Encourage high-sodium diet",
    ],
    correct: 1,
    topic: "Electrolytes",
    explanation:
      "Hypokalemia predisposes to life-threatening arrhythmias — cardiac monitoring is essential.",
  },
];

const AUTO_ADVANCE_MS = 10000;

function MockQuizCard() {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [visibleOptions, setVisibleOptions] = useState<number[]>([]);
  const cardBodyRef = useRef<HTMLDivElement>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = DEMO_QUESTIONS[qIndex];
  const answered = selected !== null;

  const clearAuto = () => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
  };

  useEffect(() => {
    setVisibleOptions([]);
    setSelected(null);
    clearAuto();
    let i = 0;
    const reveal = () => {
      if (i < 4) {
        setVisibleOptions((prev) => [...prev, i]);
        i++;
        setTimeout(reveal, 200);
      }
    };
    setTimeout(reveal, 300);
  }, [qIndex]);

  useEffect(() => {
    if (!answered) return;
    clearAuto();
    autoTimer.current = setTimeout(() => {
      goToNext();
    }, AUTO_ADVANCE_MS);
    return clearAuto;
  }, [answered]);

  const goToNext = useCallback(() => {
    if (!cardBodyRef.current) return;
    gsap.to(cardBodyRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setQIndex((prev) => (prev + 1) % DEMO_QUESTIONS.length);
        gsap.fromTo(
          cardBodyRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
      },
    });
  }, []);

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
  };

  const isCorrect = selected === q.correct;

  const router = useRouter();
  return (
    <div className="w-full max-w-full">
      <div
        style={{
          background: "rgba(255,255,255,0.99)",
          borderRadius: 20,
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.09), 0 1px 0 rgba(255,255,255,0.9) inset",
          border: "1px solid rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div
          style={{
            padding: "0.75rem 1rem",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(42% 0.117 166.71)",
              background: "oklch(78.07% 0.117 166.71 / 0.1)",
              padding: "3px 12px",
              borderRadius: 999,
            }}
          >
            {q.topic}
          </span>
          <span style={{ fontSize: 11, color: "#bbb", fontWeight: 500 }}>
            {qIndex + 1} / {DEMO_QUESTIONS.length}
          </span>
        </div>

        {/* progress bar */}
        <div style={{ height: 3, background: "#f5f5f5" }}>
          <div
            style={{
              height: "100%",
              background: "oklch(78.07% 0.117 166.71)",
              width: `${((qIndex + 1) / DEMO_QUESTIONS.length) * 100}%`,
              transition: "width 0.6s ease",
            }}
          />
        </div>

        {/* body */}
        <div
          ref={cardBodyRef}
          style={{
            padding: "1rem",
            minHeight: 380,
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
          }}
        >
          {/* urge banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 12px",
              borderRadius: 10,
              background: answered
                ? isCorrect
                  ? "oklch(78.07% 0.117 166.71 / 0.08)"
                  : "rgba(239,68,68,0.07)"
                : "oklch(78.07% 0.117 166.71 / 0.08)",
              border: answered
                ? isCorrect
                  ? "1px solid oklch(78.07% 0.117 166.71 / 0.25)"
                  : "1px solid rgba(239,68,68,0.2)"
                : "1px solid oklch(78.07% 0.117 166.71 / 0.2)",
              transition: "all 0.3s ease",
              minHeight: 36,
            }}
          >
            <span style={{ fontSize: 14 }}>
              {answered ? (isCorrect ? "✅" : "❌") : ""}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: answered
                  ? isCorrect
                    ? "oklch(42% 0.117 166.71)"
                    : "rgb(185,28,28)"
                  : "oklch(42% 0.117 166.71)",
              }}
            >
              {answered
                ? isCorrect
                  ? "Correct! Great clinical thinking."
                  : `Not quite — the answer is option ${String.fromCharCode(65 + q.correct)}.`
                : "Choose the best answer below"}
            </span>
          </div>

          {/* question text */}
          <p
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              lineHeight: 1.55,
              color: "#1a1a1a",
              margin: 0,
              minHeight: 48,
            }}
          >
            {q.question}
          </p>

          {/* options */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
              flex: 1,
            }}
          >
            {q.options.map((opt, i) => {
              const isVisible = visibleOptions.includes(i);
              const isSelected = selected === i;
              const isCorrectOpt = i === q.correct;

              let bg = "#fafafa";
              let border = "1.5px solid #efefef";
              let letterBg = "#ebebeb";
              let letterColor = "#999";
              let textColor = "#555";

              if (answered) {
                if (isCorrectOpt) {
                  bg = "oklch(78.07% 0.117 166.71 / 0.09)";
                  border = "1.5px solid oklch(78.07% 0.117 166.71 / 0.5)";
                  letterBg = "oklch(78.07% 0.117 166.71)";
                  letterColor = "#fff";
                  textColor = "#1a1a1a";
                } else if (isSelected && !isCorrectOpt) {
                  bg = "rgba(239,68,68,0.06)";
                  border = "1.5px solid rgba(239,68,68,0.35)";
                  letterBg = "rgba(239,68,68,0.8)";
                  letterColor = "#fff";
                  textColor = "#555";
                }
              } else if (isSelected) {
                bg = "oklch(78.07% 0.117 166.71 / 0.07)";
                border = "1.5px solid oklch(78.07% 0.117 166.71 / 0.4)";
                letterBg = "oklch(78.07% 0.117 166.71)";
                letterColor = "#fff";
              }

              return (
                <div
                  key={i}
                  onClick={() => handleSelect(i)}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateX(0)" : "translateX(-8px)",
                    transition:
                      "opacity 0.25s ease, transform 0.25s ease, background 0.2s, border-color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 11px",
                    borderRadius: 11,
                    border,
                    background: bg,
                    cursor: answered ? "default" : "pointer",
                    minHeight: 42,
                    userSelect: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (answered) return;
                    (e.currentTarget as HTMLDivElement).style.border =
                      "1.5px solid oklch(78.07% 0.117 166.71 / 0.4)";
                    (e.currentTarget as HTMLDivElement).style.background =
                      "oklch(78.07% 0.117 166.71 / 0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (answered) return;
                    (e.currentTarget as HTMLDivElement).style.border =
                      isSelected
                        ? "1.5px solid oklch(78.07% 0.117 166.71 / 0.4)"
                        : "1.5px solid #efefef";
                    (e.currentTarget as HTMLDivElement).style.background =
                      isSelected
                        ? "oklch(78.07% 0.117 166.71 / 0.07)"
                        : "#fafafa";
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: letterBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: letterColor,
                      flexShrink: 0,
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      color: textColor,
                      lineHeight: 1.35,
                      flex: 1,
                    }}
                  >
                    {opt}
                  </span>
                  {answered && isCorrectOpt && (
                    <span style={{ fontSize: 13, flexShrink: 0 }}>✓</span>
                  )}
                  {answered && isSelected && !isCorrectOpt && (
                    <span style={{ fontSize: 13, flexShrink: 0 }}>✗</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* explanation + next */}
          {answered && (
            <div
              style={{
                borderTop: "1px solid #f0f0f0",
                paddingTop: "0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                animation: "fadeUp 0.35s ease both",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#666",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                💡 {q.explanation}
              </p>
              {qIndex < 2 ? (
                <button
                  onClick={goToNext}
                  style={{
                    alignSelf: "flex-end",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "oklch(42% 0.117 166.71)",
                    background: "oklch(78.07% 0.117 166.71 / 0.1)",
                    border: "1px solid oklch(78.07% 0.117 166.71 / 0.25)",
                    borderRadius: 8,
                    padding: "5px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  Next question →
                </button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => router.push("/learner/practice")}
                  className="w-[47%] sm:w-auto hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
                  size="default"
                >
                  Start Practice →
                </Button>
              )}
            </div>
          )}

          {/* dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 5,
              paddingTop: 4,
            }}
          >
            {DEMO_QUESTIONS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === qIndex ? 18 : 5,
                  height: 5,
                  borderRadius: 99,
                  background:
                    i === qIndex
                      ? "oklch(78.07% 0.117 166.71)"
                      : i < qIndex
                        ? "oklch(78.07% 0.117 166.71 / 0.3)"
                        : "#e0e0e0",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockQuizCard;
