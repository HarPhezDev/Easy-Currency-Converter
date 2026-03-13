import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiSun, FiMoon } from "react-icons/fi";

const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;900&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const currencies = [
  { code: "USD", name: "US Dollar", color: "#00BFFF" },
  { code: "NGN", name: "Nigerian Naira", color: "#008000" },
  { code: "EUR", name: "Euro", color: "#003399" },
  { code: "GBP", name: "British Pound", color: "#A52A2A" },
  { code: "JPY", name: "Japanese Yen", color: "#FF4500" },
  { code: "CAD", name: "Canadian Dollar", color: "#FF0000" },
  { code: "AUD", name: "Australian Dollar", color: "#1E90FF" },
  { code: "CHF", name: "Swiss Franc", color: "#008000" },
  { code: "CNY", name: "Chinese Yuan", color: "#FF0000" },
  { code: "INR", name: "Indian Rupee", color: "#FF9933" },
];

const currencySymbols = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "$",
  AUD: "$",
  CHF: "CHF",
  CNY: "¥",
  INR: "₹",
};


const FloatingCurrency = ({ symbol, color }) => {
  const [coords] = useState({
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 2,
  });

  return (
    <motion.div
      initial={{ x: `${coords.x}vw`, y: `${coords.y}vh`, opacity: 0 }}
      animate={{
        x: [`${coords.x - 5}vw`, `${coords.x + 5}vw`],
        y: [`${coords.y - 5}vh`, `${coords.y + 5}vh`],
        opacity: [0, 0.5, 0.5, 0],
        scale: [0.8, 1.2, 0.8],
        rotate: [0, 90, -90, 0],
      }}
      transition={{
        duration: coords.duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay: coords.delay,
      }}
      className="absolute pointer-events-none select-none text-3xl sm:text-4xl md:text-5xl font-black z-0"
      style={{ color }}
    >
      {symbol}
    </motion.div>
  );
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("NGN");
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [swapAnim, setSwapAnim] = useState(0);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });
  const [error, setError] = useState(null);

  // Convert with short delay
  const convert = async () => {
    setConverting(true);
    setConverted(false);
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      if (!res.ok) throw new Error("Failed to fetch rates");

      const data = await res.json();
      setRate(data.rates[to]);

      setConverted(true);
      setTimeout(() => setConverted(false), 1500);
    } catch (err) {
      console.error(err);
      setError("Conversion failed. Try again later.");
    } finally {
      setConverting(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    convert();
  }, [from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setSwapAnim((prev) => prev + 360);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  const numericAmount = parseFloat(amount) || 0;
  const rawResult = numericAmount * rate;
  const formattedResult =
    rawResult > 1_000_000_000
      ? `${(rawResult / 1_000_000_000).toFixed(2)}B`
      : rawResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-black via-gray-900 to-black"
    : "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300";
  const cardBg = darkMode ? "bg-white/5" : "bg-white/80";
  const cardBorder = darkMode ? "border-white/10" : "border-gray-300";
  const textColor = darkMode ? "text-white" : "text-black";
  const secondaryText = darkMode ? "text-gray-400" : "text-gray-700";

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 transition-colors duration-500 overflow-hidden ${bgGradient}`} style={{ fontFamily: "'Poppins', sans-serif" }}>

      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => {
          const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
          return <FloatingCurrency key={i} symbol={currencySymbols[randomCurrency.code]} color={randomCurrency.color} />;
        })}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* HEADER */}
        <motion.div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10 max-w-2xl" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="text-center md:text-left flex-1 whitespace-nowrap">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black ${textColor}`}>
              Easy Currency Converter
            </h1>
            <p className={`${secondaryText} mt-2 text-sm sm:text-base md:text-lg font-medium`}>Convert currencies in real time with the latest market rates.</p>
          </div>
          <button onClick={handleDarkModeToggle} className="mt-4 md:mt-0 p-3 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-md border border-white/10">
            {darkMode ? <FiSun className="text-yellow-400 w-6 h-6" /> : <FiMoon className="text-gray-900 w-6 h-6" />}
          </button>
        </motion.div>

        {/* CONVERTER CARD */}
        <motion.div className={`w-full max-w-xl p-6 sm:p-10 rounded-3xl backdrop-blur-xl ${cardBg} border ${cardBorder} shadow-2xl`} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          {/* AMOUNT INPUT */}
          <div className="mb-4 sm:mb-6">
            <label className={`text-xs sm:text-sm font-bold uppercase tracking-widest ${secondaryText}`}>Enter Amount</label>
            <div className="relative mt-2">
              <span className={`absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-xl sm:text-2xl ${secondaryText}`}>{currencySymbols[from]}</span>
              <input
                type="number"
                value={amount}
                min="0"
                max="1000000000"
                step="any"
                onChange={(e) => setAmount(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                className={`w-full border rounded-xl pl-10 sm:pl-12 pr-4 py-4 sm:py-5 text-xl sm:text-2xl font-bold outline-none transition-all ${darkMode ? "bg-black/50 border-white/10 text-white focus:border-green-400" : "bg-white border-gray-300 text-black focus:border-green-500"}`}
              />
            </div>
          </div>

          {/* QUICK BUTTONS */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            {[10, 50, 100, 500].map((v) => (
              <button key={v} onClick={() => setAmount(v.toString())} className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-bold shadow-md transition-all ${darkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}>
                {currencySymbols[from]}{v}
              </button>
            ))}
          </div>

          {/* CURRENCY SELECT */}
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
            <div className="flex-1 relative w-full md:w-auto">
              <label className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${secondaryText}`}>From</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className={`w-full mt-2 rounded-xl p-3 sm:p-4 font-bold appearance-none outline-none border ${darkMode ? "bg-black border-white/10 text-white" : "bg-white border-gray-300 text-black"}`}>
                {currencies.map((c) => <option key={c.code} value={c.code}>{c.name} – {c.code}</option>)}
              </select>
              <FiChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${secondaryText}`} />
            </div>

            <motion.button onClick={swap} className={`mt-4 md:mt-6 p-3 rounded-full ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300"}`} animate={{ rotate: swapAnim }}>
              ⇄
            </motion.button>

            <div className="flex-1 relative w-full md:w-auto">
              <label className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${secondaryText}`}>To</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className={`w-full mt-2 rounded-xl p-3 sm:p-4 font-bold appearance-none outline-none border ${darkMode ? "bg-black border-white/10 text-white" : "bg-white border-gray-300 text-black"}`}>
                {currencies.map((c) => <option key={c.code} value={c.code}>{c.name} – {c.code}</option>)}
              </select>
              <FiChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${secondaryText}`} />
            </div>
          </div>

          {/* RESULT CARD */}
          {error && <p className="text-red-500 font-bold mb-4">{error}</p>}

          <AnimatePresence mode="wait">
            <motion.div key={formattedResult} className={`rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border transition-all ${darkMode ? "bg-black/50 border-white/10" : "bg-gray-50 border-gray-200"}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <p className={`text-xs sm:text-sm font-bold uppercase opacity-60 ${secondaryText}`}>{amount} {from} equals</p>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black mt-2 ${loading ? "opacity-30" : ""} ${textColor}`}>
                {currencySymbols[to]} {formattedResult}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* CONVERT BUTTON */}
          <button
            onClick={convert}
            className="w-full py-4 sm:py-5 rounded-2xl font-black bg-green-500 hover:bg-green-400 text-black transition-all shadow-xl shadow-green-500/20 uppercase tracking-widest"
            disabled={converting}
          >
            {converting ? "...Converting" : converted ? "Converted!" : "Convert Now"}
          </button>
        </motion.div>

        {/* FOOTER */}
        <div className={`mt-8 sm:mt-12 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase opacity-40 ${textColor}`}>
          © 2026 Lolade Tech
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;