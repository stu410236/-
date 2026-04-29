import React, { useState, useEffect, useRef } from 'react';
import { Feather, Lightbulb, Check, X, ArrowRight, RotateCcw, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 花草紋路 SVG 元件 (植物藤蔓)
const FloralCorner = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 主莖 */}
    <path d="M-10 -10 Q 30 20 80 80" stroke="currentColor" strokeWidth="0.75" fill="none" />
    {/* 葉片 */}
    <path d="M 15 5 Q 30 -5 40 10 Q 25 20 15 5" fill="currentColor" opacity="0.7" />
    <path d="M 5 15 Q -5 30 10 40 Q 20 25 5 15" fill="currentColor" opacity="0.5" />
    <path d="M 40 30 Q 55 20 65 35 Q 50 45 40 30" fill="currentColor" opacity="0.6" />
    <path d="M 30 40 Q 20 55 35 65 Q 45 50 30 40" fill="currentColor" opacity="0.8" />
    <path d="M 60 55 Q 75 45 80 60 Q 65 70 60 55" fill="currentColor" opacity="0.5" />
    {/* 裝飾性花苞/點綴 */}
    <circle cx="50" cy="15" r="1.5" fill="currentColor" opacity="0.8" />
    <circle cx="20" cy="45" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="70" cy="45" r="2" fill="currentColor" opacity="0.8" />
  </svg>
);

// 單字庫：用於隨機生成題目
const WORD_POOL = [
  'apple', 'cat', 'hello', 'world', 'peace', 'dream', 'smile', 'light', 
  'heart', 'water', 'music', 'plant', 'ocean', 'river', 'stone', 'magic', 
  'truth', 'faith', 'brave', 'cloud', 'dance', 'earth', 'flame', 'ghost', 
  'happy', 'juice', 'knife', 'lemon', 'mouse', 'night', 'onion', 'piano', 
  'queen', 'radio', 'snake', 'train', 'uncle', 'voice', 'watch', 'youth', 'zebra'
];

// 凱薩密碼加密函數
const caesarCipher = (text: string, shift: number) => {
  return text.split('').map(char => {
    if (char >= 'a' && char <= 'z') {
      return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
    }
    return char;
  }).join('');
};

// 動態生成關卡資料
const generateLevels = () => {
  // 隨機打亂單字庫並取出前 6 個單字
  const shuffledWords = [...WORD_POOL].sort(() => 0.5 - Math.random());
  
  // 第 6 關的隨機位移量 (1~25)
  const randomShift = Math.floor(Math.random() * 25) + 1;

  const levelConfigs = [
    {
      id: 1,
      title: "第一封信：初識",
      goal: "理解替換的藝術（位移 1）",
      shift: 1,
      answer: shuffledWords[0],
      hints: [
        "親愛的朋友，請觀察字母表：每個字母都向前移動了 1 個位置。",
        "例如：明文的 'a' 加密後會變成 'b'。",
        "請嘗試將信件中的每個字母往回推 1 格，你就能看見我的真心。"
      ]
    },
    {
      id: 2,
      title: "第二封信：探索",
      goal: "找出不同的位移常數（位移 2）",
      shift: 2,
      answer: shuffledWords[1],
      hints: [
        "這次的步伐稍有不同，常數不再是 1 了。",
        "每個字母都優雅地移動了 2 格。",
        "試著將每個字母往回推 2 格吧。"
      ]
    },
    {
      id: 3,
      title: "第三封信：羅馬的智慧",
      goal: "解密經典的凱薩密碼（位移 3）",
      shift: 3,
      answer: shuffledWords[2],
      hints: [
        "歷史上的凱薩大帝，習慣使用常數為 3 的位移來傳遞軍情。",
        "試著將密文中的每個字母，在字母表上向左平移 3 格。",
        "例如：'k' 往回推 3 格會變成 'h'。期待你的回信。"
      ]
    },
    {
      id: 4,
      title: "第四封信：漸行漸遠",
      goal: "適應更大的位移（位移 5）",
      shift: 5,
      answer: shuffledWords[3],
      hints: [
        "我們之間的距離似乎變遠了，這次字母移動了 5 格。",
        "你可以利用手指頭算算看，或者寫下字母表來對照。",
        "將密文往回推 5 格，就能找回原本的字。"
      ]
    },
    {
      id: 5,
      title: "第五封信：半個輪迴",
      goal: "解密 ROT13（位移 13）",
      shift: 13,
      answer: shuffledWords[4],
      hints: [
        "13 是一個特別的數字，它剛好是 26 個英文字母的一半。",
        "這意味著加密和解密是同一個動作！",
        "往前推 13 格，或往後推 13 格，結果都是一樣的。"
      ]
    },
    {
      id: 6,
      title: "第六封信：未知的謎團",
      goal: "挑戰未知常數的隨機位移",
      shift: randomShift,
      answer: shuffledWords[5],
      hints: [
        "這是我給你的最終考驗，我沒有寫下移動了幾格。",
        "你需要自己觀察字母的排列，猜測可能的單字。",
        "提示：這是一個常見的英文單字，試著推敲母音（a, e, i, o, u）可能的位置。"
      ]
    }
  ];

  // 根據設定的 shift 自動加密單字產生 cipherText
  return levelConfigs.map(level => ({
    ...level,
    cipherText: caesarCipher(level.answer, level.shift)
  }));
};

// 字體樣式設定
const zhiMangXing = { fontFamily: "'Zhi Mang Xing', cursive" };
const kleeOne = { fontFamily: "'Klee One', cursive" };
const caveat = { fontFamily: "'Caveat', cursive" };

export default function App() {
  const [levels, setLevels] = useState<any[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化關卡
  useEffect(() => {
    setLevels(generateLevels());
  }, []);

  const currentLevel = levels[currentLevelIndex];
  const isGameCompleted = levels.length > 0 && currentLevelIndex >= levels.length;

  useEffect(() => {
    if (!isGameCompleted && status === 'idle' && currentLevel) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentLevelIndex, status, isGameCompleted, currentLevel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === 'correct') {
      goToNextLevel();
      return;
    }

    if (!userInput.trim()) return;

    const formattedInput = userInput.trim().toLowerCase();
    if (formattedInput === currentLevel.answer) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  const goToNextLevel = () => {
    setCurrentLevelIndex(prev => prev + 1);
    setUserInput("");
    setShowHint(false);
    setStatus('idle');
  };

  const restartGame = () => {
    setLevels(generateLevels()); // 重新生成隨機關卡
    setCurrentLevelIndex(0);
    setUserInput("");
    setShowHint(false);
    setStatus('idle');
  };

  // 確保關卡載入完成前不渲染
  if (levels.length === 0) return null;

  // 破關畫面
  if (isGameCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: '#D8D3C8', ...kleeOne, color: '#5D564D' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full bg-[#F5F2EB] shadow-[0_15px_40px_rgba(0,0,0,0.08)] p-12 text-center relative overflow-hidden"
        >
          <FloralCorner className="absolute top-0 left-0 w-32 h-32 text-[#8B9A91] opacity-50 -translate-x-4 -translate-y-4" />
          <FloralCorner className="absolute bottom-0 right-0 w-32 h-32 text-[#B89D98] opacity-50 rotate-180 translate-x-4 translate-y-4" />
          
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center mb-6 text-[#B89D98] relative z-10"
          >
            <Mail size={48} strokeWidth={1} />
          </motion.div>
          
          <h1 className="text-5xl mb-6 relative z-10" style={zhiMangXing}>信件已全數解開</h1>
          <p className="text-[#6B635A] mb-10 leading-loose text-lg relative z-10">
            恭喜你，讀懂了所有隱藏在字裡行間的秘密。<br />
            凱薩密碼雖已成為歷史，<br />
            但這份傳遞心意的方式，將永遠流傳。
          </p>
          
          <div className="relative z-10">
            <button 
              onClick={restartGame}
              className="flex items-center justify-center w-full space-x-2 bg-[#8B9A91] hover:bg-[#7A8980] text-[#F5F2EB] py-3 px-6 rounded-sm transition-colors tracking-widest"
            >
              <RotateCcw size={18} strokeWidth={1.5} />
              <span>重新閱讀信箋</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-[#8B9A91] selection:text-white" style={{ backgroundColor: '#D8D3C8', ...kleeOne, color: '#5D564D' }}>
      
      {/* Header */}
      <div className="mb-8 text-center z-10">
        <h1 className="text-5xl mb-2 text-[#5D564D]" style={zhiMangXing}>古典密碼學</h1>
        <p className="text-[#8B9A91] text-lg tracking-widest">一封來自過去的信箋</p>
      </div>

      {/* Main Letter Card */}
      <div className="max-w-xl w-full bg-[#F5F2EB] shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative z-10 p-10 sm:p-16 overflow-hidden">
        
        {/* Floral Corners */}
        <FloralCorner className="absolute top-0 left-0 w-48 h-48 text-[#B89D98] opacity-40 -translate-x-8 -translate-y-8 pointer-events-none" />
        <FloralCorner className="absolute bottom-0 right-0 w-48 h-48 text-[#8B9A91] opacity-40 rotate-180 translate-x-8 translate-y-8 pointer-events-none" />

        {/* Ruled Lines Background (信紙橫線) */}
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'linear-gradient(transparent 95%, #D5CEC4 95%)', backgroundSize: '100% 2.5rem', marginTop: '4rem' }}></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevelIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Level Info Header */}
            <div className="flex justify-between items-end mb-8 border-b border-[#D5CEC4] pb-4">
              <div>
                <h2 className="text-4xl text-[#5D564D]" style={zhiMangXing}>{currentLevel.title}</h2>
                <p className="text-sm text-[#8B9A91] mt-2 tracking-wider">目標：{currentLevel.goal}</p>
              </div>
              <div className="text-[#B89D98] text-sm tracking-widest">
                信件 {currentLevel.id} / {levels.length}
              </div>
            </div>

            {/* Document Content */}
            <div>
              {/* Cipher Text Display */}
              <div className="mb-12 text-center mt-8">
                <p className="text-sm text-[#B89D98] mb-4 tracking-widest">加密訊息</p>
                <div className="py-4">
                  <span className="text-6xl text-[#5D564D] tracking-[0.2em]" style={caveat}>
                    {currentLevel.cipherText}
                  </span>
                </div>
              </div>

              {/* User Input Form */}
              <form onSubmit={handleSubmit} className="mb-10">
                <label className="block text-lg text-[#8B9A91] mb-6 text-center">請寫下你的解讀：</label>
                <div className="relative max-w-xs mx-auto">
                  <motion.input 
                    ref={inputRef}
                    type="text" 
                    value={userInput}
                    onChange={handleInputChange}
                    disabled={status === 'correct'}
                    animate={status === 'incorrect' ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.3 }}
                    style={caveat}
                    className={`w-full bg-transparent border-b-2 py-2 px-8 text-4xl text-center outline-none transition-colors
                      ${status === 'idle' ? 'border-[#D5CEC4] text-[#5D564D] focus:border-[#8B9A91]' : ''}
                      ${status === 'correct' ? 'border-[#8B9A91] text-[#8B9A91]' : ''}
                      ${status === 'incorrect' ? 'border-[#B89D98] text-[#B89D98]' : ''}
                    `}
                    placeholder=""
                    autoComplete="off"
                    spellCheck="false"
                  />
                  
                  {/* Status Icons */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    {status === 'correct' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Check className="text-[#8B9A91]" size={24} strokeWidth={2} /></motion.div>}
                    {status === 'incorrect' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><X className="text-[#B89D98]" size={24} strokeWidth={2} /></motion.div>}
                  </div>
                </div>

                <div className="h-6 mt-4 text-center">
                  <AnimatePresence>
                    {status === 'incorrect' && (
                      <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="text-[#B89D98] text-sm tracking-wide"
                      >
                        筆跡似乎不太對，請再試一次。
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-center">
                  {status !== 'correct' ? (
                    <button 
                      type="submit"
                      className="bg-[#8B9A91] hover:bg-[#7A8980] text-[#F5F2EB] text-sm py-3 px-8 rounded-sm transition-colors flex items-center space-x-2 tracking-widest"
                    >
                      <Feather size={18} strokeWidth={1.5} />
                      <span>落筆回覆</span>
                    </button>
                  ) : (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="submit"
                      className="bg-[#B89D98] hover:bg-[#A68C87] text-[#F5F2EB] text-sm py-3 px-8 rounded-sm transition-colors flex items-center space-x-2 tracking-widest shadow-lg shadow-[#B89D98]/20"
                    >
                      <span>拆開下一封信</span>
                      <ArrowRight size={18} strokeWidth={1.5} />
                    </motion.button>
                  )}
                </div>
              </form>

              {/* Hint Section */}
              <div className="mt-12 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center space-x-2 text-[#A39B92] hover:text-[#6B635A] transition-colors text-sm tracking-widest mx-auto"
                >
                  <Lightbulb size={16} strokeWidth={1.5} className={showHint ? "text-[#B89D98]" : ""} />
                  <span>{showHint ? "闔上附註" : "查看附註 (P.S.)"}</span>
                </button>
                
                <AnimatePresence>
                  {showHint && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 p-6 bg-white/40 border border-[#D5CEC4]/50 rounded-sm">
                        <ul className="space-y-4 text-[#6B635A] text-lg leading-relaxed">
                          {currentLevel.hints.map((hint, index) => (
                            <motion.li 
                              key={index} 
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-3"
                            >
                              <span className="text-[#B89D98] font-serif mt-1 text-sm">✦</span>
                              <span>{hint}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
    </div>
  );
}