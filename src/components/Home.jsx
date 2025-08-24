import React, { useState, useEffect } from "react";

// ---------------- Hiragana + Katakana ----------------
const HIRAGANA_PAIRS = [
  ["あ","আ"],["い","ই"],["う","উ"],["え","এ"],["お","ও"],
  ["か","কা"],["き","কি"],["く","কু"],["け","কে"],["こ","কো"],
  ["さ","সা"],["し","শি"],["す","সু"],["せ","সে"],["そ","সো"],
  ["た","তা"],["ち","চি"],["つ","ত্সু"],["て","তে"],["と","তো"],
  ["な","না"],["に","নি"],["ぬ","নু"],["ね","নে"],["の","নো"],
  ["は","হা"],["ひ","হি"],["ふ","ফু"],["へ","হে"],["ほ","হো"],
  ["ま","মা"],["み","মি"],["む","মু"],["め","মে"],["も","মো"],
  ["や","ইয়া"],["ゆ","ইউ"],["よ","ইয়ো"],
  ["ら","রা"],["り","রি"],["る","রু"],["れ","রে"],["ろ","রো"],
  ["わ","ওয়া"],["を","ও"],["ん","ন"],

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

// ---------------- Reusable Quiz ----------------
function Quiz({ title, PAIRS }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

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
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        {title}
      </h1>
      <h1 className="text-2xl font-bold text-center mb-6">
        An-Noor Japanese Language School, Created By:- 
        <h2><span className="bg-blue-300 text-black text-xl font-bold px-2 py-1 rounded-[10px]">Shuvrow Adhikary</span></h2>
      </h1>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={buildQuestions}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          🎲 New 50
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
                    answers[q.idx] === opt ? "bg-indigo-100 border-indigo-400" : "border-gray-300"
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
        {score !== null ? (
          <span>Score: {score} / {QUESTIONS_COUNT}</span>
        ) : (
          <span>Score: 0 / {QUESTIONS_COUNT}</span>
        )}
      </div>
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
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Switch to Katakana
          </button>
        ) : (
          <button
            onClick={() => setMode("hiragana")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
