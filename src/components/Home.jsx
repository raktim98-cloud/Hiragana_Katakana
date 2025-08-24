import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------- Hiragana + Katakana ----------------
const HIRAGANA_PAIRS = [
  ["あ","আ"],["い","ই"],["う","উ"],["え","এ"],["お","ও"],
  ["か","কা"],["き","কি"],["く","কু"],["け","কে"],["こ","কো"],
  ["さ","সা"],["し","শি"],["す","সু"],["せ","সে"],["そ","সো"],
  ["た","তা"],["ち","চি"],["つ","ত্সু"],["て","তে"],["と","তো"],
  ["な","না"],["に","নি"],["ぬ","নু"],["ね","নে"],["の","নো"],
  ["は","হা"],["ひ","হি"],["ふ","ফু"],["へ","হে"],["ほ","হো"],
  ["ま","মা"],["み","মি"],["む","মু"],["め","মে"],["も","মো"],
  ["や","ইয়া"],["ゆ","ইউ"],["よ","ইয়ো"],
  ["ら","রা"],["り","রি"],["る","রু"],["れ","রে"],["ろ","রো"],
  ["わ","ওয়া"],["を","ও"],["ん","ন"],

  // Dakuten / Handakuten
  ["が","গা"],["ぎ","গি"],["ぐ","গু"],["げ","গে"],["ご","গো"],
  ["ざ","জা"],["じ","জি"],["ず","জু"],["ぜ","জে"],["ぞ","জো"],
  ["だ","দা"],["ぢ","জি"],["づ","দ্জু"],["で","দে"],["ど","দো"],
  ["ば","বা"],["び","বি"],["ぶ","বু"],["べ","বে"],["ぼ","বো"],
  ["ぱ","পা"],["ぴ","পি"],["ぷ","পু"],["ぺ","পে"],["ぽ","পো"],

  // Yoon (small ゃゅょ)
  ["きゃ","ক্যা"],["きゅ","ক্যু"],["きょ","ক্যো"],
  ["しゃ","শ্যা"],["しゅ","শ্যু"],["しょ","শ্যো"],
  ["ちゃ","চ্যা"],["ちゅ","চ্যু"],["ちょ","চ্যো"],
  ["にゃ","ন্যা"],["にゅ","ন্যু"],["にょ","ন্যো"],
  ["ひゃ","হ্যা"],["ひゅ","হ্যু"],["ひょ","হ্যো"],
  ["みゃ","ম্যা"],["みゅ","ম্যু"],["みょ","ম্যো"],
  ["りゃ","র্যা"],["りゅ","র্যু"],["りょ","র্যো"],
  ["ぎゃ","গ্যা"],["ぎゅ","গ্যু"],["ぎょ","গ্যো"],
  ["じゃ","জ্যা"],["じゅ","জ্যু"],["じょ","জ্যো"],
  ["びゃ","ব্যা"],["びゅ","ব্যু"],["びょ","ব্যো"],
  ["ぴゃ","প্যা"],["ぴゅ","প্যু"],["ぴょ","প্যো"],
];

const KATAKANA_PAIRS = HIRAGANA_PAIRS.map(([h, b]) => {
  // Convert hiragana to katakana (Unicode shift)
  const kata = h.replace(/./g, ch =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
  return [kata, b];
});

// ---------------- Helpers ----------------
function shuffled(arr) {
  return arr.map(v => [Math.random(), v])
    .sort((a,b)=>a[0]-b[0])
    .map(v=>v[1]);
}
function sample(arr,n){ return shuffled(arr).slice(0,n); }

const QUESTIONS_COUNT = 50;

// ---------------- Score Animation Component ----------------
function AnimatedScore({ score, total, onReset }) {
  const percentage = (score / total) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreEmoji = () => {
    if (percentage >= 90) return "🏆";
    if (percentage >= 80) return "🎉";
    if (percentage >= 60) return "👍";
    return "💪";
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          className="text-6xl mb-4"
        >
          {getScoreEmoji()}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-bold mb-4 text-gray-800"
        >
          Quiz Complete!
        </motion.h2>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          className={`text-5xl font-bold mb-4 ${getScoreColor()}`}
        >
          {score} / {total}
        </motion.div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1, duration: 1 }}
          className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
            className={`h-full rounded-full ${
              percentage >= 80 ? "bg-green-500" :
              percentage >= 60 ? "bg-yellow-500" : "bg-red-500"
            }`}
          />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-xl text-gray-600 mb-6"
        >
          {percentage.toFixed(1)}% Correct
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          🔄 Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ---------------- Reusable Quiz ----------------
function Quiz({ title, PAIRS }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => { buildQuestions(); }, []);

  function buildQuestions() {
    const picked = sample(PAIRS, QUESTIONS_COUNT);
    const qs = picked.map((pair, idx) => {
      const [kana, bangla] = pair;
      const others = PAIRS.filter(p => p[1] !== bangla);
      const distract = sample(others, 3);
      const options = shuffled([pair, ...distract]).map(o => o[1]);
      return { idx, kana, options, answerKey: bangla };
    });
    setQuestions(qs);
    setAnswers({});
    setScore(null);
    setShowScore(false);
  }

  function handleSelect(qIdx, value) {
    setAnswers(prev => ({...prev, [qIdx]: value}));
  }

  function handleSubmit() {
    let correct = 0;
    questions.forEach(q => {
      if(answers[q.idx] === q.answerKey) correct++;
    });
    setScore(correct);
    setShowScore(true);
  }

  function handleReset() {
    setShowScore(false);
    setTimeout(() => {
      buildQuestions();
    }, 300);
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        {title}
      </h1>
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ An-Noor Japanese Language School ✨
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-2"
        >
          <span className="text-lg text-gray-600">Created by:</span>
          <motion.span
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            🎓 Shuvrow Adhikary
          </motion.span>
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={buildQuestions}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          🎲 New 50
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          ✅ Submit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map(q => (
          <div key={q.idx} className="bg-white shadow p-4 rounded-xl">
            <div className="text-center text-4xl font-bold mb-3">{q.kana}</div>
            <div className="space-y-2">
              {q.options.map(opt => (
                <label
                  key={opt}
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                    answers[q.idx] === opt ? "bg-indigo-100 border-indigo-400" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${q.idx}`}
                    value={opt}
                    checked={answers[q.idx] === opt}
                    onChange={() => handleSelect(q.idx, opt)}
                    className="hidden"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6 text-lg font-semibold">
        {score !== null && !showScore ? (
          <span>Score: {score} / {QUESTIONS_COUNT}</span>
        ) : (
          <span>Score: 0 / {QUESTIONS_COUNT}</span>
        )}
      </div>

      <AnimatePresence>
        {showScore && (
          <AnimatedScore 
            score={score} 
            total={QUESTIONS_COUNT} 
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------- Main Toggle ----------------
export default function Home() {
  const [mode, setMode] = useState("hiragana"); // "hiragana" | "katakana"

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center gap-4 p-4">
        {mode === "hiragana" ? (
          <button
            onClick={() => setMode("katakana")}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Switch to Katakana
          </button>
        ) : (
          <button
            onClick={() => setMode("hiragana")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:blue-700 transition-colors"
          >
            Switch to Hiragana
          </button>
        )}
      </div>

      {mode === "hiragana" ? (
        <Quiz title="Hiragana → Bangla MCQ (50 Random)" PAIRS={HIRAGANA_PAIRS} />
      ) : (
        <Quiz title="Katakana → Bangla MCQ (50 Random)" PAIRS={KATAKANA_PAIRS} />
      )}
    </div>
  );
}