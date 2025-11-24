import { useState } from "react";
import {
  triviaQuestions,
  personalityQuestions,
  personalityResults,
} from "../quizData.js";

function TriviaQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = triviaQuestions[index];

  const handleSelect = (option) => {
    setSelected(option);
    const correct = option === current.answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (index + 1 >= triviaQuestions.length) {
      setFinished(true);
    } else {
      setIndex((prev) => prev + 1);
      setSelected(null);
      setIsCorrect(null);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="quiz-card">
        <h2 className="quiz-title">Trivia Results</h2>
        <p className="quiz-score">
          You scored <span>{score}</span> out of {triviaQuestions.length}
        </p>
        <button className="quiz-primary-btn" onClick={handleRestart}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <div className="quiz-header-row">
        <h2 className="quiz-title">Anime Trivia</h2>
        <span className="quiz-progress">
          Q {index + 1} / {triviaQuestions.length}
        </span>
      </div>

      <p className="quiz-question">{current.question}</p>

      <div className="quiz-options">
        {current.options.map((opt) => {
          const isSelected = selected === opt;

          let extraClass = "";
          if (selected) {
            if (opt === current.answer) extraClass = "correct";
            else if (isSelected && !isCorrect) extraClass = "wrong";
          }

          return (
            <button
              key={opt}
              className={`quiz-option ${
                isSelected ? "selected" : ""
              } ${extraClass}`}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <button
        className="quiz-primary-btn"
        onClick={handleNext}
        disabled={!selected}
      >
        {index + 1 === triviaQuestions.length ? "Finish Quiz" : "Next Question"}
      </button>
    </div>
  );
}

function PersonalityQuiz() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [resultKey, setResultKey] = useState(null);

  const current = personalityQuestions[index];

  const handleSelect = (value) => {
    setSelected(value);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (index + 1 >= personalityQuestions.length) {
      const counts = newAnswers.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      setResultKey(best);
    } else {
      setIndex((prev) => prev + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setAnswers([]);
    setSelected(null);
    setResultKey(null);
  };

  if (resultKey) {
    const result = personalityResults[resultKey];
    return (
      <div className="quiz-card">
        <h2 className="quiz-title">Your Anime Match</h2>
        <div className="quiz-result-card">
          <p className="quiz-result-label">You are most like...</p>
          <h3 className="quiz-result-name">{result.name}</h3>
          <p className="quiz-result-anime">{result.anime}</p>
          <p className="quiz-result-desc">{result.description}</p>
        </div>
        <button className="quiz-primary-btn" onClick={handleRestart}>
          Take Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <div className="quiz-header-row">
        <h2 className="quiz-title">Which Character Are You?</h2>
        <span className="quiz-progress">
          Q {index + 1} / {personalityQuestions.length}
        </span>
      </div>

      <p className="quiz-question">{current.question}</p>

      <div className="quiz-options">
        {current.options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              className={`quiz-option ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <button
        className="quiz-primary-btn"
        onClick={handleNext}
        disabled={!selected}
      >
        {index + 1 === personalityQuestions.length ? "See Result" : "Next"}
      </button>
    </div>
  );
}

export default function AnimeQuizPage() {
  const [tab, setTab] = useState("trivia");

  return (
    <div className="quiz-page">
      <header className="quiz-page-header">
        <h1>AniPulse Quiz Hub</h1>
        <p>
          Test your anime knowledge or find out which anime character you’re most like.
        </p>
      </header>

      <div className="quiz-tabs">
        <button
          className={`quiz-tab ${tab === "trivia" ? "active" : ""}`}
          onClick={() => setTab("trivia")}
        >
          Trivia Quiz
        </button>
        <button
          className={`quiz-tab ${tab === "personality" ? "active" : ""}`}
          onClick={() => setTab("personality")}
        >
          Who Are You?
        </button>
      </div>

      {tab === "trivia" ? <TriviaQuiz /> : <PersonalityQuiz />}
    </div>
  );
}
