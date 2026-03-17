// @ts-nocheck
// @ts-nocheck
import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #111; height: 100%; font-family: 'Sora', sans-serif; }
  #root { display: flex; justify-content: center; min-height: 100vh; background: #111; }
  ::-webkit-scrollbar { display: none; }
  input, button { font-family: 'Sora', sans-serif; outline: none; }
  @keyframes fadeUp  { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes pop     { from { transform: scale(0.2); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  @keyframes slideUp { from { transform: translateY(100px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes xpPop   { 0% { transform: translateY(0) translateX(-50%) scale(0.8); opacity: 0 } 15% { transform: translateY(0) translateX(-50%) scale(1.1); opacity: 1 } 80% { transform: translateY(-60px) translateX(-50%) scale(1); opacity: 1 } 100% { transform: translateY(-80px) translateX(-50%) scale(0.9); opacity: 0 } }
  @keyframes glow    { 0%,100% { opacity:.4; transform:scale(1) } 50% { opacity:1; transform:scale(1.15) } }
  @keyframes shimmer { 0% { transform:translateX(-100%) } 100% { transform:translateX(200%) } }
  @keyframes burst   { 0% { transform:scale(0) rotate(0deg); opacity:1 } 100% { transform:scale(2.5) rotate(180deg); opacity:0 } }
  @keyframes badgeIn { 0% { transform:scale(0) rotate(-30deg); opacity:0 } 60% { transform:scale(1.2) rotate(5deg) } 80% { transform:scale(0.95) rotate(-2deg) } 100% { transform:scale(1) rotate(0); opacity:1 } }
  @keyframes certIn  { 0% { transform:scale(0.7) translateY(40px); opacity:0 } 100% { transform:scale(1) translateY(0); opacity:1 } }
  .fadeUp { animation: fadeUp 0.5s cubic-bezier(.2,.8,.2,1) both }
  .pop    { animation: pop   0.4s cubic-bezier(.17,.67,.38,1.3) both }
  .tap:active { transform: scale(0.97); transition: transform 0.1s }
`;

const C = {
  bg:"#000", text:"#fff", text2:"rgba(255,255,255,0.5)", text3:"rgba(255,255,255,0.22)",
  border:"rgba(255,255,255,0.08)", border2:"rgba(255,255,255,0.15)",
  gold:"#F7C94B", orange:"#FF6B35", green:"#2ED573", red:"#FF4757",
};
const gr = (a,b,d=135) => `linear-gradient(${d}deg,${a},${b})`;

// ── Safe localStorage ─────────────────────────────────────────────
const LS_KEY = "stocksikho_v6";
const lsGet = () => { try { const d = localStorage.getItem(LS_KEY); return d ? JSON.parse(d) : null; } catch(e) { return null; } };
const lsSet = (data) => { try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch(e) {} };
const lsClear = () => { try { localStorage.removeItem(LS_KEY); } catch(e) {} };

// ── Email validation ──────────────────────────────────────────────
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

// ── Streak logic ──────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];
const calcStreak = (lastDate, currentStreak) => {
  if (!lastDate) return { streak: 1, lastDate: todayStr() };
  const today = new Date(todayStr());
  const last  = new Date(lastDate);
  const diff  = Math.round((today - last) / 86400000);
  if (diff === 0) return { streak: currentStreak, lastDate };
  if (diff === 1) return { streak: currentStreak + 1, lastDate: todayStr() };
  return { streak: 1, lastDate: todayStr() };
};

const UI = {
  en: {
    start:"Begin →", noCard:"Free forever · No credit card",
    chooseLanguage:"Choose your language", langSub:"All lessons will be in your language",
    step1:"1 of 2", step2:"2 of 2", goalQ:"What's your goal?", goalSub:"We'll personalise your learning path",
    levelQ:"Where are you today?", levelSub:"Honest answer helps us start you right",
    goals:["💰 Build long-term wealth","🏠 Save for a home or big goal","📈 Beat inflation with my savings","🎓 Understand how markets work","💼 Become a smarter trader"],
    levels:["🌱 Never invested — complete beginner","📖 Heard of stocks, never started","🔰 Have FD or MF, no direct stocks","📊 Bought a few stocks already","💼 Invest regularly, want to go deeper"],
    saveProgress:"Create your account", freeLine:"Free forever. No spam. Ever.",
    withEmail:"Continue with Email", namePH:"Your name", emailPH:"Your email address",
    cont:"Continue →", skip:"Skip for now", back:"←",
    lesson:"Lesson", keyTakes:"Key Takeaways", takeQuiz:"Take the Quiz",
    submit:"Submit Answer", submitting:"Checking…", correct:"Correct!", wrong:"Not quite",
    ansWas:"The answer was:", xpEarned:"XP Earned", keepGoing:"Continue →",
    passNeeded:"Answer correctly to unlock the next lesson.",
    tryAgain:"Try Again →", attempt:"Attempt", learnTab:"Learn", badgesTab:"Badges", profileTab:"Profile",
    achievements:"Achievements", earnedOf:"badges earned", monthJourney:"6-month journey · 7 levels",
    recentBadges:"Recent Badges", viewAll:"View All →",
    currProgress:"Your Progress", badgeUnlocked:"Badge Unlocked",
    tapContinue:"Tap anywhere to continue",
    certTitle:"Certificate of Completion", certSub:"This certifies that",
    certLine:"has successfully completed the StockSikho curriculum",
    certDesc:"7 Levels · 21 Modules · 20 Lessons",
    shareCert:"Share Certificate", printCert:"Print / Save as PDF", continueLearning:"Continue →",
    level:"Level", toNextLevel:"XP to next level", comingSoon:"Coming soon",
    nextUnlocked:"Next lesson unlocked", translationSoon:"🌐 English (Hindi translation coming soon)",
    leaveQuiz:"Leave quiz? Your selected answer will be lost.", stayQuiz:"Stay", leaveBtn:"Leave",
    streak:"day streak", dayStreak:"Day Streak",
  },
  hi: {
    start:"शुरू करें →", noCard:"हमेशा मुफ़्त · कोई क्रेडिट कार्ड नहीं",
    chooseLanguage:"भाषा चुनें", langSub:"सभी पाठ आपकी भाषा में होंगे",
    step1:"1 / 2", step2:"2 / 2", goalQ:"आपका लक्ष्य?", goalSub:"हम आपका रास्ता तैयार करेंगे",
    levelQ:"आप अभी कहाँ हैं?", levelSub:"सही जवाब सही शुरुआत देगा",
    goals:["💰 दीर्घकालिक धन बनाएं","🏠 घर या बड़े लक्ष्य के लिए बचत","📈 महंगाई से आगे रहें","🎓 बाजार को समझें","💼 स्मार्ट ट्रेडर बनें"],
    levels:["🌱 कभी निवेश नहीं किया","📖 शेयर के बारे में सुना, शुरू नहीं","🔰 FD/MF है, डायरेक्ट स्टॉक नहीं","📊 कुछ शेयर खरीदे हैं","💼 नियमित निवेश करता हूं"],
    saveProgress:"खाता बनाएं", freeLine:"हमेशा मुफ़्त। कोई स्पैम नहीं।",
    withEmail:"Email से जारी रखें", namePH:"आपका नाम", emailPH:"आपका ईमेल",
    cont:"आगे →", skip:"अभी छोड़ें", back:"←",
    lesson:"पाठ", keyTakes:"मुख्य बातें", takeQuiz:"क्विज़ दें",
    submit:"जवाब दें", submitting:"जाँच हो रही है…", correct:"सही!", wrong:"लगभग सही",
    ansWas:"सही जवाब:", xpEarned:"XP मिले", keepGoing:"जारी रखें →",
    passNeeded:"अगला पाठ खोलने के लिए सही जवाब दें।",
    tryAgain:"फिर कोशिश करें →", attempt:"प्रयास", learnTab:"सीखें", badgesTab:"बैज", profileTab:"प्रोफ़ाइल",
    achievements:"उपलब्धियां", earnedOf:"बैज मिले", monthJourney:"6 महीने · 7 स्तर",
    recentBadges:"हालिया बैज", viewAll:"सभी देखें →",
    currProgress:"आपकी प्रगति", badgeUnlocked:"बैज मिला",
    tapContinue:"जारी रखने के लिए टैप करें",
    certTitle:"पूर्णता प्रमाण पत्र", certSub:"यह प्रमाणित करता है कि",
    certLine:"ने StockSikho पाठ्यक्रम सफलतापूर्वक पूरा किया",
    certDesc:"7 स्तर · 21 मॉड्यूल · 20 पाठ",
    shareCert:"प्रमाण पत्र शेयर करें", printCert:"Print / PDF सेव करें", continueLearning:"जारी रखें →",
    level:"स्तर", toNextLevel:"XP अगले स्तर तक", comingSoon:"जल्द आएगा",
    nextUnlocked:"अगला पाठ खुल गया", translationSoon:"🌐 हिंदी अनुवाद जल्द आएगा",
    leaveQuiz:"क्विज़ छोड़ें? आपका जवाब खो जाएगा।", stayQuiz:"रहें", leaveBtn:"छोड़ें",
    streak:"दिन की स्ट्रीक", dayStreak:"दिन स्ट्रीक",
  },
};

const LANGS = [
  {code:"en",name:"English",native:"English",flag:"🇬🇧",ready:true},
  {code:"hi",name:"Hindi",native:"हिंदी",flag:"🇮🇳",ready:true},
  {code:"mr",name:"Marathi",native:"मराठी",flag:"🧡",ready:false},
  {code:"ta",name:"Tamil",native:"தமிழ்",flag:"🌺",ready:false},
  {code:"te",name:"Telugu",native:"తెలుగు",flag:"💛",ready:false},
  {code:"bn",name:"Bengali",native:"বাংলা",flag:"🌸",ready:false},
];

const LESSONS_EN = [
  { id:"1A1", lvl:1, mod:"💰 Money, Wealth & Compounding", title:"What money actually is", hiAvail:true,
    story:`Imagine you have 10 mangoes and your neighbour has 10 rotis. You swap 2 mangoes for 2 rotis. That's barter — it worked for small villages, but breaks down fast. What if the roti-maker doesn't want mangoes today? You're stuck.\n\nMoney was invented to solve this. A farmer sells mangoes for ₹100, then uses ₹100 to buy shoes three months later. Money is a store of value — it holds the worth of your work until you need it.\n\nEvery ₹10 note in your wallet is a promise by the Reserve Bank of India. This is called fiat currency — backed by government trust, not gold.\n\nKey insight: money is not wealth. Money is just a tool. Wealth is what money buys you — time, security, freedom. The goal of investing is to make your money grow faster than inflation takes it away.`,
    keyPoints:["Money = stored value of your time and labour","RBI issues and guarantees every Indian rupee","Fiat currency is backed by government trust, not gold","Money is a tool — investing turns it into real wealth"],
    quiz:{ q:"Why is barter inefficient compared to money?", opts:["Barter is illegal","Both parties must have exactly what the other wants","Barter requires banks","Money is older than barter"], ans:1 }, xp:50 },
  { id:"1A2", lvl:1, mod:"💰 Money, Wealth & Compounding", title:"Inflation and your purchasing power", hiAvail:true,
    story:`In 2000, a samosa cost ₹2. In 2010, ₹5. In 2024, ₹15. The samosa didn't get better — your money got weaker. This is inflation.\n\nIndia's average CPI inflation is 5–6% per year. If your salary stays ₹50,000 and inflation is 6%, your real purchasing power falls by ₹3,000 every year — silently.\n\nA bank savings account gives 3–4% interest. But inflation is 6%. So in real terms, your savings are losing 2% per year. You feel richer on paper, but you're actually getting poorer.\n\nThis is why simply saving in a bank is not enough. Nifty 50 index funds have historically returned 12–15% annually — beating inflation by 6–9%.`,
    keyPoints:["Inflation erodes purchasing power silently every year","India's CPI inflation averages 5–6% per year","Bank savings minus inflation = negative real return","Real return = your return minus inflation — this is what matters"],
    quiz:{ q:"Your bank gives 4% interest. Inflation is 6%. What is your real return?", opts:["+10%","−2%","+2%","0%"], ans:1 }, xp:55 },
  { id:"1A3", lvl:1, mod:"💰 Money, Wealth & Compounding", title:"Compounding — The 8th Wonder", hiAvail:true,
    story:`Albert Einstein called compound interest the 8th wonder of the world.\n\nSimple interest: ₹1,00,000 at 10% = ₹10,000/year. After 30 years: ₹3,00,000.\n\nCompound interest: Same ₹1,00,000 at 10%, but your returns earn returns. Year 1: ₹1,10,000. Year 2: ₹1,21,000. By year 30: ₹17,44,940. That's 17x, not 3x!\n\nThe Rule of 72: Divide 72 by your annual return rate = years to double. At 12%, money doubles every 6 years.\n\nWarren Buffett's net worth: $120 billion. 97% made after age 65. Not because he got smarter — because he started at 11 and let compounding work for 54+ years.\n\nCruel truth: ₹1,000 at age 25 becomes ₹93,050 at 65. The same ₹1,000 at age 35 becomes only ₹29,960. Ten years cost you ₹63,000.`,
    keyPoints:["Compound interest = your returns earn their own returns","Rule of 72: 72 ÷ return rate = years to double money","At 12%, ₹1 lakh becomes ₹17.4 lakh in 30 years","Starting 10 years late reduces final wealth by 68%"],
    quiz:{ q:"At 12% annual return, how many years to double your money?", opts:["12 years","6 years","3 years","9 years"], ans:1 }, xp:60 },
  { id:"1A4", lvl:1, mod:"💰 Money, Wealth & Compounding", title:"Risk vs Return — The Eternal Tradeoff", hiAvail:true,
    story:`One law in investing is as certain as gravity: higher potential returns always come with higher risk. No exceptions.\n\nSavings account: 3–4% return. After inflation, real return is negative.\nFixed Deposits: 6–7%. Slightly better, but still below inflation long-term.\nGovernment bonds: 7–7.5%. Backed by Government of India.\nGold: 8–10% long-term average. A hedge, not a growth asset.\nNifty 50 Index Fund: 12–15% historical return. Short-term swings −30% to +50%. Long-term trend consistently up.\nIndividual stocks: 0% to 100%+. One stock can give 10x or go to zero.\nF&O Derivatives: Unlimited potential. 90% of retail traders lose money.\n\nThe goal isn't to avoid risk. It's to take calculated risk appropriate for your time horizon.`,
    keyPoints:["Higher return always requires higher risk — no exceptions","Savings accounts give negative real returns after inflation","Nifty 50 has given 12–15% historically over 15+ years","Match your risk to your time horizon — longer = can take more risk"],
    quiz:{ q:"Which gives the best long-term return potential for beginners?", opts:["Fixed Deposit","Savings Account","Nifty 50 Index Fund","Physical Gold"], ans:2 }, xp:55 },
  { id:"1B1", lvl:1, mod:"🏗️ Why Companies Need Investors", title:"How businesses raise capital", hiAvail:false,
    story:`Meet Kavitha. She has a healthy tiffin delivery idea in Bangalore. She needs ₹20 lakh but only has ₹5 lakh.\n\nOption 1 — Debt: Borrow ₹15 lakh from bank at 12% per year. She must pay ₹15,000/month interest whether or not the business earns. If COVID hits, she still owes the bank.\n\nOption 2 — Equity: Find 3 investors who give ₹5 lakh each for 15% ownership each. No interest. But if the business earns ₹5 lakh/month profit, she keeps only 55% = ₹2.75 lakh.\n\nThis is the fundamental choice every business faces. When Zomato listed on NSE in 2021, it raised ₹9,375 crore from millions of ordinary investors. Each buyer got a small ownership piece. Each had upside. Each took risk.`,
    keyPoints:["Businesses need capital to grow beyond what founders can self-fund","Debt = borrow money, pay interest, no ownership given","Equity = give ownership in exchange for capital","Stock markets make equity funding accessible to millions"],
    quiz:{ q:"What is the main advantage of equity funding over debt?", opts:["Lower total cost always","No obligation to repay if business fails","Higher interest paid to investors","Bank approval required"], ans:1 }, xp:50 },
  { id:"1B2", lvl:1, mod:"🏗️ Why Companies Need Investors", title:"What a share actually represents", hiAvail:false,
    story:`When you buy one share of Infosys, you become a part-owner. Entirely true in law.\n\nInfosys has ~415 crore shares. If you own 415 shares, you own 0.000001% of Infosys. Tiny — but legally real.\n\nWhat owning a share gives you:\n1. Voting rights: Vote at AGM on major decisions.\n2. Dividend rights: If Infosys declares ₹30 dividend per share, ₹30 × your shares go directly to your bank.\n3. Capital appreciation: Share price rises from ₹1,400 to ₹1,900. Sell and realise ₹500 profit per share.\n4. Residual claim: If liquidated, after paying all creditors, you get your proportional share.\n\nThe share price is simply what the market collectively believes the company is worth right now.`,
    keyPoints:["A share = legally real fractional ownership of a company","Shareholders get voting rights, dividends, and capital appreciation","Owning any Infosys shares makes you a real co-owner","Share price = market's collective belief about company's value"],
    quiz:{ q:"If a company has 100 shares and you own 5, what percentage do you own?", opts:["0.05%","5%","50%","500%"], ans:1 }, xp:55 },
  { id:"1C1", lvl:1, mod:"🏛️ Structure of Indian Markets", title:"NSE, BSE and SEBI explained", hiAvail:false,
    story:`India has two major stock exchanges:\n\nBSE (Bombay Stock Exchange): Founded 1875. Asia's oldest exchange. Home to Sensex — top 30 companies by market cap. Sensex started at 100 in 1979 and crossed 75,000 in 2024 — a 750x increase in 45 years.\n\nNSE (National Stock Exchange): Founded 1992, fully electronic. World's largest derivatives exchange by volume. Home to Nifty 50 — top 50 companies across 13 sectors.\n\nSEBI (Securities and Exchange Board of India): The regulator. Created 1988. Sets rules for IPOs, insider trading, disclosures. Regulates exchanges, brokers, mutual funds. Can fine, ban, and prosecute violators. Protects retail investor rights.\n\nWhen you invest through Zerodha: You → Broker → NSE/BSE → Clearing Corporation → Seller. Entire chain regulated and guaranteed.`,
    keyPoints:["BSE (1875) = Asia's oldest exchange, home of Sensex","NSE (1992) = world's largest derivatives exchange, home of Nifty 50","SEBI regulates the entire ecosystem","Your broker is just an intermediary — NSE/BSE execute the trade"],
    quiz:{ q:"Which index tracks the top 50 companies on NSE?", opts:["Sensex","BSE 500","Nifty 50","Bank Nifty"], ans:2 }, xp:50 },
  { id:"1C2", lvl:1, mod:"🏛️ Structure of Indian Markets", title:"How a trade happens step by step", hiAvail:false,
    story:`You want to buy 10 shares of Tata Motors at ₹920.\n\nStep 1: Open Kite app, search 'TATAMOTORS'. Place a limit order at ₹918.\nStep 2: Zerodha sends your order to NSE's electronic order book in milliseconds.\nStep 3: NSE scans for a seller at ₹918 or lower. If found, trade executes instantly.\nStep 4: ₹9,180 is debited from your account. You're now a Tata Motors shareholder.\nStep 5 — T+1 settlement: By next trading day, 10 shares arrive in your Demat account. CDSL or NSDL update the ownership record.\nStep 6 — Safety net: NSE Clearing Corporation guarantees the trade. Even if the seller defaults, you get your shares.`,
    keyPoints:["Limit order = buy only at your specified price or better","Orders matched electronically on NSE/BSE in milliseconds","T+1 settlement: shares arrive in your Demat next trading day","NSE Clearing Corporation guarantees every trade"],
    quiz:{ q:"What does T+1 settlement mean?", opts:["Trade confirmed in 1 minute","Shares delivered within 1 trading day","1% tax on all trades","Trade requires 1 broker only"], ans:1 }, xp:55 },
  { id:"2A1", lvl:2, mod:"📈 Stocks Deep Dive", title:"Large cap, mid cap and small cap", hiAvail:false,
    story:`Market Cap = Current Share Price × Total Shares Outstanding.\n\nLarge Cap (Top 100): Reliance, TCS, HDFC Bank, Infosys. Strong cash flows, decades of history. Volatility relatively low. Growth typically 10–15% annually. Nifty 50 is all large cap.\n\nMid Cap (Ranked 101–250): Dixon Technologies, Persistent Systems. Higher growth potential (15–25%+), more volatile. Can fall 40–50% in bear markets. Suitable for 5+ year horizon.\n\nSmall Cap (Ranked 251+): Thousands of companies. Some hidden gems. Many mediocre or fraudulent. Returns can be 10x or −80%. High research required. Not for beginners.\n\nRecommendation: Start with Nifty 50 large cap index fund. Add mid cap index fund after 2 years. Direct small cap stocks only after you can read financial statements.`,
    keyPoints:["Market cap = share price × total shares","Large cap = top 100 — stable, 10–15% typical returns","Mid cap = 101–250 — higher growth, more volatile","Small cap = 251+ — highest risk-reward, strong research required"],
    quiz:{ q:"Which is most suitable for a first-time investor?", opts:["Small cap stocks","Mid cap stocks","Nifty 50 index fund","F&O derivatives"], ans:2 }, xp:55 },
  { id:"2A2", lvl:2, mod:"📈 Stocks Deep Dive", title:"PE ratio, ROE and how to value stocks", hiAvail:false,
    story:`PE Ratio (Price-to-Earnings): PE = Share Price ÷ EPS. If Infosys trades at ₹1,800 and earns ₹80/share, PE = 22.5. You're paying ₹22.50 for every ₹1 of annual profit. Benchmarks: Banking PE 10–15. IT PE 25–35. FMCG PE 40–60. Never compare PE across different sectors.\n\nROE (Return on Equity): ROE = Net Profit ÷ Shareholders Equity × 100. HDFC Bank ROE: 16–18% consistently. You give them ₹100, they earn ₹17 profit. ROE above 15% for 5+ years = quality business.\n\nDebt-to-Equity (D/E): D/E of 0 = zero debt (ideal). D/E above 2 = high risk. During COVID 2020, high-debt companies collapsed (Jet Airways, Yes Bank). Zero-debt companies (TCS, Infosys, HUL) sailed through.\n\nGolden combination: Low PE + High ROE + Low Debt = potentially great investment.`,
    keyPoints:["PE = price per ₹1 of earnings — compare only within same sector","ROE above 15% consistently = highly efficient management","D/E below 0.5 = financially conservative and safe","Low PE + High ROE + Low Debt = classic quality investment signal"],
    quiz:{ q:"HDFC Bank has ROE of 17%. What does this mean?", opts:["Bank grew revenue 17%","For every ₹100 of equity, bank earns ₹17 profit","17% of loans are bad","Bank pays 17% dividend"], ans:1 }, xp:65 },
  { id:"2B1", lvl:2, mod:"🧺 Mutual Funds & ETFs", title:"How mutual funds work", hiAvail:false,
    story:`You have ₹5,000 to invest. MRF share costs ₹1,30,000. You can't buy even one share.\n\nA mutual fund solves this. 10,000 investors each put in ₹5,000 = ₹5 crore pooled. A professional fund manager buys a diversified portfolio of 30–60 stocks. Your ₹5,000 buys units of the fund. NAV (Net Asset Value) = total fund value ÷ total units.\n\nIf fund has ₹5 crore and 50 lakh units, NAV = ₹10/unit. You get 500 units. Next year stocks rise 15%. New NAV = ₹11.50. Your 500 units = ₹5,750. You've made 15%.\n\nBenefits: Diversification across 30–60 companies. Professional management. Redeem any time. SEBI regulated. Start with ₹100 via SIP.`,
    keyPoints:["Mutual fund = pooled money managed professionally","NAV = total fund value ÷ total units","Instant diversification across 30–60 stocks with even ₹500","SEBI mandates monthly portfolio disclosure"],
    quiz:{ q:"If a fund has ₹10 crore total value and 1 crore units, what is NAV?", opts:["₹1","₹10","₹100","₹1000"], ans:1 }, xp:55 },
  { id:"2B2", lvl:2, mod:"🧺 Mutual Funds & ETFs", title:"Index funds vs active funds", hiAvail:false,
    story:`Active Funds: Manager hand-picks stocks, charges 1–2% annual expense ratio. The brutal math: 14% gross return minus 1.5% fee = 12.5% for you. Over 20 years on ₹1 lakh: at 14% you'd have ₹13.7 lakh. At 12.5% you'd have ₹10.5 lakh. The fee cost you ₹3.2 lakh!\n\nWorse: 70–80% of active large-cap funds underperform Nifty 50 over 10 years.\n\nIndex Funds: Simply buy all stocks in the index. No research cost. Expense ratio: 0.05–0.20%. Guaranteed to match market returns.\n\nETF (Exchange Traded Fund): Like an index fund but trades live on exchange. Nippon India Nifty BeES was India's first ETF (2001).\n\nHonest recommendation: Start with a Nifty 50 index fund. Low cost, diversified, proven. Beats most professional fund managers long-term.`,
    keyPoints:["70–80% of active large-cap funds underperform Nifty 50 over 10 years","1.5% vs 0.1% expense ratio costs you lakhs over decades","Index fund = automatically copies the index","ETF = index fund that trades live on exchange"],
    quiz:{ q:"Why do index funds outperform most active funds long term?", opts:["Index funds take more risk","Much lower fees that compound favourably","Government subsidy on index funds","Active managers are dishonest"], ans:1 }, xp:65 },
  { id:"2C1", lvl:2, mod:"📜 Bonds, Gold & Alternatives", title:"Bonds, gold and portfolio balance", hiAvail:false,
    story:`Bonds — Lending money for fixed return: A bond is a loan. Lend ₹1 lakh to Government of India for 10 years at 7.2%. Every 6 months: ₹3,600 interest. After 10 years: ₹1 lakh back. Government bonds are the safest investment in India. Bond prices move inversely to interest rates.\n\nGold — The ancient hedge: Doesn't produce earnings or dividends. But ultimate crisis hedge. In 2020, Sensex fell 38% while gold rose 28%.\n\nBest ways to hold gold: Sovereign Gold Bonds (SGB): Gold appreciation + 2.5% interest + tax-free at maturity. Gold ETF: Buy like a share. Physical gold: Jewellery has 10–20% making charges — avoid as investment.\n\nIdeal allocation: Equity 70–80%, Gold 5–10%, Debt 10–20%.`,
    keyPoints:["Government bonds = safest investment in India","Bond prices and interest rates move in opposite directions","Gold is a hedge during crashes, not a growth asset","Sovereign Gold Bonds give gold appreciation + 2.5% interest"],
    quiz:{ q:"What happens to bond prices when RBI raises interest rates?", opts:["Bond prices rise","Bond prices fall","Bond prices stay same","Bonds mature early"], ans:1 }, xp:60 },
  { id:"3A1", lvl:3, mod:"📋 Financial Statements", title:"Reading an income statement", hiAvail:false,
    story:`The income statement answers: Did the company make money this period?\n\nInfosys FY2024:\nRevenue: ₹1,53,670 crore — money earned from IT services.\nCost of Revenue: ₹97,456 crore — salaries, software, infrastructure.\nGross Profit: ₹56,214 crore. Gross Margin = 36.6%.\nOperating Expenses: ₹21,580 crore.\nEBIT: ₹34,634 crore. EBIT Margin = 22.6%.\nInterest income: +₹2,800 crore.\nPBT: ₹37,434 crore.\nTax: ₹9,800 crore.\nPAT (Net Profit): ₹26,000 crore. Net Margin = 16.9%.\nEPS = ₹26,000cr ÷ 415cr shares = ₹62.65/share.\n\nWhat to check: Revenue growing 10%+? Net margin stable? EPS growing? Expenses growing slower than revenue?`,
    keyPoints:["Revenue → Gross Profit → EBIT → PBT → Net Profit is the flow","Net margin = PAT ÷ Revenue — Infosys at 17% is exceptional","EPS = Net Profit ÷ shares — drives share price","Compare margins year-over-year within same company"],
    quiz:{ q:"A company earns ₹500cr revenue and ₹75cr net profit. What is its net margin?", opts:["7.5%","15%","75%","0.15%"], ans:1 }, xp:65 },
  { id:"3B1", lvl:3, mod:"🧮 Key Financial Ratios", title:"PE, ROE and Debt — the essential ratios", hiAvail:false,
    story:`PE Ratio: Asian Paints PE 50. ITC PE 25.6. ITC looks cheaper. But Asian Paints grows faster and has a stronger moat. Higher PE can be justified by higher quality. Benchmarks: Banking 10–15, IT 25–35, FMCG 40–60.\n\nROE: Company with ₹1,000cr equity and ₹200cr profit. ROE = 20%. HDFC Bank: 17%. Bajaj Finance: 22%. Rule: ROE above 15% for 5+ years = quality business.\n\nD/E: D/E of 0 = ideal. D/E above 2 = high risk. COVID 2020: high-debt companies collapsed (Jet Airways, Yes Bank). Zero-debt companies (TCS, Infosys, HUL) sailed through.\n\nNote: Banks have high D/E by nature — compare only within same sector.`,
    keyPoints:["PE = market price ÷ EPS — compare only within same sector","ROE above 15% for 5+ years = consistently efficient management","D/E below 0.5 = financially conservative","Low PE + High ROE + Low D/E = classic quality investment signal"],
    quiz:{ q:"Company has ₹800cr equity and earns ₹120cr profit. What is ROE?", opts:["12%","15%","8%","20%"], ans:1 }, xp:65 },
  { id:"4A1", lvl:4, mod:"😰 Behavioural Finance", title:"Why your brain is wired to lose money", hiAvail:false,
    story:`Nobel Prize winner Daniel Kahneman proved: humans are systematically irrational with money.\n\nLoss Aversion: Pain of losing ₹10,000 is ~2x more intense than pleasure of gaining ₹10,000. When portfolio drops 20%, brain screams SELL. But selling at the bottom locks in losses.\n\nProof: Sensex fell 38% in March 2020 (COVID). Millions sold at the bottom. Sensex recovered 100% by December 2020. Those who held doubled their money.\n\nConfirmation Bias: You decide Zomato is a great stock. Brain only notices positive news. Fix: Actively seek the strongest bear case.\n\nHerd Behaviour: 2021 — everyone trading options. PE ratios hit 35+. Retail investors poured in at the top. Then 2022: correction, small-caps fell 50–70%.\n\nThe fix: Write before investing — (1) Why buying? (2) What makes me sell? (3) What's my time horizon?`,
    keyPoints:["Loss aversion: pain of losing 2x more intense than equivalent gain","Confirmation bias: only notice info supporting your view","Herd behaviour = buying at the top because everyone is","Fix: write your investment thesis before buying"],
    quiz:{ q:"Sensex falls 25%. A rational long-term investor should:", opts:["Sell everything","Panic and wait","Review fundamentals; if unchanged, hold or buy more","Move all to gold"], ans:2 }, xp:65 },
  { id:"5A1", lvl:5, mod:"🎯 Stock Selection", title:"The 5-step stock selection framework", hiAvail:false,
    story:`Step 1 — Business Quality: Only invest in businesses you understand. What does it sell? Who are its customers? Why do they keep coming back?\n\nStep 2 — Competitive Moat: What protects this business? Brand (Asian Paints, Titan). Cost (Hindustan Zinc). Switching costs (Tally — businesses never switch). Network effect (NSE).\n\nStep 3 — Financial Health: Revenue growing 10%+ for 5+ years. ROE above 15%. D/E below 0.5. Positive and growing cash flow.\n\nStep 4 — Management Quality: Promoter holding above 50%. 10-year track record. No accounting scandals. Reasonable CEO salary. Read the shareholder letter in annual report.\n\nStep 5 — Valuation: PEG ratio (PE ÷ earnings growth) below 1 is ideal. Buy with margin of safety — 20–30% below estimated fair value.`,
    keyPoints:["Step 1: Only buy businesses you can explain in 2 minutes","Step 2: Identify the competitive moat","Step 3: ROE above 15%, D/E below 0.5, revenue growing 10%+","Steps 4–5: Trust management + buy at fair price with margin of safety"],
    quiz:{ q:"What does 'margin of safety' mean?", opts:["Stop loss order placed","Buying 20–30% below estimated fair value","Government guarantee on stocks","Insurance on your portfolio"], ans:1 }, xp:75 },
  { id:"5B1", lvl:5, mod:"🛒 Buying — When and How", title:"How to actually buy stocks in India", hiAvail:false,
    story:`Step 1 — Choose your broker: Zerodha (₹0 equity delivery, best for active investors). Groww (beginner-friendly, ₹0 equity and MF delivery). Upstox (zero AMC). All SEBI-registered. Open with Aadhaar + PAN + bank account. Free, 15–30 minutes.\n\nStep 2 — Fund your account: UPI transfer. Instant. No charges. Money held in separate client account (SEBI rule).\n\nStep 3 — Place your order: Search ticker (RELIANCE, INFY, HDFCBANK). Market order: Buys at current price immediately. Limit order: Buys only at your specified price. Safer for long-term investors.\n\nStep 4 — Position sizing: Never put more than 5–10% of portfolio in one stock. With ₹1 lakh: max ₹10,000 per stock. Even a total loss = max 10% portfolio damage.\n\nStart small. Buy 5–10 shares. Experience the emotional journey first.`,
    keyPoints:["Zerodha/Groww/Upstox are India's top SEBI-registered brokers — free","Limit order is safer than market order","Never put more than 5–10% of portfolio in any single stock","Start small — experience ownership emotions before scaling up"],
    quiz:{ q:"Which order type guarantees you buy at your specified price or better?", opts:["Market order","Stop loss order","Limit order","IOC order"], ans:2 }, xp:65 },
  { id:"5C1", lvl:5, mod:"📊 Holding & Selling", title:"When to hold and when to sell", hiAvail:false,
    story:`When NOT to sell:\n✗ Stock fell 20%: Price declined, but did the BUSINESS change?\n✗ Stock hasn't moved in 6 months: Good companies reward patience over years.\n✗ You read a scary article: Media thrives on fear.\n✗ WhatsApp/Telegram says sell: Often vested interests.\n\nWhen to SELL:\n✓ Business fundamentals deteriorated: Moat eroding, revenue declining 3+ consecutive quarters.\n✓ Management fraud: Accounting irregularities, excessive promoter pledging.\n✓ Better opportunity: Clearly superior company at much lower valuation.\n✓ Portfolio rebalancing: Stock became 25% of portfolio — trim to 10%.\n✓ Goal achieved: Needed money for home, education.\n\nTax: Hold equity above 12 months → LTCG taxed at 10% above ₹1 lakh. Below 12 months → STCG at 15%.`,
    keyPoints:["Never sell just because price fell — check if BUSINESS changed","Valid sell reasons: fundamental deterioration, fraud, better opportunity","Hold equity 12+ months for LTCG (10%) vs STCG (15%)","Best investors sell rarely — let compounding work for years"],
    quiz:{ q:"Infosys fell 15% after market panic. Infosys's own results were excellent. What should you do?", opts:["Sell to cut losses","Hold or consider buying more","Wait 6 months","Switch to gold"], ans:1 }, xp:70 },
  { id:"6A1", lvl:6, mod:"📡 Technical Analysis", title:"Reading charts and price action", hiAvail:false,
    story:`Candlestick Charts: Each candle = one time period. Green candle: Closed HIGHER than opened = buyers dominated. Red candle: Closed LOWER = sellers dominated. Long upper wick: Price went high but got rejected. Long lower wick: Price fell but recovered.\n\nKey Patterns: Hammer: Small body + long lower wick = buyers stepped in. Bullish reversal. Shooting Star: Long upper wick after a rise = sellers rejected higher prices. Bearish reversal.\n\nSupport and Resistance: Support = price floor where buyers consistently appear. Resistance = ceiling where sellers appear. Once broken, resistance often becomes new support.\n\n200-day Moving Average: Long-term trend indicator. Price crosses above 200 MA = bullish signal. Below = bearish.\n\nImportant: Technical analysis works better in liquid large-cap stocks. Always combine with fundamental analysis.`,
    keyPoints:["Green candle = price closed higher; Red = closed lower","Support = price floor where buyers appear; Resistance = ceiling","200-day moving average is the key long-term trend indicator","Use technical analysis as timing tool alongside fundamentals"],
    quiz:{ q:"A stock's price crosses above its 200-day moving average. This is generally:", opts:["A sell signal","A bearish sign","A bullish trend signal","Irrelevant"], ans:2 }, xp:65 },
  { id:"7A1", lvl:7, mod:"🥧 Portfolio Strategy", title:"Building your complete investment portfolio", hiAvail:false,
    story:`Age 20–30: 70% Equity (50% Nifty 50 index + 20% mid-cap index), 10% Gold (Sovereign Gold Bonds), 10% Debt (liquid fund), 10% Direct stocks.\n\nAge 31–45: 60% Equity, 15% Gold, 20% Debt, 5% REITs. Starting to have goals with defined timelines.\n\nAge 46–60: 45% Equity (mostly large cap), 20% Gold, 30% Debt, 5% Liquid. Capital preservation becomes important.\n\nAge 60+: 30% Equity (dividend-paying large caps), 15% Gold, 50% Debt (Senior citizen FD), 5% Liquid. Need regular income. Cannot risk principal.\n\nAnnual rebalancing: Once a year, sell overweight assets, buy underweight. Forces disciplined sell-high, buy-low.`,
    keyPoints:["Asset allocation should match your age — equity reduces as you age","20s–30s: 70%+ equity; 40s: 60%; 50s: 45%; 60+: 30%","Rebalance annually — sell overweight, buy underweight","Index funds = core; direct stocks = satellite"],
    quiz:{ q:"A 28-year-old with 30+ year horizon should have what equity allocation?", opts:["20–30%","40–50%","70–80%","100%"], ans:2 }, xp:70 },
  { id:"7B1", lvl:7, mod:"🧾 Taxes on Investments", title:"Tax on stocks, MF and F&O", hiAvail:false,
    story:`STCG (Short Term Capital Gains): Sell within 12 months → 15% flat tax. Buy 100 Infosys at ₹1,500. Sell at ₹1,800 after 8 months. Profit = ₹30,000. Tax = ₹4,500.\n\nLTCG (Long Term Capital Gains): Sell after 12 months → 10% tax on profit ABOVE ₹1 lakh. Buy same 100 Infosys at ₹1,500. Sell after 15 months at ₹2,200. Profit = ₹70,000. Below ₹1 lakh threshold — tax = ZERO!\n\nELSS: Invest up to ₹1.5 lakh/year. Section 80C deduction = saves up to ₹46,800. 3-year lock-in. Tax saving + equity returns.\n\nF&O and Intraday: Treated as BUSINESS INCOME. Taxed at your income slab (20–30%). Must file ITR-3. Losses carried forward 8 years.\n\nDividends: Taxed at your income slab.`,
    keyPoints:["STCG (under 12 months): 15% flat tax on all gains","LTCG (above 12 months): 10% only on gains ABOVE ₹1 lakh","ELSS = ₹1.5 lakh/year tax deduction + equity returns","F&O profits = business income taxed at your full slab rate"],
    quiz:{ q:"You hold Reliance 18 months and make ₹80,000 profit. How much LTCG tax?", opts:["₹12,000 (15%)","₹8,000 (10%)","Zero — below ₹1 lakh threshold","₹24,000 (30%)"], ans:2 }, xp:70 },
];

const LESSONS_HI_OVERRIDES = {
  "1A1": { title:"पैसा वास्तव में क्या है", story:`मान लो तुम्हारे पास 10 आम हैं और पड़ोसी के पास 10 रोटियां। तुम 2 आम देकर 2 रोटियां लेते हो। यह बार्टर है — लेकिन क्या होगा अगर रोटी बनाने वाले को आज आम नहीं चाहिए? तुम फंस जाते हो।\n\nपैसे का आविष्कार इसी समस्या को सुलझाने के लिए हुआ। एक किसान आम बेचकर ₹100 कमाता है, फिर तीन महीने बाद उन्हीं ₹100 से जूते खरीदता है।\n\nतुम्हारी जेब में जो ₹10 का नोट है वो RBI का वादा है। इसे fiat currency कहते हैं — सरकार के भरोसे पर टिकी, सोने पर नहीं।\n\nमुख्य बात: पैसा ही दौलत नहीं है। पैसा सिर्फ एक औजार है। दौलत वो है जो पैसे से खरीदी जाती है — समय, सुरक्षा, आज़ादी।`, keyPoints:["पैसा = तुम्हारे समय और मेहनत का संग्रहित मूल्य","RBI हर भारतीय रुपया जारी करता और गारंटी देता है","Fiat currency सरकार के भरोसे पर टिकी है, सोने पर नहीं","पैसा एक औजार है — निवेश इसे असली दौलत में बदलता है"], quiz:{ q:"बार्टर की तुलना में पैसा बेहतर क्यों है?", opts:["बार्टर गैरकानूनी है","दोनों पक्षों को बिल्कुल वही चाहिए जो दूसरे के पास है","बार्टर के लिए बैंक चाहिए","पैसा पुराना है बार्टर से"], ans:1 } },
  "1A2": { title:"महंगाई और खरीदारी की ताकत", story:`सन 2000 में एक समोसा ₹2 में। 2010 में ₹5। 2024 में ₹15। समोसा बेहतर नहीं हुआ — तुम्हारा पैसा कमजोर हो गया। इसे महंगाई कहते हैं।\n\nभारत की औसत CPI महंगाई 5-6% सालाना है। बैंक बचत खाता 3-4% ब्याज देता है। यानी असल में तुम्हारी बचत हर साल 2% कम होती जा रही है।\n\nNifty 50 इंडेक्स फंड ने ऐतिहासिक रूप से 12-15% सालाना रिटर्न दिया है — महंगाई से 6-9% ज़्यादा।`, keyPoints:["महंगाई हर साल चुपचाप खरीदारी की ताकत खाती रहती है","भारत की CPI महंगाई औसतन 5-6% सालाना है","बैंक बचत माइनस महंगाई = नकारात्मक असली रिटर्न","असली रिटर्न = तुम्हारा रिटर्न माइनस महंगाई"], quiz:{ q:"बैंक 4% ब्याज देता है। महंगाई 6% है। असली रिटर्न क्या है?", opts:["+10%","−2%","+2%","0%"], ans:1 } },
  "1A3": { title:"चक्रवृद्धि ब्याज — दुनिया का 8वां अजूबा", story:`साधारण ब्याज: ₹1,00,000 पर 10% = हर साल ₹10,000। 30 साल बाद: ₹3,00,000।\n\nचक्रवृद्धि ब्याज: वही ₹1,00,000 पर 10%, रिटर्न पर भी रिटर्न। 30 साल बाद: ₹17,44,940। यह 17 गुना है!\n\n72 का नियम: 12% पर 72÷12 = 6 साल में दोगुना।\n\nWarren Buffett की संपत्ति का 97% 65 साल की उम्र के बाद बना — 11 साल में शुरू किया और 54 साल चक्रवृद्धि काम करने दी।`, keyPoints:["चक्रवृद्धि ब्याज = रिटर्न पर भी रिटर्न","72 का नियम: 72 ÷ ब्याज दर = दोगुना होने में साल","12% पर ₹1 लाख 30 साल में ₹17.4 लाख","10 साल देर से शुरू = 68% कम दौलत"], quiz:{ q:"12% सालाना रिटर्न पर पैसा दोगुना होने में कितने साल?", opts:["12 साल","6 साल","3 साल","9 साल"], ans:1 } },
  "1A4": { title:"जोखिम बनाम रिटर्न", story:`निवेश में एक नियम पक्का है: ज़्यादा रिटर्न हमेशा ज़्यादा जोखिम के साथ।\n\nबचत खाता: 3-4%, महंगाई के बाद नकारात्मक।\nFixed Deposits: 6-7%\nNifty 50 इंडेक्स फंड: 12-15% ऐतिहासिक\nव्यक्तिगत शेयर: 0% से 100%+\nF&O: असीमित संभावना, 90% retail traders को नुकसान।\n\nलक्ष्य जोखिम से बचना नहीं — अपने समय-क्षितिज के अनुसार सुलझा हुआ जोखिम लेना है।`, keyPoints:["ज़्यादा रिटर्न हमेशा ज़्यादा जोखिम के साथ","बचत खाता महंगाई के बाद नकारात्मक रिटर्न","Nifty 50 ने 15+ साल में 12-15% का रिटर्न दिया","अपने समय-क्षितिज के अनुसार जोखिम चुनें"], quiz:{ q:"शुरुआती निवेशकों के लिए सबसे अच्छा दीर्घकालिक रिटर्न?", opts:["Fixed Deposit","बचत खाता","Nifty 50 इंडेक्स फंड","भौतिक सोना"], ans:2 } },
};

const LESSON_IDS = LESSONS_EN.map(l => l.id);
const LEVEL_COLORS = {
  1:["#43E97B","#38F9D7"], 2:["#4FACFE","#00F2FE"], 3:["#F093FB","#F5576C"],
  4:["#A18CD1","#FBC2EB"], 5:["#F7971E","#FFD200"], 6:["#FF4E50","#F9D423"],
  7:["#89F7FE","#66A6FF"],
};

const BADGES = [
  { id:"first_login",  cat:"🚀 Start",   icon:"🌅", name:"First Light",        desc:"Opened StockSikho",                  colors:["#FF9A3C","#FF6B00"] },
  { id:"goal_set",     cat:"🚀 Start",   icon:"🎯", name:"North Star",          desc:"Set your financial goal",            colors:["#FFD700","#FF8C00"] },
  { id:"lang_chosen",  cat:"🚀 Start",   icon:"🗣️", name:"My Language",         desc:"Chose your learning language",       colors:["#A8EDEA","#50C9C3"] },
  { id:"streak_3",     cat:"🚀 Start",   icon:"🔥", name:"On Fire",             desc:"3-day learning streak",              colors:["#FF6B6B","#FF8E53"] },
  { id:"streak_7",     cat:"🚀 Start",   icon:"⚡", name:"Electric",            desc:"7-day unbroken streak",              colors:["#F7971E","#FFD200"] },
  { id:"streak_30",    cat:"🚀 Start",   icon:"💎", name:"Diamond Habit",       desc:"30-day learning streak",             colors:["#89F7FE","#66A6FF"] },
  { id:"first_lesson", cat:"🚀 Start",   icon:"🌱", name:"Seed Planted",        desc:"Completed your first lesson",        colors:["#43E97B","#38F9D7"] },
  { id:"money_1",      cat:"🌱 Level 1", icon:"💰", name:"Money Whisperer",     desc:"Learned what money truly is",        colors:["#FAD961","#F76B1C"] },
  { id:"inflation_1",  cat:"🌱 Level 1", icon:"📉", name:"Inflation Fighter",   desc:"Understood purchasing power",        colors:["#FF4E50","#F9D423"] },
  { id:"compound_1",   cat:"🌱 Level 1", icon:"🌀", name:"Snowball",            desc:"Grasped compounding magic",          colors:["#4FACFE","#00F2FE"] },
  { id:"risk_1",       cat:"🌱 Level 1", icon:"⚖️", name:"Risk Balancer",       desc:"Understood risk vs return",          colors:["#43CBFF","#9708CC"] },
  { id:"capital_1",    cat:"🌱 Level 1", icon:"🏗️", name:"Capital Builder",     desc:"Learned how companies raise money",  colors:["#F77062","#FE5196"] },
  { id:"share_1",      cat:"🌱 Level 1", icon:"📄", name:"Shareholder",         desc:"Understood what a share represents", colors:["#96FBC4","#F9F586"] },
  { id:"l1_done",      cat:"🌱 Level 1", icon:"🏅", name:"Foundation Stone",    desc:"Completed all of Level 1",           colors:["#FDDB92","#D1FDFF"] },
  { id:"stocks_2",     cat:"🔭 Level 2", icon:"📈", name:"Equity Initiate",     desc:"Learned stock categories",           colors:["#0BA360","#3CBA92"] },
  { id:"ratios_2",     cat:"🔭 Level 2", icon:"🧮", name:"Ratio Student",       desc:"Learned PE, ROE and PB ratios",      colors:["#BE93C5","#7BC6CC"] },
  { id:"mf_2",         cat:"🔭 Level 2", icon:"🧺", name:"Basket Weaver",       desc:"Understood mutual funds",            colors:["#11998E","#38EF7D"] },
  { id:"index_2",      cat:"🔭 Level 2", icon:"📊", name:"Index Believer",      desc:"Understood index vs active funds",   colors:["#C79081","#DFA579"] },
  { id:"bond_2",       cat:"🔭 Level 2", icon:"📜", name:"Bond Scholar",        desc:"Learned bonds and gold",             colors:["#F6D365","#FDA085"] },
  { id:"l2_done",      cat:"🔭 Level 2", icon:"🎖️", name:"Instruments Pro",     desc:"Completed all of Level 2",           colors:["#F6D365","#FDA085"] },
  { id:"income_3",     cat:"🔬 Level 3", icon:"📋", name:"P&L Detective",       desc:"Read an income statement",           colors:["#FEC163","#DE4313"] },
  { id:"ratios_3",     cat:"🔬 Level 3", icon:"🔬", name:"Ratio Wizard",        desc:"Calculated PE, ROE, D/E",            colors:["#D4E4BC","#57B9A4"] },
  { id:"l3_done",      cat:"🔬 Level 3", icon:"🔱", name:"Business Analyst",    desc:"Completed all of Level 3",           colors:["#F093FB","#F5576C"] },
  { id:"psych_4",      cat:"🧠 Level 4", icon:"😰", name:"Fear Aware",          desc:"Understood loss aversion",           colors:["#FF9A9E","#FECFEF"] },
  { id:"l4_done",      cat:"🧠 Level 4", icon:"🧘", name:"Zen Investor",        desc:"Completed all of Level 4",           colors:["#FFECD2","#FCB69F"] },
  { id:"screen_5",     cat:"⚙️ Level 5", icon:"🔍", name:"Stock Screener",      desc:"Learned stock selection framework",  colors:["#84FAB0","#8FD3F4"] },
  { id:"buy_5",        cat:"⚙️ Level 5", icon:"🛒", name:"First Buyer",         desc:"Learned how to place orders",        colors:["#43E97B","#38F9D7"] },
  { id:"sell_5",       cat:"⚙️ Level 5", icon:"🔔", name:"Exit Strategist",     desc:"Knows when to sell",                 colors:["#F7971E","#FFD200"] },
  { id:"l5_done",      cat:"⚙️ Level 5", icon:"⚙️", name:"Practical Investor",  desc:"Completed all of Level 5",           colors:["#F7971E","#FFD200"] },
  { id:"candle_6",     cat:"⚔️ Level 6", icon:"🕯️", name:"Candle Reader",       desc:"Read candlestick charts",            colors:["#FCCB90","#D57EEB"] },
  { id:"l6_done",      cat:"⚔️ Level 6", icon:"⚔️", name:"Chart Reader",        desc:"Completed all of Level 6",           colors:["#FF4E50","#F9D423"] },
  { id:"alloc_7",      cat:"🗺️ Level 7", icon:"🥧", name:"Asset Allocator",     desc:"Built portfolio allocation plan",    colors:["#ACCBEE","#E7F0FD"] },
  { id:"tax_7",        cat:"🗺️ Level 7", icon:"🧾", name:"Tax Optimizer",       desc:"Understood STCG, LTCG, ELSS",       colors:["#56AB2F","#A8E063"] },
  { id:"l7_done",      cat:"🗺️ Level 7", icon:"🗺️", name:"Portfolio Architect", desc:"Completed all of Level 7",           colors:["#89F7FE","#66A6FF"] },
  { id:"quiz_5",       cat:"🏆 Mastery", icon:"🎯", name:"5 in a Row",          desc:"5 consecutive correct answers",      colors:["#FF9A3C","#FF6B00"] },
  { id:"quiz_10",      cat:"🏆 Mastery", icon:"🧠", name:"Quiz Master",         desc:"10 consecutive correct answers",     colors:["#4FACFE","#00F2FE"] },
  { id:"xp_500",       cat:"🏆 Mastery", icon:"⭐", name:"500 XP",              desc:"Earned 500 total XP",                colors:["#FAD961","#F76B1C"] },
  { id:"xp_1000",      cat:"🏆 Mastery", icon:"🌟", name:"1000 XP",             desc:"Earned 1000 total XP",               colors:["#43E97B","#38F9D7"] },
  { id:"xp_2000",      cat:"🏆 Mastery", icon:"💫", name:"2000 XP",             desc:"Earned 2000 total XP",               colors:["#F093FB","#F5576C"] },
  { id:"halfway",      cat:"🏆 Mastery", icon:"🚀", name:"Halfway There",       desc:"Completed 50% of all lessons",       colors:["#89F7FE","#66A6FF"] },
  { id:"perfect",      cat:"🏆 Mastery", icon:"💯", name:"Perfect Score",       desc:"Correct answer on first try",        colors:["#2ED573","#1abc9c"] },
  { id:"cap1",         cat:"🎓 Capstone",icon:"🔍", name:"Company Analyst",     desc:"Full company analysis project",      colors:["#F6D365","#FDA085"] },
  { id:"cap2",         cat:"🎓 Capstone",icon:"💼", name:"Portfolio Designer",  desc:"Designed personal portfolio",        colors:["#89F7FE","#66A6FF"] },
  { id:"cap3",         cat:"🎓 Capstone",icon:"📓", name:"Market Journalist",   desc:"30-day market journal",              colors:["#A1C4FD","#C2E9FB"] },
  { id:"graduate",     cat:"🎓 Capstone",icon:"🎓", name:"Graduate",            desc:"Completed full curriculum",          colors:["#FF9A9E","#FFD700"] },
  { id:"certificate",  cat:"🎓 Capstone",icon:"📜", name:"Certified Investor",  desc:"Earned the StockSikho certificate", colors:["#FFD700","#FF8C00"] },
  { id:"teacher",      cat:"🎓 Capstone",icon:"👨‍🏫",name:"Pay It Forward",      desc:"Shared app with friends",            colors:["#43E97B","#38F9D7"] },
];

const ADS = [
  { brand:"Zerodha", line:"₹0 equity delivery. India's #1 broker.", cta:"Open Free →", color:"#FF6B35" },
  { brand:"Groww",   line:"Start SIP from ₹100. No commission.", cta:"Invest Now →", color:"#00C853" },
  { brand:"Kuvera",  line:"Free direct MF + portfolio tracker.", cta:"Try Free →", color:"#4FACFE" },
];

// ── Badge Ring ────────────────────────────────────────────────────
const BadgeRing = ({ badge, size=68, earned, onClick, delay=0, showAnim=false }) => {
  const r = size/2-5, circ = 2*Math.PI*r;
  const [c1,c2] = earned ? badge.colors : ["#2C2C2E","#3A3A3C"];
  const gid = `g_${badge.id}_${size}`;
  return (
    <div onClick={()=>onClick&&onClick(badge)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", animation:showAnim&&earned?`badgeIn 0.7s cubic-bezier(.17,.67,.38,1.3) ${delay}s both`:"none" }}>
      <div style={{ position:"relative", width:size, height:size }}>
        {earned&&<div style={{ position:"absolute", inset:-5, borderRadius:"50%", background:`radial-gradient(circle,${c1}50 0%,transparent 70%)`, animation:"glow 2.8s ease-in-out infinite" }}/>}
        {earned&&<div style={{ position:"absolute", inset:0, borderRadius:"50%", overflow:"hidden", pointerEvents:"none" }}><div style={{ position:"absolute", top:0, left:0, width:"40%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)", animation:"shimmer 2.5s ease-in-out 1s infinite" }}/></div>}
        <svg width={size} height={size} style={{ position:"absolute", inset:0, transform:"rotate(-90deg)" }}>
          <defs><linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient></defs>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={earned?`${c1}20`:"#1C1C1E"} strokeWidth={5}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={earned?`url(#${gid})`:"#252528"} strokeWidth={5} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={earned?0:circ*0.82} style={{transition:showAnim?"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1) 0.3s":"none"}}/>
        </svg>
        <div style={{ position:"absolute", inset:7, borderRadius:"50%", background:earned?`radial-gradient(135deg,${c1}30 0%,${c2}15 100%)`:"rgba(14,14,16,0.98)", border:`1.5px solid ${earned?c1+"40":"#252528"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:size*0.33, filter:earned?"none":"grayscale(1) opacity(0.2)" }}>{badge.icon}</span>
        </div>
        {!earned&&<div style={{ position:"absolute", bottom:2, right:2, width:17, height:17, borderRadius:"50%", background:"#1A1A1E", border:"1px solid #2C2C2E", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>🔒</div>}
      </div>
      <div style={{ fontSize:9, fontWeight:600, color:earned?"rgba(255,255,255,0.8)":"#3A3A3C", textAlign:"center", maxWidth:size+12, lineHeight:1.2 }}>{badge.name}</div>
    </div>
  );
};

const ProgBar = ({ value, h=4, colors=["#F7C94B","#FF6B35"] }) => (
  <div style={{ width:"100%", height:h, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(100,Math.max(0,value))}%`, height:"100%", background:gr(colors[0],colors[1],90), borderRadius:99, transition:"width 0.9s cubic-bezier(.4,0,.2,1)" }}/>
  </div>
);

const SmartAd = ({ idx }) => {
  const ad = ADS[idx%ADS.length];
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.06)", borderLeft:`3px solid ${ad.color}`, borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:12, margin:"14px 0", background:"rgba(255,255,255,0.02)", cursor:"pointer" }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:8, color:"rgba(255,255,255,0.2)", letterSpacing:2, textTransform:"uppercase", marginBottom:2 }}>SPONSORED</div>
        <div style={{ fontSize:12, fontWeight:700 }}>{ad.brand} <span style={{ fontWeight:400, color:"rgba(255,255,255,0.4)", fontSize:11 }}>— {ad.line}</span></div>
      </div>
      <div style={{ fontSize:11, color:ad.color, fontWeight:700, whiteSpace:"nowrap" }}>{ad.cta}</div>
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]         = useState("splash");
  const [lang, setLang]             = useState(null);
  const [goal, setGoal]             = useState(null);
  const [knowledge, setKnowledge]   = useState(null);
  const [authMode, setAuthMode]     = useState("email");
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [emailErr, setEmailErr]     = useState("");
  const [user, setUser]             = useState(null);
  const [tab, setTab]               = useState("learn");
  const [xp, setXp]                 = useState(0);
  const [streak, setStreak]         = useState(1);
  const [lastDate, setLastDate]     = useState(null);
  const [doneLessons, setDoneLessons]     = useState([]);
  const [passedLessons, setPassedLessons] = useState([]);
  const [earnedBadges, setEarnedBadges]   = useState(["first_login"]);
  const [badgeUnlocked, setBadgeUnlocked] = useState(null);
  const [badgeModal, setBadgeModal]       = useState(null);
  const [badgeFilter, setBadgeFilter]     = useState("All");
  const [activeLesson, setActiveLesson]   = useState(null);
  const [quizAnswer, setQuizAnswer]       = useState(null);
  const [quizDone, setQuizDone]           = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [xpFloat, setXpFloat]             = useState(null);
  const [failedQuiz, setFailedQuiz]       = useState(false);
  const [attemptCount, setAttemptCount]   = useState(0);
  const [consecutive, setConsecutive]     = useState(0);
  const [showLeaveQuiz, setShowLeaveQuiz] = useState(false);

  const t = (UI)[lang] || UI.en;
  const lessons = lang==="hi"
    ? LESSONS_EN.map(l => (LESSONS_HI_OVERRIDES)[l.id] ? {...l,...(LESSONS_HI_OVERRIDES)[l.id]} : l)
    : LESSONS_EN;

  const lvl = Math.floor(xp/300)+1;
  const xpInLvl = xp%300;
  const totalLessons = lessons.length;
  const donePct = Math.round(passedLessons.length/totalLessons*100);

  // ── Restore from localStorage on first load ──────────────────
  useEffect(() => {
    const d = lsGet();
    if (d && d._ver === "v6") {
      if (d.xp)            setXp(d.xp);
      if (d.doneLessons)   setDoneLessons(d.doneLessons);
      if (d.passedLessons) setPassedLessons(d.passedLessons);
      if (d.earnedBadges)  setEarnedBadges(d.earnedBadges);
      if (d.consecutive)   setConsecutive(d.consecutive);
      if (d.lang)          setLang(d.lang);
      if (d.lastDate)      setLastDate(d.lastDate);
      if (d.user)          setUser(d.user);
      // Calc streak
      const s = calcStreak(d.lastDate, d.streak || 1);
      setStreak(s.streak);
      setLastDate(s.lastDate);
      // If logged in, go straight to home
      if (d.user) { setScreen("home"); setTab("learn"); }
    }
  }, []);

  // ── Save on every state change (no user guard) ───────────────
  useEffect(() => {
    lsSet({ _ver:"v6", xp, doneLessons, passedLessons, earnedBadges, consecutive, lang: lang||"en", user, streak, lastDate });
  }, [xp, doneLessons, passedLessons, earnedBadges, consecutive, lang, user, streak, lastDate]);

  const go = (s) => { setScreen(s); try { window.scrollTo(0,0); } catch(e){} };
  const isUnlocked = (id) => { const idx=LESSON_IDS.indexOf(id); return idx===0||passedLessons.includes(LESSON_IDS[idx-1]); };

  const tryBadge = (id) => {
    if (!earnedBadges.includes(id)) {
      setEarnedBadges(p=>[...p,id]);
      setBadgeUnlocked(BADGES.find(b=>b.id===id));
    }
  };

  // ── Streak update on lesson complete ──────────────────────────
  const updateStreak = () => {
    const s = calcStreak(lastDate, streak);
    setStreak(s.streak);
    setLastDate(s.lastDate);
    if (s.streak >= 3)  tryBadge("streak_3");
    if (s.streak >= 7)  tryBadge("streak_7");
    if (s.streak >= 30) tryBadge("streak_30");
  };

  const completeLesson = (lessonId, correct) => {
    const lesson = lessons.find(l=>l.id===lessonId);
    const gained = correct ? lesson.xp : Math.floor(lesson.xp*0.3);
    if (!doneLessons.includes(lessonId)) {
      setDoneLessons(p=>[...p,lessonId]);
      const newXp = xp+gained;
      setXp(newXp);
      setXpFloat(`+${gained} XP`);
      setTimeout(()=>setXpFloat(null),2000);
      updateStreak();
      if (correct) {
        const newP = [...passedLessons,lessonId];
        setPassedLessons(newP);
        const newC = consecutive+1;
        setConsecutive(newC);
        if (newP.length===1) tryBadge("first_lesson");
        if (lessonId==="1A1") tryBadge("money_1");
        if (lessonId==="1A2") tryBadge("inflation_1");
        if (lessonId==="1A3") tryBadge("compound_1");
        if (lessonId==="1A4") tryBadge("risk_1");
        if (lessonId==="1B1") tryBadge("capital_1");
        if (lessonId==="1B2") tryBadge("share_1");
        if (lessonId==="2A1") tryBadge("stocks_2");
        if (lessonId==="2A2") tryBadge("ratios_2");
        if (lessonId==="2B1") tryBadge("mf_2");
        if (lessonId==="2B2") tryBadge("index_2");
        if (lessonId==="2C1") tryBadge("bond_2");
        if (lessonId==="3A1") tryBadge("income_3");
        if (lessonId==="3B1") tryBadge("ratios_3");
        if (lessonId==="4A1") tryBadge("psych_4");
        if (lessonId==="5A1") tryBadge("screen_5");
        if (lessonId==="5B1") tryBadge("buy_5");
        if (lessonId==="5C1") tryBadge("sell_5");
        if (lessonId==="6A1") tryBadge("candle_6");
        if (lessonId==="7A1") tryBadge("alloc_7");
        if (lessonId==="7B1") tryBadge("tax_7");
        const l1=["1A1","1A2","1A3","1A4","1B1","1B2","1C1","1C2"];
        const l2=["2A1","2A2","2B1","2B2","2C1"];
        if(l1.every(id=>newP.includes(id))) tryBadge("l1_done");
        if(l2.every(id=>newP.includes(id))) tryBadge("l2_done");
        if(["3A1","3B1"].every(id=>newP.includes(id))) tryBadge("l3_done");
        if(newP.includes("4A1")) tryBadge("l4_done");
        if(["5A1","5B1","5C1"].every(id=>newP.includes(id))) tryBadge("l5_done");
        if(newP.includes("6A1")) tryBadge("l6_done");
        if(["7A1","7B1"].every(id=>newP.includes(id))){ tryBadge("l7_done"); tryBadge("graduate"); tryBadge("certificate"); }
        if(newXp>=500) tryBadge("xp_500");
        if(newXp>=1000) tryBadge("xp_1000");
        if(newXp>=2000) tryBadge("xp_2000");
        if(newC>=5) tryBadge("quiz_5");
        if(newC>=10) tryBadge("quiz_10");
        tryBadge("perfect");
        if(newP.length>=totalLessons/2) tryBadge("halfway");
      } else setConsecutive(0);
    }
    setQuizSubmitting(false);
    if (correct) { setFailedQuiz(false); go("result"); }
    else { setFailedQuiz(true); setAttemptCount(c=>c+1); }
  };

  // ── WRAPPER ───────────────────────────────────────────────────
  const Wrap = ({ children, bg="#000", center=false }) => (
    <div style={{ width:"100%", maxWidth:480, margin:"0 auto", minHeight:"100vh", background:bg, display:"flex", flexDirection:"column", justifyContent:center?"center":"flex-start", overflowY:"auto", overflowX:"hidden", position:"relative", boxShadow:"0 0 80px rgba(0,0,0,0.9)" }}>
      {children}
    </div>
  );

  const btnStyle = (ghost=false, clrs=null) => ({
    width:"100%", padding:"16px 20px", borderRadius:14, border:ghost?`1px solid rgba(255,255,255,0.15)`:"none",
    fontSize:15, fontWeight:700, cursor:"pointer",
    background:ghost?"transparent":clrs?gr(clrs[0],clrs[1]):gr(C.gold,C.orange),
    color:ghost?C.text2:"#0A0607", transition:"all 0.15s", fontFamily:"'Sora',sans-serif",
  });

  const optStyle = (active,correct,wrong) => ({
    width:"100%", padding:"15px 18px", borderRadius:12, cursor:"pointer", textAlign:"left",
    fontSize:14, fontWeight:500, fontFamily:"'Sora',sans-serif",
    border:`2px solid ${wrong?C.red:correct?C.green:active?"rgba(247,201,75,0.6)":C.border}`,
    background:wrong?"rgba(255,71,87,0.08)":correct?"rgba(46,213,115,0.08)":active?"rgba(247,201,75,0.05)":"rgba(255,255,255,0.02)",
    color:C.text, transition:"all 0.2s", marginBottom:10,
  });

  // ── XP Float ─────────────────────────────────────────────────
  const XPFloat = () => xpFloat ? (
    <div style={{ position:"fixed", top:"20%", left:"50%", zIndex:9997, pointerEvents:"none", animation:"xpPop 2s ease forwards" }}>
      <div style={{ background:"rgba(0,0,0,0.85)", border:"1px solid rgba(247,201,75,0.4)", borderRadius:99, padding:"8px 20px", display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:18, fontWeight:800, color:C.gold }}>{xpFloat}</span>
      </div>
    </div>
  ) : null;

  // ── Badge Unlock ──────────────────────────────────────────────
  const BadgeUnlockOverlay = () => {
    if (!badgeUnlocked) return null;
    const [c1,c2] = badgeUnlocked.colors;
    return (
      <div onClick={()=>setBadgeUnlocked(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.93)", backdropFilter:"blur(28px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:28 }}>
        {[1,2,3].map(i=><div key={i} style={{ position:"absolute", width:200*i, height:200*i, borderRadius:"50%", border:`2px solid ${c1}${30-i*8}`, animation:`burst 1s ease-out ${i*0.15}s both` }}/>)}
        <div style={{ textAlign:"center", zIndex:1, animation:"badgeIn 0.7s cubic-bezier(.17,.67,.38,1.3) both" }}>
          <BadgeRing badge={badgeUnlocked} size={120} earned showAnim/>
          <div style={{ marginTop:20, fontSize:10, letterSpacing:4, color:c1, textTransform:"uppercase" }}>{t.badgeUnlocked}</div>
          <div style={{ fontSize:28, fontWeight:800, marginTop:10, background:gr(c1,c2), WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{badgeUnlocked.name}</div>
          <div style={{ fontSize:13, color:C.text2, marginTop:8, lineHeight:1.6 }}>{badgeUnlocked.desc}</div>
          <div style={{ marginTop:28, fontSize:11, color:C.text3 }}>{t.tapContinue}</div>
        </div>
      </div>
    );
  };

  // ── Badge Detail Modal ────────────────────────────────────────
  const BadgeDetailModal = () => {
    useEffect(() => {
      const handler = (e) => { if (e.key==="Escape") setBadgeModal(null); };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, []);
    if (!badgeModal) return null;
    const earned = earnedBadges.includes(badgeModal.id);
    const [c1,c2] = earned ? badgeModal.colors : ["#555","#777"];
    return (
      <div onClick={()=>setBadgeModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", backdropFilter:"blur(24px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9998, padding:16 }}>
        <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, background:"#0C0C10", border:`1px solid ${C.border}`, borderRadius:28, padding:"32px 28px 40px", textAlign:"center", animation:"slideUp 0.35s cubic-bezier(.2,.8,.2,1) both" }}>
          <BadgeRing badge={badgeModal} size={100} earned={earned} onClick={()=>{}} showAnim={earned}/>
          <div style={{ height:16 }}/>
          <div style={{ fontSize:22, fontWeight:800, background:earned?gr(c1,c2):"#fff", WebkitBackgroundClip:earned?"text":"unset", WebkitTextFillColor:earned?"transparent":"unset" }}>{badgeModal.name}</div>
          <div style={{ fontSize:13, color:C.text2, marginTop:8, lineHeight:1.6, marginBottom:20 }}>{badgeModal.desc}</div>
          {earned ? <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(46,213,115,0.1)", border:"1px solid rgba(46,213,115,0.25)", borderRadius:99, padding:"8px 18px", fontSize:13, color:C.green, fontWeight:700 }}>✓ Earned</div>
                  : <div style={{ fontSize:12, color:C.text3 }}>{badgeModal.cat}</div>}
          <button tabIndex={0} onClick={()=>setBadgeModal(null)} style={{ ...btnStyle(true), marginTop:20, padding:"13px" }}>Close</button>
        </div>
      </div>
    );
  };

  // ── Leave Quiz Confirm ────────────────────────────────────────
  const LeaveQuizDialog = () => {
    if (!showLeaveQuiz) return null;
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", backdropFilter:"blur(16px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9996, padding:28 }}>
        <div style={{ background:"#0E0E12", border:`1px solid ${C.border}`, borderRadius:20, padding:"28px 24px", maxWidth:340, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>{t.leaveQuiz}</div>
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button onClick={()=>setShowLeaveQuiz(false)} style={{ ...btnStyle(true), flex:1 }}>{t.stayQuiz}</button>
            <button onClick={()=>{ setShowLeaveQuiz(false); setQuizAnswer(null); setQuizDone(false); setFailedQuiz(false); setAttemptCount(0); go("home"); }} style={{ ...btnStyle(false,["#FF4757","#FF6B35"]), flex:1, color:"#fff" }}>{t.leaveBtn}</button>
          </div>
        </div>
      </div>
    );
  };

  // ── Nav ───────────────────────────────────────────────────────
  const Nav = () => (
    <div style={{ position:"sticky", bottom:0, background:"rgba(0,0,0,0.97)", backdropFilter:"blur(24px)", borderTop:`1px solid rgba(255,255,255,0.06)`, display:"flex", zIndex:200, padding:"10px 0 20px" }}>
      {[["learn","📚",t.learnTab],["badges","🏅",t.badgesTab],["profile","👤",t.profileTab]].map(([tb,icon,label])=>(
        <button key={tb} onClick={()=>{ setTab(tb); go(tb==="learn"?"home":tb); }} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, color:tab===tb?C.gold:C.text3, transition:"color 0.2s" }}>
          <span style={{ fontSize:22 }}>{icon}</span>
          <span style={{ fontSize:10, fontWeight:600 }}>{label}</span>
        </button>
      ))}
    </div>
  );

  // ════════════ SCREENS ════════════════════════════════════════

  // ── SPLASH ───────────────────────────────────────────────────
  if (screen==="splash") return (
    <Wrap bg="#000" center>
      <style>{CSS}</style>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"50%", background:"radial-gradient(ellipse at 50% -20%, rgba(247,201,75,0.15) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 36px", position:"relative", zIndex:1 }}>
        <div style={{ marginBottom:32, animation:"fadeIn 0.6s 0.1s both" }}>
          <div style={{ width:72, height:72, borderRadius:20, background:"rgba(247,201,75,0.1)", border:"1px solid rgba(247,201,75,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>📈</div>
        </div>
        <div style={{ fontSize:11, letterSpacing:5, color:C.text3, textTransform:"uppercase", marginBottom:16, animation:"fadeUp 0.5s 0.2s both" }}>StockSikho</div>
        <div style={{ fontSize:36, fontWeight:800, letterSpacing:-1.2, textAlign:"center", lineHeight:1.1, marginBottom:16, animation:"fadeUp 0.5s 0.3s both" }}>
          Learn to invest.<br/>
          <span style={{ background:gr(C.gold,C.orange), WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Build real wealth.</span>
        </div>
        <div style={{ fontSize:15, color:C.text2, textAlign:"center", lineHeight:1.7, animation:"fadeUp 0.5s 0.4s both" }}>
          India's most complete investing<br/>education. Free. In your language.
        </div>
      </div>
      <div style={{ padding:"0 28px 52px", position:"relative", zIndex:1, animation:"fadeUp 0.5s 0.6s both" }}>
        <button className="tap" style={btnStyle()} onClick={()=>go("ob1")}>Begin →</button>
        <div style={{ textAlign:"center", marginTop:14, fontSize:11, color:C.text3 }}>Free forever · No credit card</div>
      </div>
    </Wrap>
  );

  // ── ONBOARD 1 ─────────────────────────────────────────────────
  if (screen==="ob1") return (
    <Wrap bg="#000" center>
      <style>{CSS}</style>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 32px" }}>
        <div style={{ fontSize:10, letterSpacing:5, color:C.text3, textTransform:"uppercase", marginBottom:24, animation:"fadeUp 0.5s 0.05s both" }}>The Problem</div>
        <div style={{ fontSize:32, fontWeight:800, lineHeight:1.15, letterSpacing:-1, marginBottom:20, animation:"fadeUp 0.5s 0.15s both" }}>
          Your savings are<br/>
          <span style={{ background:gr(C.red,"#FF8E53"), WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>losing value.</span><br/>
          Right now.
        </div>
        <div style={{ fontSize:14, color:C.text2, lineHeight:1.75, marginBottom:48, animation:"fadeUp 0.5s 0.25s both" }}>
          Bank savings give 3–4%.<br/>Inflation takes 6%.<br/>You lose 2% every year — silently.
        </div>
        <div style={{ marginBottom:16 }}>
          {[
            { val:"−2%", label:"Real return on bank savings after inflation", color:C.red, delay:"0.35s" },
            { val:"10 Cr+", label:"New investors since 2020 — the wave is here", color:C.gold, delay:"0.45s" },
            { val:"12–15%", label:"Historical Nifty 50 annual return", color:C.green, delay:"0.55s" },
          ].map((s,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:20, marginBottom:24, animation:`fadeUp 0.5s ${s.delay} both` }}>
              <div style={{ width:3, height:44, borderRadius:99, background:s.color, flexShrink:0 }}/>
              <div>
                <div style={{ fontSize:28, fontWeight:800, letterSpacing:-0.5, color:s.color, lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:12, color:C.text3, marginTop:3, lineHeight:1.4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"0 28px 52px", animation:"fadeUp 0.5s 0.7s both" }}>
        <button className="tap" style={btnStyle()} onClick={()=>go("lang")}>I want to learn →</button>
        <div style={{ textAlign:"center", marginTop:12, fontSize:11, color:C.text3 }}>Free · No credit card · Your language</div>
      </div>
    </Wrap>
  );

  // ── LANGUAGE ──────────────────────────────────────────────────
  if (screen==="lang") return (
    <Wrap bg="#000">
      <style>{CSS}</style>
      <div style={{ flex:1, padding:"56px 28px 0" }}>
        <button onClick={()=>go("ob1")} style={{ background:"none", border:"none", color:C.text2, cursor:"pointer", fontSize:20, marginBottom:32, padding:0 }}>{t.back}</button>
        <div style={{ fontSize:10, letterSpacing:5, color:C.text3, textTransform:"uppercase", marginBottom:16 }}>Step 0 of 2</div>
        <div style={{ fontSize:28, fontWeight:800, letterSpacing:-0.8, marginBottom:6 }}>Choose your language</div>
        <div style={{ fontSize:13, color:C.text2, marginBottom:32 }}>All lessons will be in your language</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {LANGS.map((l,i)=>(
            <div key={l.code} onClick={()=>l.ready&&setLang(l.code)}
              style={{ background:lang===l.code?"rgba(247,201,75,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${lang===l.code?"rgba(247,201,75,0.4)":C.border}`, borderRadius:14, padding:"16px 14px", cursor:l.ready?"pointer":"default", opacity:l.ready?1:0.45, display:"flex", alignItems:"center", gap:12, transition:"all 0.2s", animation:`fadeUp 0.4s ${0.1+i*0.04}s both` }}>
              <span style={{ fontSize:24 }}>{l.flag}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700 }}>{l.native}</div>
                <div style={{ fontSize:10, color:l.ready?C.text3:C.orange }}>{l.ready?l.name:"Coming soon"}</div>
              </div>
              {lang===l.code&&<div style={{ color:C.gold, fontSize:16 }}>✓</div>}
              {!l.ready&&<div style={{ fontSize:9, background:"rgba(255,107,53,0.12)", border:"1px solid rgba(255,107,53,0.25)", color:C.orange, padding:"2px 7px", borderRadius:99, whiteSpace:"nowrap", flexShrink:0 }}>Soon</div>}
            </div>
          ))}
        </div>
        {lang && <div style={{ fontSize:12, color:C.gold, textAlign:"center", marginBottom:8, fontWeight:600 }}>✓ Lessons will be in {LANGS.find(l=>l.code===lang)?.native}</div>}
      </div>
      <div style={{ padding:"20px 28px 52px" }}>
        <button className="tap" style={{ ...btnStyle(), opacity:lang===null?0.3:1 }} disabled={!lang} onClick={()=>go("ob2")}>Continue →</button>
      </div>
    </Wrap>
  );

  // ── ONBOARD 2 — GOAL ──────────────────────────────────────────
  if (screen==="ob2") return (
    <Wrap bg="#000">
      <style>{CSS}</style>
      <div style={{ flex:1, padding:"56px 28px 0" }}>
        <button onClick={()=>go("lang")} style={{ background:"none", border:"none", color:C.text2, cursor:"pointer", fontSize:20, marginBottom:32, padding:0 }}>{t.back}</button>
        <div style={{ display:"flex", gap:6, marginBottom:28 }}>
          {[1,2].map(i=><div key={i} style={{ height:3, flex:1, borderRadius:99, background:i===1?gr(C.gold,C.orange):"rgba(255,255,255,0.1)" }}/>)}
        </div>
        <div style={{ fontSize:10, letterSpacing:5, color:C.text3, textTransform:"uppercase", marginBottom:16 }}>{t.step1}</div>
        <div style={{ fontSize:28, fontWeight:800, letterSpacing:-0.8, marginBottom:6 }}>{t.goalQ}</div>
        <div style={{ fontSize:13, color:C.text2, marginBottom:28 }}>{t.goalSub}</div>
        {t.goals.map((g,i)=>(
          <div key={i} onClick={()=>setGoal(i)} style={{ background:goal===i?"rgba(247,201,75,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${goal===i?"rgba(247,201,75,0.4)":C.border}`, borderRadius:14, padding:"16px 18px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, marginBottom:10, transition:"all 0.2s" }}>
            <span style={{ fontSize:22 }}>{g.split(" ")[0]}</span>
            <span style={{ fontSize:14, fontWeight:600, flex:1 }}>{g.split(" ").slice(1).join(" ")}</span>
            {goal===i&&<div style={{ color:C.gold }}>✓</div>}
          </div>
        ))}
      </div>
      <div style={{ padding:"20px 28px 52px" }}>
        <button className="tap" style={{ ...btnStyle(), opacity:goal===null?0.3:1 }} disabled={goal===null} onClick={()=>go("ob3")}>{t.cont}</button>
      </div>
    </Wrap>
  );

  // ── ONBOARD 3 — KNOWLEDGE ─────────────────────────────────────
  if (screen==="ob3") return (
    <Wrap bg="#000">
      <style>{CSS}</style>
      <div style={{ flex:1, padding:"56px 28px 0" }}>
        <button onClick={()=>go("ob2")} style={{ background:"none", border:"none", color:C.text2, cursor:"pointer", fontSize:20, marginBottom:32, padding:0 }}>{t.back}</button>
        <div style={{ display:"flex", gap:6, marginBottom:28 }}>
          {[1,2].map(i=><div key={i} style={{ height:3, flex:1, borderRadius:99, background:gr(C.gold,C.orange) }}/>)}
        </div>
        <div style={{ fontSize:10, letterSpacing:5, color:C.text3, textTransform:"uppercase", marginBottom:16 }}>{t.step2}</div>
        <div style={{ fontSize:28, fontWeight:800, letterSpacing:-0.8, marginBottom:6 }}>{t.levelQ}</div>
        <div style={{ fontSize:13, color:C.text2, marginBottom:28 }}>{t.levelSub}</div>
        {t.levels.map((l,i)=>(
          <div key={i} onClick={()=>setKnowledge(i)} style={{ background:knowledge===i?"rgba(247,201,75,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${knowledge===i?"rgba(247,201,75,0.4)":C.border}`, borderRadius:14, padding:"16px 18px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, marginBottom:10, transition:"all 0.2s" }}>
            <span style={{ fontSize:20 }}>{l.split(" ")[0]}</span>
            <span style={{ fontSize:13, fontWeight:600, flex:1, lineHeight:1.4 }}>{l.split(" ").slice(1).join(" ")}</span>
            {knowledge===i&&<div style={{ color:C.gold }}>✓</div>}
          </div>
        ))}
      </div>
      <div style={{ padding:"20px 28px 52px" }}>
        <button className="tap" style={{ ...btnStyle(), opacity:knowledge===null?0.3:1 }} disabled={knowledge===null} onClick={()=>go("auth")}>{t.cont}</button>
      </div>
    </Wrap>
  );

  // ── AUTH ──────────────────────────────────────────────────────
  if (screen==="auth") return (
    <Wrap bg="#000" center>
      <style>{CSS}</style>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"40%", background:"radial-gradient(ellipse at 50% 0%, rgba(247,201,75,0.07) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ padding:"0 28px", zIndex:1 }}>
        <div style={{ width:60, height:60, borderRadius:16, background:"rgba(247,201,75,0.1)", border:"1px solid rgba(247,201,75,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, marginBottom:24 }}>🔐</div>
        <div style={{ fontSize:26, fontWeight:800, letterSpacing:-0.8, marginBottom:6 }}>{t.saveProgress}</div>
        <div style={{ fontSize:13, color:C.text2, lineHeight:1.7, marginBottom:32 }}>{t.freeLine}</div>
        {/* Name field */}
        <input value={name} onChange={e=>setName(e.target.value)} placeholder={t.namePH}
          style={{ width:"100%", padding:"14px 16px", borderRadius:12, border:`1px solid ${C.border2}`, background:"rgba(255,255,255,0.04)", color:"#fff", fontSize:14, marginBottom:10 }}/>
        {/* Email field */}
        <input value={email} onChange={e=>{ setEmail(e.target.value); setEmailErr(""); }} placeholder={t.emailPH}
          style={{ width:"100%", padding:"14px 16px", borderRadius:12, border:`1px solid ${emailErr?C.red:C.border2}`, background:"rgba(255,255,255,0.04)", color:"#fff", fontSize:14, marginBottom:emailErr?4:10 }}/>
        {emailErr && <div style={{ fontSize:12, color:C.red, marginBottom:10 }}>{emailErr}</div>}
        <button className="tap" style={{ ...btnStyle(), opacity:email?1:0.35 }}
          onClick={()=>{
            if (!isValidEmail(email)) { setEmailErr("Please enter a valid email address"); return; }
            const displayName = name.trim() || email.split("@")[0];
            setUser({ name:displayName, email });
            tryBadge("goal_set"); tryBadge("lang_chosen");
            go("home");
          }}>{t.cont}</button>
        <div style={{ textAlign:"center", marginTop:20 }}>
          <span style={{ fontSize:12, color:C.text3, cursor:"pointer", textDecoration:"underline" }}
            onClick={()=>{ setUser({name:"Guest",email:""}); tryBadge("goal_set"); tryBadge("lang_chosen"); go("home"); }}>{t.skip}</span>
        </div>
      </div>
    </Wrap>
  );

  // ── HOME ──────────────────────────────────────────────────────
  if (screen==="home") {
    const levelGroups = {};
    lessons.forEach(l => {
      if (!levelGroups[l.lvl]) levelGroups[l.lvl] = {};
      if (!levelGroups[l.lvl][l.mod]) levelGroups[l.lvl][l.mod] = [];
      levelGroups[l.lvl][l.mod].push(l);
    });
    return (
      <Wrap bg="#000">
        <style>{CSS}</style>
        <BadgeUnlockOverlay/><XPFloat/>
        <div style={{ flex:1 }}>
          <div style={{ padding:"48px 24px 0" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
              <div>
                <div style={{ fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>StockSikho</div>
                <div style={{ fontSize:12, color:C.text3, marginTop:2 }}>India's Investing School</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,107,53,0.1)", border:"1px solid rgba(255,107,53,0.2)", borderRadius:99, padding:"6px 12px" }}>
                <span style={{ fontSize:14 }}>🔥</span>
                <span style={{ fontSize:12, fontWeight:700, color:C.orange }}>{streak}</span>
              </div>
            </div>
            <div style={{ marginBottom:8, display:"flex", justifyContent:"space-between" }}>
              <div style={{ fontSize:11, color:C.text3 }}>{t.level} {lvl}</div>
              <div style={{ fontSize:11, color:C.gold, fontWeight:600 }}>{xp} XP</div>
            </div>
            <ProgBar value={(xpInLvl/300)*100} h={3}/>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:24, marginBottom:4 }}>
              <div style={{ fontSize:13, fontWeight:700 }}>Your Curriculum</div>
              <div style={{ fontSize:12, color:C.text3 }}>{donePct}% complete</div>
            </div>
          </div>
          <div style={{ padding:"8px 24px 20px" }}>
            <SmartAd idx={0}/>
            {Object.entries(levelGroups).map(([lvlNum, mods], li)=>{
              const lvlLessons = Object.values(mods).flat();
              const lvlDone = lvlLessons.filter(l=>passedLessons.includes(l.id)).length;
              const [c1,c2] = (LEVEL_COLORS)[lvlNum]||["#fff","#ccc"];
              return (
                <div key={lvlNum} style={{ marginBottom:32 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:gr(c1+"25",c2+"12"), border:`1px solid ${c1}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:c1, flexShrink:0 }}>{lvlNum}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:700 }}>{t.level} {lvlNum}</div></div>
                    <div style={{ fontSize:11, color:c1, fontWeight:600 }}>{lvlDone}/{lvlLessons.length}</div>
                  </div>
                  <ProgBar value={lvlLessons.length?lvlDone/lvlLessons.length*100:0} colors={[c1,c2]} h={2}/>
                  <div style={{ height:12 }}/>
                  {Object.entries(mods).map(([modName, modLessons])=>(
                    <div key={modName}>
                      <div style={{ fontSize:10, color:C.text3, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8, paddingLeft:1 }}>{modName}</div>
                      {modLessons.map(ls=>{
                        const unlocked = isUnlocked(ls.id);
                        const isDone = passedLessons.includes(ls.id);
                        const isHiFallback = lang==="hi" && !ls.hiAvail;
                        return (
                          <div key={ls.id} className={unlocked?"tap":""} onClick={()=>{ if(!unlocked) return; setActiveLesson(ls); setQuizAnswer(null); setQuizDone(false); setQuizSubmitting(false); setFailedQuiz(false); setAttemptCount(0); go("lesson"); }}
                            style={{ background:isDone?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.02)", border:`1px solid ${isDone?c1+"25":unlocked?C.border:"rgba(255,255,255,0.04)"}`, borderRadius:14, padding:"14px 16px", cursor:unlocked?"pointer":"not-allowed", display:"flex", alignItems:"center", gap:12, marginBottom:8, opacity:unlocked?1:0.35, transition:"all 0.2s" }}>
                            <div style={{ width:38, height:38, borderRadius:10, background:isDone?`${c1}15`:unlocked?"rgba(255,255,255,0.04)":"transparent", border:`1px solid ${isDone?c1+"30":C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                              {isDone?"✅":unlocked?"▶️":"🔒"}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:13, fontWeight:700, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ls.title}</div>
                              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                                <span style={{ fontSize:10, color:C.text3 }}>📖 {t.lesson}</span>
                                <span style={{ fontSize:10, color:C.gold, fontWeight:600 }}>+{ls.xp} XP</span>
                                {isHiFallback && <span style={{ fontSize:9, color:C.orange }}>🌐 EN</span>}
                              </div>
                            </div>
                            {!unlocked&&<div style={{ fontSize:9, color:C.text3, textAlign:"right", maxWidth:56, lineHeight:1.3, flexShrink:0 }}>Pass<br/>previous</div>}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  {li===1&&<SmartAd idx={1}/>}
                  {li===3&&<SmartAd idx={2}/>}
                </div>
              );
            })}
            {passedLessons.length===totalLessons&&(
              <button className="tap" style={{ ...btnStyle(false,["#FFD700","#FF9A9E"]), marginBottom:20 }} onClick={()=>go("certificate")}>🎓 View Your Certificate →</button>
            )}
          </div>
        </div>
        <Nav/>
      </Wrap>
    );
  }

  // ── LESSON ────────────────────────────────────────────────────
  if (screen==="lesson"&&activeLesson) {
    const [c1,c2] = (LEVEL_COLORS)[activeLesson.lvl]||[C.gold,C.orange];
    const isHiFallback = lang==="hi" && !activeLesson.hiAvail;
    return (
      <Wrap bg="#000">
        <style>{CSS}</style>
        <XPFloat/>
        <div style={{ padding:"52px 24px 50px" }}>
          <button onClick={()=>go("home")} style={{ background:"none", border:"none", color:C.text2, cursor:"pointer", fontSize:20, marginBottom:24, padding:0 }}>{t.back}</button>
          <div style={{ fontSize:10, color:c1, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>{t.level} {activeLesson.lvl} · {t.lesson}</div>
          <div style={{ fontSize:24, fontWeight:800, lineHeight:1.25, letterSpacing:-0.7, marginBottom: isHiFallback?12:28 }}>{activeLesson.title}</div>
          {isHiFallback && (
            <div style={{ background:"rgba(255,107,53,0.08)", border:"1px solid rgba(255,107,53,0.2)", borderRadius:10, padding:"8px 14px", fontSize:11, color:C.orange, marginBottom:20 }}>
              {t.translationSoon}
            </div>
          )}
          <div style={{ borderLeft:`3px solid ${c1}`, paddingLeft:20, marginBottom:28 }}>
            <div style={{ fontSize:10, color:c1, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>📖 Story</div>
            <div style={{ fontSize:13, lineHeight:1.95, color:"rgba(255,255,255,0.78)", whiteSpace:"pre-line", maxWidth:420 }}>{activeLesson.story}</div>
          </div>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:10, color:C.text3, letterSpacing:2.5, textTransform:"uppercase", marginBottom:14 }}>{t.keyTakes}</div>
            {activeLesson.keyPoints.map((kp,i)=>(
              <div key={i} style={{ display:"flex", gap:12, marginBottom:14, alignItems:"flex-start" }}>
                <div style={{ width:20, height:20, borderRadius:99, background:`${c1}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:c1, fontWeight:700, flexShrink:0, marginTop:1 }}>{i+1}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.65 }}>{kp}</div>
              </div>
            ))}
          </div>
          <button className="tap" style={btnStyle(false,[c1,c2])} onClick={()=>go("quiz")}>{t.takeQuiz} → +{activeLesson.xp} XP</button>
        </div>
      </Wrap>
    );
  }

  // ── QUIZ ──────────────────────────────────────────────────────
  if (screen==="quiz"&&activeLesson) {
    const [c1] = (LEVEL_COLORS)[activeLesson.lvl]||[C.gold];
    return (
      <Wrap bg="#000" center>
        <style>{CSS}</style>
        <XPFloat/>
        <LeaveQuizDialog/>
        <div style={{ padding:"0 28px" }} className="fadeUp">
          {/* Error banner at top */}
          {failedQuiz && (
            <div style={{ background:"rgba(255,71,87,0.08)", border:"1px solid rgba(255,71,87,0.2)", borderRadius:10, padding:"12px 16px", marginBottom:20, fontSize:13, color:"rgba(255,140,140,0.9)", lineHeight:1.5 }}>
              {t.passNeeded} {attemptCount > 0 && <span style={{ fontSize:11, color:C.text3 }}>({t.attempt} {attemptCount})</span>}
            </div>
          )}
          <div style={{ fontSize:10, color:c1, letterSpacing:4, textTransform:"uppercase", marginBottom:20 }}>Quiz</div>
          <div style={{ fontSize:19, fontWeight:800, lineHeight:1.4, marginBottom:28, letterSpacing:-0.3 }}>{activeLesson.quiz.q}</div>
          {activeLesson.quiz.opts.map((o,i)=>{
            const isC = quizDone&&i===activeLesson.quiz.ans;
            const isW = quizDone&&quizAnswer===i&&i!==activeLesson.quiz.ans;
            return (
              <button key={i} style={optStyle(quizAnswer===i,isC,isW)} onClick={()=>!quizDone&&!quizSubmitting&&setQuizAnswer(i)}>
                <span style={{ color:C.text3, marginRight:10, fontWeight:700 }}>{String.fromCharCode(65+i)}.</span>{o}
              </button>
            );
          })}
          <div style={{ height:8 }}/>
          <button className="tap"
            style={{ ...btnStyle(), opacity:quizAnswer===null||quizSubmitting?0.3:1, pointerEvents:quizSubmitting?"none":"auto" }}
            disabled={quizAnswer===null||quizSubmitting||quizDone}
            onClick={()=>{
              if (quizAnswer===null||quizSubmitting||quizDone) return;
              setQuizSubmitting(true);
              setQuizDone(true);
              const correct = quizAnswer===activeLesson.quiz.ans;
              setTimeout(()=>completeLesson(activeLesson.id,correct),700);
            }}>
            {quizSubmitting ? t.submitting : t.submit}
          </button>
          {/* Back button after error or first attempt */}
          <button className="tap" style={{ ...btnStyle(true), marginTop:10 }}
            onClick={()=>{ if(quizAnswer!==null&&!quizDone){ setShowLeaveQuiz(true); } else { go("home"); } }}>
            {t.back} Back to lessons
          </button>
          {failedQuiz && (
            <button className="tap" style={{ ...btnStyle(false,[C.orange,C.gold]), marginTop:8 }}
              onClick={()=>{ setQuizAnswer(null); setQuizDone(false); setQuizSubmitting(false); setFailedQuiz(false); }}>
              {t.tryAgain}
            </button>
          )}
        </div>
      </Wrap>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────
  if (screen==="result"&&activeLesson) {
    const correct = quizAnswer===activeLesson.quiz.ans;
    const gained  = correct ? activeLesson.xp : Math.floor(activeLesson.xp*0.3);
    return (
      <Wrap bg="#000" center>
        <style>{CSS}</style>
        <BadgeUnlockOverlay/>
        <div className="pop" style={{ textAlign:"center", padding:"0 32px" }}>
          <div style={{ fontSize:72, marginBottom:20 }}>{correct?"🎉":"💡"}</div>
          <div style={{ fontSize:28, fontWeight:800, letterSpacing:-0.7, marginBottom:8 }}>{correct?t.correct:t.wrong}</div>
          {!correct&&<div style={{ fontSize:13, color:C.text2, marginBottom:20, lineHeight:1.6 }}>{t.ansWas} <span style={{ color:C.green, fontWeight:700 }}>{activeLesson.quiz.opts[activeLesson.quiz.ans]}</span></div>}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(247,201,75,0.07)", border:"1px solid rgba(247,201,75,0.15)", borderRadius:99, padding:"10px 24px", margin:"16px auto 24px" }}>
            <span style={{ fontSize:20, fontWeight:800, color:C.gold }}>+{gained}</span>
            <span style={{ fontSize:11, color:C.text3, letterSpacing:2, textTransform:"uppercase" }}>{t.xpEarned}</span>
          </div>
          {correct&&<div style={{ fontSize:12, color:"rgba(100,255,160,0.8)", marginBottom:20 }}>✓ {t.nextUnlocked}</div>}
          <SmartAd idx={0}/>
          <button className="tap" style={btnStyle()} onClick={()=>{ setTab("learn"); go("home"); }}>{t.keepGoing}</button>
        </div>
      </Wrap>
    );
  }

  // ── CERTIFICATE ───────────────────────────────────────────────
  if (screen==="certificate") {
    const date = new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    const handleShare = async () => {
      const text = `I just completed the StockSikho investing curriculum! 🎓📈 #StockSikho #LearnToInvest #IndiaInvests`;
      if (navigator.share) {
        try { await navigator.share({ title:"StockSikho Certificate", text }); } catch(e) {}
      } else {
        try { await navigator.clipboard.writeText(text); alert("Copied to clipboard! Share it anywhere."); } catch(e) {}
      }
      tryBadge("certificate");
    };
    return (
      <Wrap bg="#000" center>
        <style>{CSS}</style>
        <div style={{ width:"100%", padding:"24px", animation:"certIn 0.7s cubic-bezier(.2,.8,.2,1) both" }}>
          <div style={{ background:"#0A0A0E", border:"1px solid rgba(255,215,0,0.2)", borderRadius:24, padding:"40px 28px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:gr(C.gold,C.orange,90) }}/>
            <div style={{ fontSize:11, letterSpacing:4, color:C.gold, textTransform:"uppercase", marginBottom:10 }}>{t.certTitle}</div>
            <div style={{ width:40, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, margin:"12px auto 16px" }}/>
            <div style={{ fontSize:12, color:C.text2, marginBottom:10 }}>{t.certSub}</div>
            <div style={{ fontSize:26, fontWeight:800, marginBottom:10, background:gr(C.gold,C.orange), WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{user?.name||"Investor"}</div>
            <div style={{ fontSize:12, color:C.text2, lineHeight:1.7, marginBottom:16 }}>{t.certLine}</div>
            <div style={{ width:40, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, margin:"0 auto 16px" }}/>
            <div style={{ fontSize:11, color:C.text3, marginBottom:24 }}>{t.certDesc}</div>
            <div style={{ display:"flex", justifyContent:"center", gap:28, marginBottom:24 }}>
              {[["📚",passedLessons.length,t.lesson+"s"],["⭐",xp,"XP"],["🏅",earnedBadges.length,"Badges"]].map(([icon,val,label])=>(
                <div key={label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{icon}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:C.gold }}>{val}</div>
                  <div style={{ fontSize:9, color:C.text3, marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:10, color:C.text3 }}>Issued {date} · stocksikho.in</div>
          </div>
          <button className="tap" style={{ ...btnStyle(false,[C.gold,C.orange]), marginTop:16 }} onClick={handleShare}>{t.shareCert}</button>
          <button className="tap" style={{ ...btnStyle(true), marginTop:10 }} onClick={()=>window.print()}>{t.printCert}</button>
          <button className="tap" style={{ ...btnStyle(true), marginTop:10 }} onClick={()=>{ setTab("learn"); go("home"); }}>{t.continueLearning}</button>
        </div>
      </Wrap>
    );
  }

  // ── BADGES ────────────────────────────────────────────────────
  if (screen==="badges") {
    const cats = ["All",...new Set(BADGES.map(b=>b.cat))];
    const filtered = badgeFilter==="All"?BADGES:BADGES.filter(b=>b.cat===badgeFilter);
    const earnedCount = earnedBadges.length;
    const pctB = Math.round(earnedCount/BADGES.length*100);
    return (
      <Wrap bg="#000">
        <style>{CSS}</style>
        <BadgeDetailModal/>
        <div style={{ flex:1 }}>
          <div style={{ padding:"48px 24px 0", position:"sticky", top:0, background:"rgba(0,0,0,0.97)", backdropFilter:"blur(20px)", zIndex:50 }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
              <div style={{ position:"relative", width:72, height:72, flexShrink:0 }}>
                <svg width={72} height={72} style={{ transform:"rotate(-90deg)" }}>
                  <defs><linearGradient id="mg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F7C94B"/><stop offset="100%" stopColor="#FF6B35"/></linearGradient></defs>
                  <circle cx={36} cy={36} r={29} fill="none" stroke="#1C1C1E" strokeWidth={5}/>
                  <circle cx={36} cy={36} r={29} fill="none" stroke="url(#mg2)" strokeWidth={5} strokeLinecap="round" strokeDasharray={2*Math.PI*29} strokeDashoffset={2*Math.PI*29*(1-pctB/100)} style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"}}/>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ fontSize:15, fontWeight:800 }}>{pctB}%</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize:20, fontWeight:800, letterSpacing:-0.5 }}>{t.achievements}</div>
                <div style={{ fontSize:12, color:C.text2, marginTop:2 }}><span style={{ color:C.gold, fontWeight:700 }}>{earnedCount}</span> of {BADGES.length} {t.earnedOf}</div>
                <div style={{ fontSize:11, color:C.text3, marginTop:2 }}>{t.monthJourney}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:14 }}>
              {cats.map(c=>{
                const isA = badgeFilter===c;
                return <button key={c} onClick={()=>setBadgeFilter(c)} style={{ padding:"5px 12px", borderRadius:99, border:`1px solid ${isA?"rgba(247,201,75,0.5)":C.border}`, background:isA?"rgba(247,201,75,0.08)":"transparent", color:isA?C.gold:C.text3, fontSize:11, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'Sora',sans-serif", transition:"all 0.2s" }}>{c}</button>;
              })}
            </div>
          </div>
          <div style={{ padding:"4px 20px 20px" }}>
            {badgeFilter==="All"
              ? [...new Set(BADGES.map(b=>b.cat))].map(cat=>{
                  const cb=BADGES.filter(b=>b.cat===cat);
                  const ec=cb.filter(b=>earnedBadges.includes(b.id)).length;
                  return (
                    <div key={cat} style={{ marginBottom:28 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                        <div style={{ fontSize:12, fontWeight:700, flex:1 }}>{cat}</div>
                        <div style={{ fontSize:11, color:C.text3 }}>{ec}/{cb.length}</div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"18px 6px" }}>
                        {cb.map((b,i)=><BadgeRing key={b.id} badge={b} size={62} earned={earnedBadges.includes(b.id)} onClick={setBadgeModal} delay={i*0.04} showAnim/>)}
                      </div>
                    </div>
                  );
                })
              : <div style={{ paddingTop:12 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"20px 6px" }}>
                    {filtered.map((b,i)=><BadgeRing key={b.id} badge={b} size={62} earned={earnedBadges.includes(b.id)} onClick={setBadgeModal} delay={i*0.04} showAnim/>)}
                  </div>
                </div>
            }
          </div>
        </div>
        <Nav/>
      </Wrap>
    );
  }

  // ── PROFILE ───────────────────────────────────────────────────
  if (screen==="profile") return (
    <Wrap bg="#000">
      <style>{CSS}</style>
      <BadgeDetailModal/>
      <div style={{ flex:1, padding:"48px 24px 0" }}>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>{user?.name||"Investor"}</div>
          <div style={{ fontSize:12, color:C.text3, marginTop:3 }}>{t.level} {lvl} · {xp} XP total</div>
        </div>
        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:11, color:C.text3 }}>{t.level} {lvl}</span>
            <span style={{ fontSize:11, color:C.gold, fontWeight:600 }}>{300-xpInLvl} {t.toNextLevel}</span>
          </div>
          <ProgBar value={(xpInLvl/300)*100} h={4}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:28 }}>
          {[["🔥",streak,t.dayStreak],["⭐",xp,"XP"],["✅",passedLessons.length,"Passed"]].map(([icon,val,label])=>(
            <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 8px", textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:18, fontWeight:800 }}>{val}</div>
              <div style={{ fontSize:9, color:C.text3, textTransform:"uppercase", letterSpacing:1, marginTop:3, lineHeight:1.2 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>{t.recentBadges}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px 6px", marginBottom:16 }}>
          {BADGES.filter(b=>earnedBadges.includes(b.id)).slice(-8).map((b,i)=>(
            <BadgeRing key={b.id} badge={b} size={60} earned onClick={setBadgeModal} delay={i*0.05} showAnim/>
          ))}
        </div>
        <button className="tap" style={{ ...btnStyle(true), marginBottom:24 }} onClick={()=>{ setTab("badges"); go("badges"); }}>View All {BADGES.length} Badges →</button>
        {passedLessons.length===totalLessons&&(
          <button className="tap" style={{ ...btnStyle(false,["#FFD700","#FF9A9E"]), marginBottom:16 }} onClick={()=>go("certificate")}>🎓 View Your Certificate →</button>
        )}
        <div style={{ fontSize:13, fontWeight:700, marginBottom:14, marginTop:8 }}>{t.currProgress}</div>
        {[1,2,3,4,5,6,7].map(lvlN=>{
          const lvlLessons=lessons.filter(l=>l.lvl===lvlN);
          const dc=lvlLessons.filter(l=>passedLessons.includes(l.id)).length;
          const [c1]=(LEVEL_COLORS)[lvlN]||["#fff"];
          return (
            <div key={lvlN} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:`${c1}18`, border:`1px solid ${c1}28`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:c1, flexShrink:0 }}>{lvlN}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:700, marginBottom:5 }}>{t.level} {lvlN}</div>
                <ProgBar value={lvlLessons.length?dc/lvlLessons.length*100:0} colors={(LEVEL_COLORS)[lvlN]||["#fff","#ccc"]} h={2}/>
              </div>
              <div style={{ fontSize:11, color:c1, fontWeight:700, flexShrink:0 }}>{dc}/{lvlLessons.length}</div>
            </div>
          );
        })}
        <div style={{ height:20 }}/>
      </div>
      <Nav/>
    </Wrap>
  );

  return null;
}
