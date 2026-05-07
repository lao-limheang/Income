// src/App.js — Chafé · Full Redesign v3
import React, { useEffect, useState, useRef, useCallback } from "react";
import { auth, db } from "./firebase";
import Chart from "chart.js/auto";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const ADMIN_EMAIL    = "laolimheang1@gmail.com";
const ADMIN_PASSWORD = "12345678";
const KHR_RATE       = 4100;

const TELEGRAM_BOT_TOKEN = "8705921253:AAGddpOtGR2iZEjqCCTdzlUkrmULfS9B1sM";
const TELEGRAM_CHAT_ID   = "1458220999";

/* ─────────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────────── */
const DICT = {
  en: {
    appName:"Chafé", appSub:"Finance Manager",
    dashboard:"Dashboard", income:"Income", expense:"Expense",
    reports:"Reports", list:"Daily Summary", recurring:"Recurring", staff:"Staff",
    calculator:"Profit Calc",
    dashboardDesc:"Overview of your finances",
    incomeDesc:"Record money coming in",
    expenseDesc:"Record money going out",
    reportsDesc:"Filter & analyse by period",
    listDesc:"Day-by-day breakdown",
    recurringDesc:"Fixed monthly costs",
    staffDesc:"Manage your team",
    calculatorDesc:"Daily / Monthly / Yearly profit",
    addIncome:"Add Income", addExpense:"Add Expense", addStaff:"Add Staff Member",
    amountUSD:"Total Amount (USD $)", amountKHR:"Total Amount (KHR ៛)",
    cashAmount:"Cash Amount (USD)",
    bankAmount:"Bank Amount (USD)",
    appAmount:"App Delivery (USD)",
    dailyExpAmount:"Daily Expenses (USD)",
    source:"Source / Note", description:"Description", paymentMethod:"Payment Method",
    cash:"Cash", aba:"ABA Bank", creditCard:"Credit Card", other:"Other",
    shift:"Shift", morning:"Morning", afternoon:"Afternoon",
    owner:"Shop", save:"Save", delete:"Delete", cancel:"Cancel", edit:"Edit",
    month:"Month", year:"Year", filter:"Filter",
    totalIncome:"Total Income", totalExpense:"Total Expense", profit:"Profit / Loss",
    login:"Sign In", logout:"Sign Out", loading:"Loading…",
    noRecords:"No records found",
    incomeList:"Income Records", expenseList:"Expense Records",
    date:"Date", action:"Action", method:"Payment", category:"Category",
    staffName:"Staff Name", ownerType:"Expense By",
    monthly:"Monthly", yearly:"Yearly",
    bankTotal:"Bank", foodpanda:"Foodpanda", wownow:"Wownow",
    otherApp:"Other App", cards:"Cards", dailyExp:"Daily Expenses",
    frequency:"Frequency", recurringName:"Name", addRecurring:"Add Recurring",
    overview:"Overview", quickStats:"Quick Stats",
    incomeRec:"income records", expenseRec:"expense records",
    welcomeBack:"Welcome back", signedAs:"Signed in as",
    successAdded:"Saved successfully!",
    successUpdated:"Updated successfully!",
    errorAmount:"Please enter an amount",
    errorSource:"Source is required",
    errorName:"Name is required",
    confirmDelete:"Delete this record?",
    deleted:"Deleted", updated:"Updated",
    profitMargin:"Profit Margin",
    monthTrend:"6-Month Trend",
    summary:"Summary",
    allTime:"All time",
    cashSale:"Cash Sale",
    ac:"AC / Kiosk",
    shopExpense:"Shop Expense",
    ownerExpense:"Owner Expense",
    expenseType:"Expense Type",
    selectAll:"Select All",
    deleteSelected:"Delete Selected",
    selected:"selected",
    totalRiel:"Total (Riel)",
    income_note:"Income Breakdown",
    daily_exp_note:"Daily Expenses (from income)",
    calcTitle:"Profit Calculator",
    calcDesc:"Calculate profit including all recurring & daily expenses",
    filterDate:"Filter by Date",
    startDate:"Start Date",
    endDate:"End Date",
    today:"Today",
    thisMonth:"This Month",
    thisYear:"This Year",
    custom:"Custom",
    grossIncome:"Gross Income",
    totalDailyExp:"Daily Expenses",
    totalRecurring:"Recurring (pro-rated)",
    netProfit:"Net Profit",
    includeRecurring:"Include Recurring Costs",
    perDay:"per day avg",
  },
  km: {
    appName:"Chafé", appSub:"គ្រប់គ្រងហិរញ្ញវត្ថុ",
    dashboard:"ទំព័រដើម", income:"ចំណូល", expense:"ចំណាយ",
    reports:"របាយការណ៍", list:"សង្ខេបប្រចាំថ្ងៃ", recurring:"ចំណាយទៀងទាត់", staff:"បុគ្គលិក",
    calculator:"គណនាចំណេញ",
    dashboardDesc:"ទិដ្ឋភាពទូទៅ",
    incomeDesc:"កត់ត្រាប្រាក់ចូល",
    expenseDesc:"កត់ត្រាប្រាក់ចេញ",
    reportsDesc:"ត្រង និងវិភាគ",
    listDesc:"ព័ត៌មានប្រចាំថ្ងៃ",
    recurringDesc:"ថ្លៃចំណាយថេរ",
    staffDesc:"គ្រប់គ្រងបុគ្គលិក",
    calculatorDesc:"គណនាប្រចាំថ្ងៃ / ខែ / ឆ្នាំ",
    addIncome:"បន្ថែមចំណូល", addExpense:"បន្ថែមចំណាយ", addStaff:"បន្ថែមបុគ្គលិក",
    amountUSD:"ចំណូលសរុប (USD $)", amountKHR:"ចំណូលសរុប (KHR ៛)",
    cashAmount:"ប្រាក់សាច់ (USD)",
    bankAmount:"ប្រាក់ធនាគារ (USD)",
    appAmount:"App Delivery (USD)",
    dailyExpAmount:"ចំណាយប្រចាំថ្ងៃ (USD)",
    source:"ប្រភព / កំណត់ចំណាំ", description:"ពណ៌នា", paymentMethod:"វិធីបង់",
    cash:"សាច់ប្រាក់", aba:"ABA", creditCard:"កាតឥណទាន", other:"ផ្សេងៗ",
    shift:"វេន", morning:"ព្រឹក", afternoon:"ល្ងាច",
    owner:"ហាង", save:"រក្សាទុក", delete:"លុប", cancel:"បោះបង់", edit:"កែ",
    month:"ខែ", year:"ឆ្នាំ", filter:"តម្រង",
    totalIncome:"សរុបចំណូល", totalExpense:"សរុបចំណាយ", profit:"ចំណេញ / ខាត",
    login:"ចូល", logout:"ចាកចេញ", loading:"កំពុងផ្ទុក…",
    noRecords:"គ្មានទិន្នន័យ",
    incomeList:"បញ្ជីចំណូល", expenseList:"បញ្ជីចំណាយ",
    date:"កាលបរិច្ឆេទ", action:"", method:"វិធីបង់", category:"ប្រភេទ",
    staffName:"ឈ្មោះបុគ្គលិក", ownerType:"ចំណាយដោយ",
    monthly:"ប្រចាំខែ", yearly:"ប្រចាំឆ្នាំ",
    bankTotal:"ធនាគារ", foodpanda:"Foodpanda", wownow:"Wownow",
    otherApp:"App ផ្សេង", cards:"កាត", dailyExp:"ចំណាយ",
    frequency:"ប្រេកង់", recurringName:"ឈ្មោះ", addRecurring:"បន្ថែមចំណាយទៀងទាត់",
    overview:"ទិដ្ឋភាពទូទៅ", quickStats:"ស្ថិតិ",
    incomeRec:"កំណត់ត្រាចំណូល", expenseRec:"កំណត់ត្រាចំណាយ",
    welcomeBack:"សូមស្វាគមន៍", signedAs:"ចូលជា",
    successAdded:"បន្ថែមដោយជោគជ័យ!",
    successUpdated:"កែប្រែដោយជោគជ័យ!",
    errorAmount:"សូមបញ្ចូលចំនួន",
    errorSource:"ប្រភពចាំបាច់",
    errorName:"ឈ្មោះចាំបាច់",
    confirmDelete:"លុបកំណត់ត្រានេះ?",
    deleted:"លុបហើយ", updated:"កែប្រែហើយ",
    profitMargin:"ភាគរយចំណេញ",
    monthTrend:"និន្នាការ ៦ ខែ",
    summary:"សង្ខេប",
    allTime:"សរុបទាំងអស់",
    cashSale:"លក់សាច់ប្រាក់",
    ac:"AC / Kiosk",
    shopExpense:"ចំណាយហាង",
    ownerExpense:"ចំណាយម្ចាស់",
    expenseType:"ប្រភេទចំណាយ",
    selectAll:"ជ្រើសទាំងអស់",
    deleteSelected:"លុបដែលជ្រើស",
    selected:"ជ្រើស",
    totalRiel:"សរុប (រៀល)",
    income_note:"ព័ត៌មានលុយចូល",
    daily_exp_note:"ចំណាយប្រចាំថ្ងៃ (ពីចំណូល)",
    calcTitle:"គណនាចំណេញ",
    calcDesc:"គណនាចំណេញ រួមទាំងចំណាយទៀងទាត់ និងប្រចាំថ្ងៃ",
    filterDate:"ត្រងតាមកាលបរិច្ឆេទ",
    startDate:"ចាប់ផ្តើម",
    endDate:"បញ្ចប់",
    today:"ថ្ងៃនេះ",
    thisMonth:"ខែនេះ",
    thisYear:"ឆ្នាំនេះ",
    custom:"ជ្រើស",
    grossIncome:"ចំណូលសរុប",
    totalDailyExp:"ចំណាយប្រចាំថ្ងៃ",
    totalRecurring:"ចំណាយទៀងទាត់",
    netProfit:"ចំណេញសុទ្ធ",
    includeRecurring:"រួមបញ្ចូលចំណាយទៀងទាត់",
    perDay:"ជាមធ្យមក្នុងមួយថ្ងៃ",
  }
};

function useDict() {
  const [lang, setLang] = useState("km");
  const t = useCallback((k) => DICT[lang][k] || k, [lang]);
  return { lang, setLang, t };
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const fmt  = (n) => "$" + Number(n||0).toFixed(2);
const fmtK = (n) => "៛" + new Intl.NumberFormat("km-KH",{maximumFractionDigits:0}).format(n||0);
const toDate = (d) => d?.seconds ? new Date(d.seconds*1000) : new Date(d);
const todayISO = () => new Date().toISOString().slice(0,16);

async function sendTelegram(text) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID,text})
    });
  } catch(e){ console.warn("Telegram:",e); }
}

/* ─────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────── */
const Icon = ({ name, size=18, color="currentColor" }) => {
  const s = { width:size, height:size, display:"inline-block", verticalAlign:"middle", flexShrink:0 };
  const icons = {
    dashboard: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
    income:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 7l-5-5-5 5"/><path d="M5 12h14"/></svg>,
    expense:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V2M7 17l5 5 5-5"/><path d="M5 12h14"/></svg>,
    reports:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    list:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M10 4v16"/></svg>,
    recurring: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    staff:     <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    calculator:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg>,
    logout:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
    coffee:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>,
    trash:     <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    edit:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    plus:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    menu:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    x:         <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    trending:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    check:     <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    alert:     <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    calendar:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    user:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    sun:       <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>,
    moon:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    dollar:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    filter:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    save:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    info:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    tag:       <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    layers:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    zap:       <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    arrowUp:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    arrowDown: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    clock:     <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    percent:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  };
  return icons[name] || null;
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Noto+Sans+Khmer:wght@300;400;500;600;700&display=swap');

  :root {
    --bg:           #F0EDE8;
    --bg2:          #E8E3DC;
    --surface:      #FDFBF8;
    --surface2:     #F5F0E8;
    --border:       #DDD5C8;
    --border-light: #EAE4DA;
    --brown-deep:   #1E1008;
    --brown-dark:   #2D1A0A;
    --brown-mid:    #5C3317;
    --brown:        #8B4513;
    --accent:       #C4752A;
    --accent-dim:   rgba(196,117,42,0.12);
    --accent-glow:  rgba(196,117,42,0.25);
    --green:        #1F6B40;
    --green-dim:    rgba(31,107,64,0.1);
    --red:          #A8292F;
    --red-dim:      rgba(168,41,47,0.1);
    --gold:         #D4952A;
    --blue:         #2563EB;
    --blue-dim:     rgba(37,99,235,0.1);
    --purple:       #7C3AED;
    --purple-dim:   rgba(124,58,237,0.1);
    --teal:         #0D9488;
    --teal-dim:     rgba(13,148,136,0.1);
    --text:         #1A0F05;
    --text2:        #5A4535;
    --text3:        #9A8575;
    --text4:        #BEB0A0;
    --shadow-sm:    0 1px 4px rgba(30,16,8,0.08);
    --shadow:       0 2px 12px rgba(30,16,8,0.10);
    --shadow-md:    0 4px 20px rgba(30,16,8,0.12);
    --shadow-lg:    0 8px 32px rgba(30,16,8,0.16);
    --r-sm:         8px;
    --r:            12px;
    --r-lg:         16px;
    --r-xl:         20px;
    --sidebar-w:    72px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Sora', 'Noto Sans Khmer', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── ICON-ONLY SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w);
    min-height: 100vh;
    background: var(--brown-dark);
    position: fixed; left: 0; top: 0; z-index: 100;
    display: flex; flex-direction: column; align-items: center;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    border-right: 1px solid rgba(255,255,255,0.05);
    padding: 0;
  }
  .sidebar-logo-icon {
    width: 40px; height: 40px;
    background: var(--accent);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: white; margin: 16px 0 10px;
    flex-shrink: 0;
  }
  .sidebar-divider { width: 40px; height: 1px; background: rgba(255,255,255,0.1); margin: 6px 0; }
  .sidebar-nav { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 0; width: 100%; }

  /* nav item — icon only with tooltip */
  .nav-item {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px;
    border-radius: var(--r-sm);
    border: none; background: none; cursor: pointer;
    transition: background 0.15s;
    color: rgba(255,245,232,0.5);
  }
  .nav-item:hover { background: rgba(255,255,255,0.08); color: #FFF5E8; }
  .nav-item.active { background: var(--accent); color: white; }
  .nav-item .tooltip {
    position: absolute; left: 58px; top: 50%; transform: translateY(-50%);
    background: var(--brown-deep); color: #FFF5E8;
    padding: 5px 10px; border-radius: 7px;
    font-size: 11.5px; font-weight: 600; white-space: nowrap;
    pointer-events: none; opacity: 0;
    transition: opacity 0.15s;
    font-family: 'Noto Sans Khmer', 'Sora', sans-serif;
    box-shadow: var(--shadow-md);
    z-index: 200;
  }
  .nav-item:hover .tooltip { opacity: 1; }

  .sidebar-footer { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px 0 14px; width: 100%; }
  .lang-col { display: flex; flex-direction: column; gap: 4px; }
  .lang-btn { width: 40px; padding: 5px 0; border-radius: 7px; font-size: 10px; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: rgba(255,245,232,0.4); transition: all 0.15s; }
  .lang-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
  .logout-icon-btn {
    width: 40px; height: 40px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(168,41,47,0.18); color: #FF9090;
    border: 1px solid rgba(168,41,47,0.25); cursor: pointer;
    transition: background 0.15s;
  }
  .logout-icon-btn:hover { background: rgba(168,41,47,0.32); }

  /* MOBILE */
  .mobile-topbar { display: none; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--brown-dark); position: sticky; top: 0; z-index: 200; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .mobile-topbar-logo { display: flex; align-items: center; gap: 8px; }
  .mobile-logo-icon { width: 30px; height: 30px; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .mobile-topbar h1 { font-size: 17px; color: #FFF5E8; font-weight: 700; }
  .hamburger { background: rgba(255,255,255,0.08); border: none; color: rgba(255,245,232,0.8); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 8px; cursor: pointer; }
  .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99; display: none; backdrop-filter: blur(2px); }

  /* mobile: full sidebar */
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); width: 220px; align-items: flex-start; padding: 0; }
    .sidebar.open { transform: translateX(0); box-shadow: 8px 0 32px rgba(0,0,0,0.3); }
    .mobile-topbar { display: flex; }
    .sidebar-overlay.open { display: block; }
    .main-content { margin-left: 0 !important; }
    .sidebar-logo-icon { margin: 16px auto 10px; }
    .sidebar-divider { width: 80%; margin: 6px auto; }
    .sidebar-nav { align-items: flex-start; padding: 6px 10px; width: 100%; }
    .nav-item { width: 100%; border-radius: var(--r-sm); padding: 0 10px; justify-content: flex-start; gap: 10px; }
    .nav-item .tooltip { display: none; }
    .nav-label-mobile { font-size: 12.5px; font-weight: 500; color: inherit; font-family: 'Noto Sans Khmer','Sora',sans-serif; }
    .sidebar-footer { align-items: flex-start; padding: 10px 16px 16px; }
    .lang-col { flex-direction: row; }
    .logout-icon-btn { width: auto; padding: 8px 14px; gap: 8px; font-size: 12.5px; font-family: 'Noto Sans Khmer','Sora',sans-serif; }
  }

  /* MAIN */
  .main-content { margin-left: var(--sidebar-w); padding: 24px 28px; min-height: 100vh; }
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
  .page-title { font-size: 24px; font-weight: 700; color: var(--brown-deep); font-family: 'Sora', sans-serif; }
  .page-subtitle { font-size: 12px; color: var(--text3); margin-top: 3px; font-family: 'Noto Sans Khmer', 'Sora', sans-serif; }
  .signed-chip { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); padding: 5px 11px; border-radius: 20px; font-size: 11px; color: var(--text3); }

  /* CARDS */
  .card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--shadow); border: 1px solid var(--border-light); padding: 22px; }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .card-title { font-size: 13.5px; font-weight: 600; color: var(--brown-mid); display: flex; align-items: center; gap: 8px; font-family: 'Noto Sans Khmer', 'Sora', sans-serif; }
  .card-title-icon { width: 26px; height: 26px; background: var(--accent-dim); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: var(--accent); }

  /* STAT CARDS */
  .stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px; }
  @media (max-width: 900px) { .stat-grid { grid-template-columns: 1fr; } }
  .stat-card { background: var(--surface); border-radius: var(--r-lg); padding: 20px 22px; box-shadow: var(--shadow); border: 1px solid var(--border-light); position: relative; overflow: hidden; transition: transform 0.18s, box-shadow 0.18s; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--border); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.red::before   { background: var(--red); }
  .stat-card.gold::before  { background: var(--gold); }
  .stat-card.blue::before  { background: var(--blue); }
  .stat-card.teal::before  { background: var(--teal); }
  .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .stat-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
  .stat-icon-wrap { width: 40px; height: 40px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; }
  .stat-icon-wrap.green  { background: var(--green-dim); color: var(--green); }
  .stat-icon-wrap.red    { background: var(--red-dim);   color: var(--red); }
  .stat-icon-wrap.gold   { background: var(--accent-dim); color: var(--accent); }
  .stat-icon-wrap.blue   { background: var(--blue-dim);  color: var(--blue); }
  .stat-icon-wrap.teal   { background: var(--teal-dim);  color: var(--teal); }
  .stat-label { font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px; }
  .stat-value { font-size: 26px; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; letter-spacing: -0.5px; }
  .stat-value.green  { color: var(--green); }
  .stat-value.red    { color: var(--red); }
  .stat-value.gold   { color: var(--gold); }
  .stat-value.teal   { color: var(--teal); }
  .stat-sub { font-size: 11px; color: var(--text4); margin-top: 3px; }
  .stat-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-top: 5px; }
  .stat-badge.positive { background: var(--green-dim); color: var(--green); }
  .stat-badge.negative { background: var(--red-dim); color: var(--red); }

  /* BREAKDOWN STRIP */
  .breakdown-strip { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  .breakdown-pill { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: var(--surface2); border: 1px solid var(--border-light); color: var(--text2); }
  .breakdown-pill.cash   { background: rgba(31,107,64,0.08);  color: var(--green);  border-color: rgba(31,107,64,0.18); }
  .breakdown-pill.bank   { background: rgba(37,99,235,0.08);  color: var(--blue);   border-color: rgba(37,99,235,0.18); }
  .breakdown-pill.app    { background: rgba(196,117,42,0.10); color: var(--accent); border-color: rgba(196,117,42,0.2); }
  .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .dot.green  { background: var(--green); }
  .dot.blue   { background: var(--blue); }
  .dot.accent { background: var(--accent); }
  .dot.red    { background: var(--red); }
  .dot.teal   { background: var(--teal); }

  /* FORMS */
  .form-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
  @media (max-width: 640px) { .form-grid, .form-grid-3 { grid-template-columns: 1fr; } }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-label { font-size: 10.5px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Sora', sans-serif; display: flex; align-items: center; gap: 5px; }
  .form-input, .form-select { width: 100%; padding: 9px 12px; border-radius: var(--r-sm); border: 1.5px solid var(--border); background: var(--bg); font-family: 'Sora', 'Noto Sans Khmer', sans-serif; font-size: 13.5px; color: var(--text); transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; appearance: none; }
  .form-input:focus, .form-select:focus { outline: none; border-color: var(--accent); background: var(--surface); box-shadow: 0 0 0 3px var(--accent-glow); }
  .form-input::placeholder { color: var(--text4); }
  .form-section-title { font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; padding: 8px 0 6px; border-bottom: 1px solid var(--border-light); margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }

  /* INCOME BREAKDOWN FORM */
  .income-breakdown { background: var(--surface2); border: 1px solid var(--border-light); border-radius: var(--r-sm); padding: 14px; margin-bottom: 14px; }
  .income-breakdown-title { font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
  .breakdown-input-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .breakdown-input-row:last-child { margin-bottom: 0; }
  .breakdown-label { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; min-width: 130px; color: var(--text2); }
  .breakdown-input { flex: 1; padding: 7px 11px; border-radius: var(--r-sm); border: 1.5px solid var(--border); background: var(--surface); font-family: 'Sora', sans-serif; font-size: 13px; color: var(--text); transition: border-color 0.15s; }
  .breakdown-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }
  .breakdown-input::placeholder { color: var(--text4); }
  .breakdown-input.red-border { border-color: var(--red); }
  .breakdown-note { font-size: 10px; color: var(--text4); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-light); font-style: italic; }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: var(--r-sm); font-family: 'Sora', 'Noto Sans Khmer', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; border: none; transition: all 0.18s; letter-spacing: 0.2px; }
  .btn-primary { background: var(--accent); color: white; box-shadow: 0 2px 8px rgba(196,117,42,0.3); }
  .btn-primary:hover { background: var(--brown-mid); }
  .btn-danger { background: var(--red-dim); color: var(--red); border: 1px solid rgba(168,41,47,0.15); padding: 5px 9px; font-size: 11.5px; }
  .btn-danger:hover { background: rgba(168,41,47,0.2); }
  .btn-edit { background: rgba(37,99,235,0.1); color: var(--blue); border: 1px solid rgba(37,99,235,0.15); padding: 5px 9px; font-size: 11.5px; }
  .btn-edit:hover { background: rgba(37,99,235,0.18); }
  .btn-ghost { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--border); }
  .btn-del-sel { background: var(--red); color: white; padding: 7px 14px; font-size: 12px; }
  .btn-del-sel:hover { background: #8B1E23; }
  .btn-teal { background: var(--teal); color: white; }
  .btn-teal:hover { background: #0a7a6e; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* QUICK DATE BUTTONS */
  .quick-date-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
  .quick-date-btn { padding: 6px 13px; border-radius: 20px; border: 1.5px solid var(--border); background: var(--surface2); color: var(--text2); font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 5px; font-family: 'Noto Sans Khmer','Sora',sans-serif; }
  .quick-date-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
  .quick-date-btn:hover:not(.active) { border-color: var(--accent); color: var(--accent); }

  /* ALERTS */
  .alert { display: flex; align-items: center; gap: 8px; padding: 10px 13px; border-radius: var(--r-sm); font-size: 12.5px; margin-bottom: 14px; font-family: 'Noto Sans Khmer', 'Sora', sans-serif; }
  .alert-success { background: var(--green-dim); color: var(--green); border: 1px solid rgba(31,107,64,0.2); }
  .alert-error   { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(168,41,47,0.2); }

  /* TABLE */
  .tbl-wrap { overflow-x: auto; max-height: 460px; overflow-y: auto; border-radius: var(--r-sm); }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  thead th { padding: 9px 12px; text-align: left; background: var(--bg2); color: var(--text3); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; position: sticky; top: 0; border-bottom: 1.5px solid var(--border); font-family: 'Sora', sans-serif; white-space: nowrap; }
  thead th.cb-col { width: 36px; text-align: center; }
  tbody td { padding: 10px 12px; border-bottom: 1px solid var(--border-light); color: var(--text); vertical-align: middle; font-family: 'Noto Sans Khmer', 'Sora', sans-serif; }
  tbody tr:hover { background: var(--surface2); }
  tbody tr.selected-row { background: rgba(37,99,235,0.05); }
  tbody tr:last-child td { border-bottom: none; }

  /* SELECT TOOLBAR */
  .select-toolbar { display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: rgba(37,99,235,0.07); border: 1px solid rgba(37,99,235,0.2); border-radius: var(--r-sm); margin-bottom: 10px; flex-wrap: wrap; }
  .select-toolbar-text { font-size: 12.5px; font-weight: 600; color: var(--blue); flex: 1; }

  /* CHARTS */
  .chart-box { position: relative; height: 210px; }

  /* LAYOUTS */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
  .section-gap { margin-bottom: 18px; }

  /* FILTER BAR */
  .filter-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; background: var(--surface); padding: 12px 16px; border-radius: var(--r-lg); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); }
  .filter-label { font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.6px; display: flex; align-items: center; gap: 5px; }
  .filter-sep { width: 1px; height: 18px; background: var(--border); }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; font-family: 'Noto Sans Khmer', 'Sora', sans-serif; white-space: nowrap; }
  .badge-morning   { background: rgba(196,117,42,0.12); color: var(--accent); }
  .badge-afternoon { background: rgba(92,51,23,0.1); color: var(--brown-mid); }
  .badge-owner     { background: var(--green-dim); color: var(--green); }
  .badge-staff     { background: rgba(80,80,200,0.1); color: #4444BB; }
  .badge-monthly   { background: var(--accent-dim); color: var(--accent); }
  .badge-yearly    { background: rgba(92,51,23,0.1); color: var(--brown-mid); }
  .badge-shop      { background: var(--blue-dim); color: var(--blue); }
  .badge-cash      { background: var(--green-dim); color: var(--green); }
  .badge-bank      { background: var(--blue-dim); color: var(--blue); }
  .badge-app       { background: var(--accent-dim); color: var(--accent); }
  .badge-daily     { background: var(--teal-dim); color: var(--teal); }

  /* AMOUNTS */
  .amt-pos { color: var(--green); font-weight: 600; font-variant-numeric: tabular-nums; }
  .amt-neg { color: var(--red);   font-weight: 600; font-variant-numeric: tabular-nums; }
  .amt-neu { color: var(--text2); font-weight: 600; font-variant-numeric: tabular-nums; }
  .amt-blue{ color: var(--blue);  font-weight: 600; font-variant-numeric: tabular-nums; }
  .amt-teal{ color: var(--teal);  font-weight: 600; font-variant-numeric: tabular-nums; }

  /* TOAST */
  .toast { position: fixed; bottom: 24px; right: 24px; padding: 13px 18px; border-radius: var(--r); font-size: 13px; font-weight: 500; box-shadow: var(--shadow-lg); animation: toastIn 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 9999; display: flex; align-items: center; gap: 10px; min-width: 200px; font-family: 'Noto Sans Khmer', 'Sora', sans-serif; }
  .toast.success { background: var(--green); color: white; }
  .toast.error   { background: var(--red);   color: white; }
  @keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

  /* SPINNER */
  .spinner { width: 15px; height: 15px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; animation: spin 0.7s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* LOGIN */
  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--brown-dark); padding: 20px; position: relative; overflow: hidden; }
  .login-bg-circle { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(196,117,42,0.15), transparent 70%); pointer-events: none; }
  .login-card { background: var(--surface); border-radius: var(--r-xl); padding: 40px 36px; width: 100%; max-width: 400px; box-shadow: 0 24px 64px rgba(0,0,0,0.4); position: relative; z-index: 1; border: 1px solid var(--border-light); }
  .login-brand { text-align: center; margin-bottom: 32px; }
  .login-logo { width: 60px; height: 60px; background: var(--brown-dark); border-radius: var(--r); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: var(--accent); }
  .login-brand h1 { font-size: 30px; font-weight: 700; color: var(--brown-deep); }
  .login-brand p  { font-size: 12px; color: var(--text3); margin-top: 4px; }
  .login-field { margin-bottom: 14px; }
  .login-label { font-size: 10.5px; font-weight: 700; color: var(--text2); display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border-light); margin: 18px 0; }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 36px 20px; color: var(--text4); }
  .empty-state-icon { width: 44px; height: 44px; background: var(--surface2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--text4); }
  .empty-state p { font-size: 12.5px; font-family: 'Noto Sans Khmer', 'Sora', sans-serif; }

  /* MINI STATS */
  .mini-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px,1fr)); gap: 10px; }
  .mini-stat { background: var(--surface2); border-radius: var(--r-sm); padding: 14px 12px; text-align: center; border: 1px solid var(--border-light); }
  .mini-stat-val { font-size: 26px; font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums; }
  .mini-stat-lbl { font-size: 10.5px; color: var(--text3); margin-top: 3px; font-family: 'Noto Sans Khmer', 'Sora', sans-serif; }

  /* EDIT MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(3px); }
  .modal-box { background: var(--surface); border-radius: var(--r-xl); padding: 28px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.3); border: 1px solid var(--border-light); }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .modal-title { font-size: 16px; font-weight: 700; color: var(--brown-deep); }
  .modal-close { background: var(--surface2); border: 1px solid var(--border); color: var(--text3); width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

  /* DAILY DETAIL */
  .day-block { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); margin-bottom: 14px; overflow: hidden; }
  .day-block-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: var(--surface2); border-bottom: 1px solid var(--border-light); cursor: pointer; gap: 12px; flex-wrap: wrap; }
  .day-block-date { font-weight: 700; color: var(--brown-mid); font-size: 14px; }
  .day-chips { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .day-block-body { padding: 16px 18px; }
  .day-income-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px,1fr)); gap: 10px; margin-bottom: 14px; }
  .day-income-cell { background: var(--bg); border-radius: var(--r-sm); padding: 10px 12px; border: 1px solid var(--border-light); }
  .day-income-cell-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text3); margin-bottom: 4px; }
  .day-income-cell-val { font-size: 16px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .day-income-cell-val.green { color: var(--green); }
  .day-income-cell-val.blue { color: var(--blue); }
  .day-income-cell-val.accent { color: var(--accent); }
  .day-income-cell-val.red { color: var(--red); }
  .day-income-cell-val.teal { color: var(--teal); }

  .day-exp-row { border-top: 1px solid var(--border-light); padding-top: 12px; }
  .day-exp-title { font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; }
  .day-exp-item { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed var(--border-light); font-size: 12.5px; }
  .day-exp-item:last-child { border-bottom: none; }

  /* CHECKBOX */
  .cb { width: 16px; height: 16px; cursor: pointer; accent-color: var(--blue); }

  /* CALC RESULT CARD */
  .calc-result-big { text-align: center; padding: 28px 20px; border-radius: var(--r-lg); margin-bottom: 18px; }
  .calc-result-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text3); margin-bottom: 10px; font-family: 'Sora',sans-serif; }
  .calc-result-value { font-size: 42px; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -1px; }
  .calc-result-sub { font-size: 12px; color: var(--text4); margin-top: 6px; }
  .calc-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; border-radius: var(--r-sm); margin-bottom: 6px; font-size: 13px; }
  .calc-row-label { display: flex; align-items: center; gap: 8px; color: var(--text2); font-weight: 500; font-family: 'Noto Sans Khmer','Sora',sans-serif; }
  .calc-row-value { font-weight: 700; font-variant-numeric: tabular-nums; font-size: 14px; }
  .calc-section-title { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text3); margin: 16px 0 8px; display: flex; align-items: center; gap: 6px; }
  .toggle-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .toggle-switch input[type=checkbox] { width: 36px; height: 20px; accent-color: var(--accent); cursor: pointer; }

  @media (max-width: 768px) {
    .main-content { padding: 14px 12px; }
    .page-title { font-size: 20px; }
    .stat-value { font-size: 21px; }
    .card { padding: 16px 14px; }
    .two-col { grid-template-columns: 1fr; }
    .stat-grid { grid-template-columns: 1fr; }
    .calc-result-value { font-size: 30px; }
  }
`;

/* ─────────────────────────────────────────────
   INJECT STYLES
───────────────────────────────────────────── */
function GlobalStyle() {
  useEffect(()=>{
    const el = document.createElement("style");
    el.textContent = STYLE;
    document.head.appendChild(el);
    return ()=>document.head.removeChild(el);
  },[]);
  return null;
}

function Spinner() { return <div className="spinner" />; }

function Toast({ toast, onClear }) {
  useEffect(()=>{
    if(!toast) return;
    const t = setTimeout(onClear, 3200);
    return ()=>clearTimeout(t);
  },[toast]);
  if(!toast) return null;
  return (
    <div className={`toast ${toast.type}`}>
      <Icon name={toast.type==="success"?"check":"alert"} size={15} />
      {toast.message}
    </div>
  );
}

/* ─────────────────────────────────────────────
   EDIT MODAL — generic
───────────────────────────────────────────── */
function EditModal({ title, onClose, onSave, children, loading }) {
  return (
    <div className="modal-overlay" onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        {children}
        <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
          <button className="btn btn-ghost" onClick={onClose}><Icon name="x" size={13}/>Cancel</button>
          <button className="btn btn-primary" onClick={onSave} disabled={loading}>
            {loading?<Spinner/>:<Icon name="save" size={14}/>} Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV CONFIG — now includes calculator
───────────────────────────────────────────── */
const NAV = [
  { id:"dashboard",  icon:"dashboard" },
  { id:"income",     icon:"income" },
  { id:"expense",    icon:"expense" },
  { id:"reports",    icon:"reports" },
  { id:"list",       icon:"list" },
  { id:"calculator", icon:"calculator" },
  { id:"recurring",  icon:"recurring" },
  { id:"staff",      icon:"staff" },
];

/* ─────────────────────────────────────────────
   SIDEBAR — icon-only with tooltips
───────────────────────────────────────────── */
function Sidebar({ page, setPage, onLogout, t, lang, setLang, open, onClose }) {
  return (
    <>
      <div className={`sidebar-overlay ${open?"open":""}`} onClick={onClose} />
      <aside className={`sidebar ${open?"open":""}`}>
        <div className="sidebar-logo-icon"><Icon name="coffee" size={19} color="white" /></div>
        <div className="sidebar-divider" />
        <nav className="sidebar-nav">
          {NAV.map(n=>(
            <button key={n.id} className={`nav-item ${page===n.id?"active":""}`}
              onClick={()=>{ setPage(n.id); onClose(); }}
              title={t(n.id)}
            >
              <Icon name={n.icon} size={18} color={page===n.id?"white":"rgba(255,245,232,0.6)"} />
              <span className="tooltip">{t(n.id)}</span>
              {/* mobile label */}
              <span className="nav-label-mobile" style={{display:"none"}}>{t(n.id)}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="lang-col">
            <button className={`lang-btn ${lang==="km"?"active":""}`} onClick={()=>setLang("km")}>ខ្មែរ</button>
            <button className={`lang-btn ${lang==="en"?"active":""}`} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button className="logout-icon-btn" onClick={onLogout} title={t("logout")}>
            <Icon name="logout" size={16} color="#FF9090" />
          </button>
        </div>
      </aside>
    </>
  );
}

/* mobile: show nav-label-mobile */
const mobileStyle = `@media(max-width:768px){.nav-label-mobile{display:inline!important}.nav-item .tooltip{display:none}}`;

/* ─────────────────────────────────────────────
   AUTH
───────────────────────────────────────────── */
function Auth({ onUser, t }) {
  const [email, setEmail]       = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState(null);

  async function handleLogin(e) {
    e.preventDefault(); setErr(null);
    if(email!==ADMIN_EMAIL||password!==ADMIN_PASSWORD){ setErr("Only admin can login."); return; }
    setLoading(true);
    try {
      const cred = await auth.signInWithEmailAndPassword(email,password);
      onUser(cred.user);
    } catch(error){ setErr(error.message); }
    finally{ setLoading(false); }
  }

  return (
    <div className="login-page">
      <div className="login-bg-circle" style={{width:600,height:600,top:-200,right:-200,opacity:0.5}} />
      <div className="login-bg-circle" style={{width:400,height:400,bottom:-150,left:-100}} />
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo"><Icon name="coffee" size={30} color="var(--accent)" /></div>
          <h1>Chafé</h1>
          <p>Admin Finance Portal</p>
        </div>
        {err && <div className="alert alert-error"><Icon name="alert" size={14}/>{err}</div>}
        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label className="login-label">Email</label>
            <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:"100%",marginTop:8,justifyContent:"center"}} disabled={loading}>
            {loading?<Spinner/>:<Icon name="check" size={14}/>} {t("login")}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
function Dashboard({ incomes, expenses, t }) {
  const chartRef = useRef(null);
  const barRef   = useRef(null);

  const totalInc = incomes.reduce((s,i)=>s+(i.amountUSD||0)+(i.amountKHR||0)/KHR_RATE,0);
  const totalExp = expenses.reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0);
  const totalDailyFromIncome = incomes.reduce((s,i)=>s+(i.dailyExpUSD||0),0);
  const profit   = totalInc - totalExp - totalDailyFromIncome;
  const margin   = totalInc > 0 ? Math.round(profit/totalInc*100) : 0;
  const totalKHR = incomes.reduce((s,i)=>s+(i.amountKHR||0),0);

  useEffect(()=>{
    if(!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if(chartRef.current._ci) chartRef.current._ci.destroy();
    chartRef.current._ci = new Chart(ctx,{
      type:"doughnut",
      data:{ labels:[t("totalIncome"), t("totalExpense"), t("dailyExp")], datasets:[{ data:[totalInc.toFixed(2), totalExp.toFixed(2), totalDailyFromIncome.toFixed(2)], backgroundColor:["#1F6B40","#A8292F","#0D9488"], borderWidth:0, hoverOffset:4 }] },
      options:{ responsive:true, maintainAspectRatio:false, cutout:"72%", plugins:{legend:{position:"bottom",labels:{color:"#5A4535",font:{family:"Sora",size:11},padding:14}}} }
    });
    return ()=>{ if(chartRef.current?._ci) chartRef.current._ci.destroy(); };
  },[totalInc,totalExp,totalDailyFromIncome]);

  useEffect(()=>{
    if(!barRef.current) return;
    const months = Array.from({length:6},(_,i)=>{ const d=new Date(); d.setMonth(d.getMonth()-5+i); return d; });
    const labels = months.map(d=>d.toLocaleString("default",{month:"short"}));
    const incData = months.map(d=>{ const m=d.getMonth(),y=d.getFullYear(); return incomes.filter(i=>{ const dt=toDate(i.date); return dt.getMonth()===m&&dt.getFullYear()===y; }).reduce((s,i)=>s+(i.amountUSD||0)+(i.amountKHR||0)/KHR_RATE,0); });
    const expData = months.map(d=>{ const m=d.getMonth(),y=d.getFullYear(); return expenses.filter(e=>{ const dt=toDate(e.date); return dt.getMonth()===m&&dt.getFullYear()===y; }).reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0); });
    const ctx=barRef.current.getContext("2d");
    if(barRef.current._ci) barRef.current._ci.destroy();
    barRef.current._ci=new Chart(ctx,{ type:"bar", data:{labels,datasets:[{label:t("income"),data:incData,backgroundColor:"#1F6B40",borderRadius:5},{label:t("expense"),data:expData,backgroundColor:"#A8292F",borderRadius:5}]}, options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{color:"#5A4535",font:{family:"Sora",size:11},padding:14}}},scales:{x:{grid:{display:false},ticks:{color:"#9A8575",font:{family:"Sora",size:10}}},y:{grid:{color:"#EAE4DA"},ticks:{color:"#9A8575",font:{family:"Sora",size:10}}}}} });
    return ()=>{ if(barRef.current?._ci) barRef.current._ci.destroy(); };
  },[incomes,expenses]);

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card green">
          <div className="stat-row">
            <div>
              <div className="stat-label">{t("totalIncome")}</div>
              <div className="stat-value green">{fmt(totalInc)}</div>
              <div className="stat-sub">{fmtK(totalKHR)}</div>
            </div>
            <div className="stat-icon-wrap green"><Icon name="income" size={19}/></div>
          </div>
          <span className="stat-badge positive"><Icon name="trending" size={11}/>{incomes.length} {t("incomeRec")}</span>
        </div>
        <div className="stat-card red">
          <div className="stat-row">
            <div>
              <div className="stat-label">{t("totalExpense")}</div>
              <div className="stat-value red">{fmt(totalExp + totalDailyFromIncome)}</div>
              <div className="stat-sub">Daily: {fmt(totalDailyFromIncome)}</div>
            </div>
            <div className="stat-icon-wrap red"><Icon name="expense" size={19}/></div>
          </div>
          <span className="stat-badge negative">{expenses.length} {t("expenseRec")}</span>
        </div>
        <div className={`stat-card ${profit>=0?"green":"red"}`}>
          <div className="stat-row">
            <div>
              <div className="stat-label">{t("profit")}</div>
              <div className={`stat-value ${profit>=0?"green":"red"}`}>{fmt(profit)}</div>
              <div className="stat-sub">{t("profitMargin")}: {margin}%</div>
            </div>
            <div className={`stat-icon-wrap ${profit>=0?"green":"red"}`}><Icon name="dollar" size={19}/></div>
          </div>
          <span className={`stat-badge ${profit>=0?"positive":"negative"}`}>{profit>=0?"▲ Positive":"▼ Negative"}</span>
        </div>
      </div>
      <div className="two-col section-gap">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-icon"><Icon name="reports" size={13}/></div>{t("overview")}</div>
            <span style={{fontSize:10,color:"var(--text4)"}}>{t("allTime")}</span>
          </div>
          <div className="chart-box"><canvas ref={chartRef}/></div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-icon"><Icon name="trending" size={13}/></div>{t("monthTrend")}</div>
          </div>
          <div className="chart-box"><canvas ref={barRef}/></div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon"><Icon name="dashboard" size={13}/></div>{t("quickStats")}</div>
        </div>
        <div className="mini-stat-grid">
          <div className="mini-stat"><div className="mini-stat-val">{incomes.length}</div><div className="mini-stat-lbl">{t("incomeRec")}</div></div>
          <div className="mini-stat"><div className="mini-stat-val">{expenses.length}</div><div className="mini-stat-lbl">{t("expenseRec")}</div></div>
          <div className="mini-stat"><div className="mini-stat-val" style={{color:margin>=0?"var(--green)":"var(--red)"}}>{margin}%</div><div className="mini-stat-lbl">{t("profitMargin")}</div></div>
          <div className="mini-stat"><div className="mini-stat-val">{fmtK(totalKHR)}</div><div className="mini-stat-lbl">KHR {t("totalIncome")}</div></div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ADD INCOME FORM — includes daily expense input
───────────────────────────────────────────── */
function AddIncome({ onAdd, t }) {
  const [f,setF] = useState({
    totalUSD:"", totalKHR:"",
    cashUSD:"", bankUSD:"", appUSD:"",
    dailyExpUSD:"",
    source:"", date:todayISO()
  });
  const [loading,setLoading] = useState(false);
  const [msg,setMsg]         = useState(null);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  async function submit(e){
    e.preventDefault(); setMsg(null);
    const total = parseFloat(f.totalUSD)||0;
    const khr   = parseFloat(f.totalKHR)||0;
    if(total<=0&&khr<=0){ setMsg({text:t("errorAmount"),type:"error"}); return; }
    if(!f.source.trim()){ setMsg({text:t("errorSource"),type:"error"}); return; }
    setLoading(true);
    try {
      await onAdd("income",{
        amountUSD:  total,
        amountKHR:  khr,
        cashUSD:    parseFloat(f.cashUSD)||0,
        bankUSD:    parseFloat(f.bankUSD)||0,
        appUSD:     parseFloat(f.appUSD)||0,
        dailyExpUSD:parseFloat(f.dailyExpUSD)||0,
        source:     f.source.trim(),
        date:       new Date(f.date),
        createdAt:  new Date()
      });
      setF(p=>({...p, totalUSD:"", totalKHR:"", cashUSD:"", bankUSD:"", appUSD:"", dailyExpUSD:"", source:""}));
      setMsg({text:t("successAdded"),type:"success"});
    } catch(err){ setMsg({text:err.message,type:"error"}); }
    finally{ setLoading(false); }
  }

  const total = parseFloat(f.totalUSD)||0;
  const cashV = parseFloat(f.cashUSD)||0;
  const bankV = parseFloat(f.bankUSD)||0;
  const appV  = parseFloat(f.appUSD)||0;
  const breakdown_sum = cashV+bankV+appV;
  const diff = Math.abs(total - breakdown_sum);
  const breakdownOk = total===0 || diff < 0.01;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon" style={{background:"var(--green-dim)",color:"var(--green)"}}>
            <Icon name="plus" size={13}/>
          </div>
          {t("addIncome")}
        </div>
      </div>
      {msg && <div className={`alert alert-${msg.type}`}><Icon name={msg.type==="success"?"check":"alert"} size={14}/>{msg.text}</div>}
      <form onSubmit={submit}>
        {/* Total amount */}
        <div className="form-grid" style={{marginBottom:14}}>
          <div className="form-group">
            <label className="form-label"><Icon name="dollar" size={11}/>{t("amountUSD")}</label>
            <input className="form-input" type="number" step="0.01" min="0" value={f.totalUSD} onChange={e=>set("totalUSD",e.target.value)} placeholder="0.00" />
          </div>
          <div className="form-group">
            <label className="form-label"><Icon name="dollar" size={11}/>{t("amountKHR")}</label>
            <input className="form-input" type="number" step="1" min="0" value={f.totalKHR} onChange={e=>set("totalKHR",e.target.value)} placeholder="0" />
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="income-breakdown">
          <div className="income-breakdown-title">
            <span className="dot green"></span>{t("income_note")}
          </div>
          <div className="breakdown-input-row">
            <div className="breakdown-label"><span className="dot green"></span>{t("cashAmount")}</div>
            <input className="breakdown-input" type="number" step="0.01" min="0" value={f.cashUSD} onChange={e=>set("cashUSD",e.target.value)} placeholder="0.00" />
          </div>
          <div className="breakdown-input-row">
            <div className="breakdown-label"><span className="dot blue"></span>{t("bankAmount")}</div>
            <input className="breakdown-input" type="number" step="0.01" min="0" value={f.bankUSD} onChange={e=>set("bankUSD",e.target.value)} placeholder="0.00" />
          </div>
          <div className="breakdown-input-row">
            <div className="breakdown-label"><span className="dot accent"></span>{t("appAmount")}</div>
            <input className="breakdown-input" type="number" step="0.01" min="0" value={f.appUSD} onChange={e=>set("appUSD",e.target.value)} placeholder="0.00" />
          </div>
          {!breakdownOk && (
            <div style={{marginTop:8,fontSize:11,color:"var(--red)",display:"flex",alignItems:"center",gap:5}}>
              <Icon name="alert" size={12}/> Breakdown {fmt(breakdown_sum)} ≠ Total {fmt(total)}
            </div>
          )}
          <div className="breakdown-note"><Icon name="info" size={10}/> Cash & breakdown entered by admin only</div>
        </div>

        {/* Daily Expense — NEW */}
        <div className="income-breakdown" style={{borderColor:"rgba(13,148,136,0.25)",background:"rgba(13,148,136,0.04)"}}>
          <div className="income-breakdown-title" style={{color:"var(--teal)"}}>
            <span className="dot teal"></span>{t("daily_exp_note")}
          </div>
          <div className="breakdown-input-row">
            <div className="breakdown-label" style={{color:"var(--teal)"}}><span className="dot teal"></span>{t("dailyExpAmount")}</div>
            <input className="breakdown-input" type="number" step="0.01" min="0" value={f.dailyExpUSD} onChange={e=>set("dailyExpUSD",e.target.value)} placeholder="0.00" />
          </div>
          <div className="breakdown-note"><Icon name="zap" size={10}/> ចំណាយប្រចាំថ្ងៃ (ម្ហូប, ថ្លៃទឹក, ភ្លើង ។ល។) — នឹងត្រូវគណនាក្នុងចំណេញ</div>
        </div>

        <div className="form-grid" style={{marginBottom:14}}>
          <div className="form-group">
            <label className="form-label"><Icon name="tag" size={11}/>{t("source")}</label>
            <input className="form-input" value={f.source} onChange={e=>set("source",e.target.value)} placeholder="Foodpanda, Wownow, Walk-in…" />
          </div>
          <div className="form-group">
            <label className="form-label"><Icon name="calendar" size={11}/>{t("date")}</label>
            <input className="form-input" type="datetime-local" value={f.date} onChange={e=>set("date",e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading?<Spinner/>:<Icon name="save" size={14}/>} {t("save")}
        </button>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INCOME EDIT MODAL
───────────────────────────────────────────── */
function EditIncomeModal({ record, onClose, onSave }) {
  const [f,setF] = useState({
    totalUSD:   record.amountUSD||"",
    totalKHR:   record.amountKHR||"",
    cashUSD:    record.cashUSD||"",
    bankUSD:    record.bankUSD||"",
    appUSD:     record.appUSD||"",
    dailyExpUSD:record.dailyExpUSD||"",
    source:     record.source||"",
    date:       toDate(record.date).toISOString().slice(0,16),
  });
  const [loading,setLoading] = useState(false);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  async function save(){
    setLoading(true);
    await onSave({
      amountUSD:   parseFloat(f.totalUSD)||0,
      amountKHR:   parseFloat(f.totalKHR)||0,
      cashUSD:     parseFloat(f.cashUSD)||0,
      bankUSD:     parseFloat(f.bankUSD)||0,
      appUSD:      parseFloat(f.appUSD)||0,
      dailyExpUSD: parseFloat(f.dailyExpUSD)||0,
      source:      f.source,
      date:        new Date(f.date),
    });
    setLoading(false);
    onClose();
  }

  return (
    <EditModal title="Edit Income" onClose={onClose} onSave={save} loading={loading}>
      <div className="form-grid" style={{marginBottom:12}}>
        <div className="form-group"><label className="form-label"><Icon name="dollar" size={11}/>Total USD</label><input className="form-input" type="number" step="0.01" value={f.totalUSD} onChange={e=>set("totalUSD",e.target.value)}/></div>
        <div className="form-group"><label className="form-label"><Icon name="dollar" size={11}/>Total KHR</label><input className="form-input" type="number" step="1" value={f.totalKHR} onChange={e=>set("totalKHR",e.target.value)}/></div>
      </div>
      <div className="income-breakdown" style={{marginBottom:12}}>
        <div className="income-breakdown-title"><span className="dot green"></span>Breakdown</div>
        <div className="breakdown-input-row"><div className="breakdown-label"><span className="dot green"></span>Cash (USD)</div><input className="breakdown-input" type="number" step="0.01" value={f.cashUSD} onChange={e=>set("cashUSD",e.target.value)}/></div>
        <div className="breakdown-input-row"><div className="breakdown-label"><span className="dot blue"></span>Bank (USD)</div><input className="breakdown-input" type="number" step="0.01" value={f.bankUSD} onChange={e=>set("bankUSD",e.target.value)}/></div>
        <div className="breakdown-input-row"><div className="breakdown-label"><span className="dot accent"></span>App (USD)</div><input className="breakdown-input" type="number" step="0.01" value={f.appUSD} onChange={e=>set("appUSD",e.target.value)}/></div>
      </div>
      <div className="income-breakdown" style={{marginBottom:12,borderColor:"rgba(13,148,136,0.25)",background:"rgba(13,148,136,0.04)"}}>
        <div className="income-breakdown-title" style={{color:"var(--teal)"}}><span className="dot teal"></span>Daily Expense</div>
        <div className="breakdown-input-row"><div className="breakdown-label" style={{color:"var(--teal)"}}><span className="dot teal"></span>Daily Exp (USD)</div><input className="breakdown-input" type="number" step="0.01" value={f.dailyExpUSD} onChange={e=>set("dailyExpUSD",e.target.value)}/></div>
      </div>
      <div className="form-grid">
        <div className="form-group"><label className="form-label"><Icon name="tag" size={11}/>Source</label><input className="form-input" value={f.source} onChange={e=>set("source",e.target.value)}/></div>
        <div className="form-group"><label className="form-label"><Icon name="calendar" size={11}/>Date</label><input className="form-input" type="datetime-local" value={f.date} onChange={e=>set("date",e.target.value)}/></div>
      </div>
    </EditModal>
  );
}

/* ─────────────────────────────────────────────
   INCOME PAGE
───────────────────────────────────────────── */
function IncomePage({ incomes, onAdd, onDelete, onUpdate, t }) {
  const [selected, setSelected] = useState(new Set());
  const [editRec, setEditRec]   = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const toggleSelect = (id) => setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleAll    = () => setSelected(selected.size===incomes.length ? new Set() : new Set(incomes.map(i=>i.id)));

  async function deleteSelected(){
    if(!window.confirm(`Delete ${selected.size} records?`)) return;
    setDelLoading(true);
    for(const id of selected) await onDelete("income",id,true);
    setSelected(new Set());
    setDelLoading(false);
  }

  return (
    <div className="two-col">
      <AddIncome onAdd={onAdd} t={t} />
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon"><Icon name="list" size={13}/></div>
            {t("incomeList")}
          </div>
          <span style={{fontSize:11,color:"var(--text4)",background:"var(--surface2)",padding:"2px 9px",borderRadius:20}}>{incomes.length}</span>
        </div>

        {selected.size > 0 && (
          <div className="select-toolbar">
            <span className="select-toolbar-text">{selected.size} {t("selected")}</span>
            <button className="btn btn-del-sel" onClick={deleteSelected} disabled={delLoading}>
              {delLoading?<Spinner/>:<Icon name="trash" size={13}/>} {t("deleteSelected")}
            </button>
            <button className="btn btn-ghost" style={{padding:"6px 12px",fontSize:12}} onClick={()=>setSelected(new Set())}><Icon name="x" size={12}/>Clear</button>
          </div>
        )}

        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th className="cb-col"><input type="checkbox" className="cb" checked={selected.size===incomes.length&&incomes.length>0} onChange={toggleAll}/></th>
              <th><Icon name="calendar" size={10}/> {t("date")}</th>
              <th><Icon name="tag" size={10}/> {t("source")}</th>
              <th><Icon name="dollar" size={10}/> Cash</th>
              <th><Icon name="layers" size={10}/> Bank</th>
              <th><Icon name="zap" size={10}/> App</th>
              <th><Icon name="arrowDown" size={10}/> Daily Exp</th>
              <th><Icon name="dollar" size={10}/> Total</th>
              <th><Icon name="edit" size={10}/></th>
            </tr></thead>
            <tbody>
              {incomes.length===0
                ? <tr><td colSpan={9}><div className="empty-state"><div className="empty-state-icon"><Icon name="income" size={19}/></div><p>{t("noRecords")}</p></div></td></tr>
                : incomes.map(i=>(
                  <tr key={i.id} className={selected.has(i.id)?"selected-row":""}>
                    <td style={{textAlign:"center"}}><input type="checkbox" className="cb" checked={selected.has(i.id)} onChange={()=>toggleSelect(i.id)}/></td>
                    <td style={{whiteSpace:"nowrap",fontSize:11,color:"var(--text3)"}}>{toDate(i.date).toLocaleString()}</td>
                    <td style={{fontWeight:500,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.source}</td>
                    <td className="amt-pos">{i.cashUSD?fmt(i.cashUSD):"-"}</td>
                    <td className="amt-blue">{i.bankUSD?fmt(i.bankUSD):"-"}</td>
                    <td style={{color:"var(--accent)",fontWeight:600}}>{i.appUSD?fmt(i.appUSD):"-"}</td>
                    <td className="amt-teal">{i.dailyExpUSD?fmt(i.dailyExpUSD):"-"}</td>
                    <td className="amt-pos">{fmt(i.amountUSD||0)}</td>
                    <td>
                      <div style={{display:"flex",gap:5}}>
                        <button className="btn btn-edit" onClick={()=>setEditRec(i)}><Icon name="edit" size={12}/></button>
                        <button className="btn btn-danger" onClick={()=>onDelete("income",i.id)}><Icon name="trash" size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {editRec && (
        <EditIncomeModal
          record={editRec}
          onClose={()=>setEditRec(null)}
          onSave={(data)=>onUpdate("income",editRec.id,data)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ADD EXPENSE FORM
───────────────────────────────────────────── */
function AddExpense({ onAdd, t, staffList }) {
  const [f,setF] = useState({
    amountUSD:"", amountKHR:"",
    description:"", category:"",
    date:todayISO(), shift:"Morning",
    expenseType:"shop", ownerType:"Owner", staffName:""
  });
  const [loading,setLoading] = useState(false);
  const [msg,setMsg]         = useState(null);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  async function submit(e){
    e.preventDefault(); setMsg(null);
    const usd=parseFloat(f.amountUSD)||0, khr=parseFloat(f.amountKHR)||0;
    if(usd<=0&&khr<=0){ setMsg({text:t("errorAmount"),type:"error"}); return; }
    setLoading(true);
    try {
      await onAdd("expense",{
        amountUSD:usd, amountKHR:khr,
        description:f.description.trim(), category:f.category.trim(),
        date:new Date(f.date), shift:f.shift,
        expenseType:f.expenseType,
        ownerType:f.ownerType,
        staffName:f.ownerType==="Staff"?f.staffName:null,
        createdAt:new Date()
      });
      setF(p=>({...p,amountUSD:"",amountKHR:"",description:"",category:"",staffName:""}));
      setMsg({text:t("successAdded"),type:"success"});
    } catch(err){ setMsg({text:err.message,type:"error"}); }
    finally{ setLoading(false); }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon" style={{background:"var(--red-dim)",color:"var(--red)"}}>
            <Icon name="plus" size={13}/>
          </div>
          {t("addExpense")}
        </div>
      </div>
      {msg && <div className={`alert alert-${msg.type}`}><Icon name={msg.type==="success"?"check":"alert"} size={14}/>{msg.text}</div>}
      <form onSubmit={submit}>
        <div className="form-grid" style={{marginBottom:14}}>
          <div className="form-group">
            <label className="form-label"><Icon name="dollar" size={11}/>{t("amountUSD")}</label>
            <input className="form-input" type="number" step="0.01" min="0" value={f.amountUSD} onChange={e=>set("amountUSD",e.target.value)} placeholder="0.00" />
          </div>
          <div className="form-group">
            <label className="form-label"><Icon name="dollar" size={11}/>{t("amountKHR")}</label>
            <input className="form-input" type="number" step="1" min="0" value={f.amountKHR} onChange={e=>set("amountKHR",e.target.value)} placeholder="0" />
          </div>
        </div>
        <div className="form-grid" style={{marginBottom:14}}>
          <div className="form-group">
            <label className="form-label"><Icon name="info" size={11}/>{t("description")}</label>
            <input className="form-input" value={f.description} onChange={e=>set("description",e.target.value)} placeholder="Salary, Electric…" />
          </div>
          <div className="form-group">
            <label className="form-label"><Icon name="tag" size={11}/>{t("category")}</label>
            <input className="form-input" value={f.category} onChange={e=>set("category",e.target.value)} placeholder="Salary, Rent…" />
          </div>
        </div>
        <div className="form-section-title">
          <Icon name="layers" size={12}/>{t("expenseType")}
        </div>
        <div className="form-grid-3" style={{marginBottom:14}}>
          <div className="form-group">
            <label className="form-label"><Icon name="tag" size={11}/>Type</label>
            <select className="form-select" value={f.expenseType} onChange={e=>set("expenseType",e.target.value)}>
              <option value="shop">{t("shopExpense")}</option>
              <option value="owner">{t("ownerExpense")}</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label"><Icon name="user" size={11}/>{t("ownerType")}</label>
            <select className="form-select" value={f.ownerType} onChange={e=>set("ownerType",e.target.value)}>
              <option value="Owner">{t("owner")}</option>
              <option value="Staff">{t("staff")}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label"><Icon name="clock" size={11}/>{t("shift")}</label>
            <select className="form-select" value={f.shift} onChange={e=>set("shift",e.target.value)}>
              <option value="Morning">{t("morning")}</option>
              <option value="Afternoon">{t("afternoon")}</option>
            </select>
          </div>
        </div>
        {f.ownerType==="Staff" && (
          <div className="form-group" style={{marginBottom:14}}>
            <label className="form-label"><Icon name="staff" size={11}/>{t("staffName")}</label>
            <select className="form-select" value={f.staffName} onChange={e=>set("staffName",e.target.value)}>
              <option value="">-- Select --</option>
              {staffList.map(s=><option key={s.id} value={s.name}>{s.name} ({s.shift})</option>)}
            </select>
          </div>
        )}
        <div className="form-group" style={{marginBottom:18}}>
          <label className="form-label"><Icon name="calendar" size={11}/>{t("date")}</label>
          <input className="form-input" type="datetime-local" value={f.date} onChange={e=>set("date",e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading?<Spinner/>:<Icon name="save" size={14}/>} {t("save")}
        </button>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EXPENSE EDIT MODAL
───────────────────────────────────────────── */
function EditExpenseModal({ record, staffList, onClose, onSave, t }) {
  const [f,setF] = useState({
    amountUSD: record.amountUSD||"",
    amountKHR: record.amountKHR||"",
    description: record.description||"",
    category: record.category||"",
    date: toDate(record.date).toISOString().slice(0,16),
    shift: record.shift||"Morning",
    expenseType: record.expenseType||"shop",
    ownerType: record.ownerType||"Owner",
    staffName: record.staffName||"",
  });
  const [loading,setLoading] = useState(false);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  async function save(){
    setLoading(true);
    await onSave({
      amountUSD: parseFloat(f.amountUSD)||0,
      amountKHR: parseFloat(f.amountKHR)||0,
      description: f.description, category: f.category,
      date: new Date(f.date), shift: f.shift,
      expenseType: f.expenseType, ownerType: f.ownerType,
      staffName: f.ownerType==="Staff"?f.staffName:null,
    });
    setLoading(false);
    onClose();
  }

  return (
    <EditModal title="Edit Expense" onClose={onClose} onSave={save} loading={loading}>
      <div className="form-grid" style={{marginBottom:12}}>
        <div className="form-group"><label className="form-label"><Icon name="dollar" size={11}/>Amount USD</label><input className="form-input" type="number" step="0.01" value={f.amountUSD} onChange={e=>set("amountUSD",e.target.value)}/></div>
        <div className="form-group"><label className="form-label"><Icon name="dollar" size={11}/>Amount KHR</label><input className="form-input" type="number" value={f.amountKHR} onChange={e=>set("amountKHR",e.target.value)}/></div>
      </div>
      <div className="form-grid" style={{marginBottom:12}}>
        <div className="form-group"><label className="form-label"><Icon name="info" size={11}/>Description</label><input className="form-input" value={f.description} onChange={e=>set("description",e.target.value)}/></div>
        <div className="form-group"><label className="form-label"><Icon name="tag" size={11}/>Category</label><input className="form-input" value={f.category} onChange={e=>set("category",e.target.value)}/></div>
      </div>
      <div className="form-grid-3" style={{marginBottom:12}}>
        <div className="form-group"><label className="form-label">Type</label>
          <select className="form-select" value={f.expenseType} onChange={e=>set("expenseType",e.target.value)}>
            <option value="shop">Shop</option><option value="owner">Owner</option><option value="daily">Daily</option>
          </select>
        </div>
        <div className="form-group"><label className="form-label">By</label>
          <select className="form-select" value={f.ownerType} onChange={e=>set("ownerType",e.target.value)}>
            <option value="Owner">Owner</option><option value="Staff">Staff</option>
          </select>
        </div>
        <div className="form-group"><label className="form-label"><Icon name="clock" size={11}/>Shift</label>
          <select className="form-select" value={f.shift} onChange={e=>set("shift",e.target.value)}>
            <option value="Morning">Morning</option><option value="Afternoon">Afternoon</option>
          </select>
        </div>
      </div>
      {f.ownerType==="Staff" && (
        <div className="form-group" style={{marginBottom:12}}>
          <label className="form-label"><Icon name="staff" size={11}/>Staff</label>
          <select className="form-select" value={f.staffName} onChange={e=>set("staffName",e.target.value)}>
            <option value="">--</option>
            {staffList.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
      )}
      <div className="form-group">
        <label className="form-label"><Icon name="calendar" size={11}/>Date</label>
        <input className="form-input" type="datetime-local" value={f.date} onChange={e=>set("date",e.target.value)}/>
      </div>
    </EditModal>
  );
}

/* ─────────────────────────────────────────────
   EXPENSE PAGE
───────────────────────────────────────────── */
function ExpensePage({ expenses, staffList, onAdd, onDelete, onUpdate, t }) {
  const [selected, setSelected] = useState(new Set());
  const [editRec,  setEditRec]  = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const toggleSelect = (id) => setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleAll    = () => setSelected(selected.size===expenses.length ? new Set() : new Set(expenses.map(e=>e.id)));

  async function deleteSelected(){
    if(!window.confirm(`Delete ${selected.size} records?`)) return;
    setDelLoading(true);
    for(const id of selected) await onDelete("expense",id,true);
    setSelected(new Set());
    setDelLoading(false);
  }

  return (
    <div>
      <div className="two-col section-gap">
        <AddExpense onAdd={onAdd} t={t} staffList={staffList} />
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon" style={{background:"var(--red-dim)",color:"var(--red)"}}><Icon name="list" size={13}/></div>
              {t("expenseList")}
            </div>
            <span style={{fontSize:11,color:"var(--text4)",background:"var(--surface2)",padding:"2px 9px",borderRadius:20}}>{expenses.length}</span>
          </div>
          {selected.size > 0 && (
            <div className="select-toolbar">
              <span className="select-toolbar-text">{selected.size} {t("selected")}</span>
              <button className="btn btn-del-sel" onClick={deleteSelected} disabled={delLoading}>
                {delLoading?<Spinner/>:<Icon name="trash" size={13}/>} {t("deleteSelected")}
              </button>
              <button className="btn btn-ghost" style={{padding:"6px 12px",fontSize:12}} onClick={()=>setSelected(new Set())}><Icon name="x" size={12}/>Clear</button>
            </div>
          )}
          <div className="tbl-wrap">
            <table>
              <thead><tr>
                <th className="cb-col"><input type="checkbox" className="cb" checked={selected.size===expenses.length&&expenses.length>0} onChange={toggleAll}/></th>
                <th><Icon name="calendar" size={10}/> {t("date")}</th>
                <th><Icon name="info" size={10}/> {t("description")}</th>
                <th><Icon name="tag" size={10}/> Type</th>
                <th><Icon name="user" size={10}/> {t("ownerType")}</th>
                <th><Icon name="dollar" size={10}/> USD</th>
                <th><Icon name="dollar" size={10}/> KHR</th>
                <th><Icon name="edit" size={10}/></th>
              </tr></thead>
              <tbody>
                {expenses.length===0
                  ? <tr><td colSpan={8}><div className="empty-state"><div className="empty-state-icon"><Icon name="expense" size={19}/></div><p>{t("noRecords")}</p></div></td></tr>
                  : expenses.map(e=>(
                    <tr key={e.id} className={selected.has(e.id)?"selected-row":""}>
                      <td style={{textAlign:"center"}}><input type="checkbox" className="cb" checked={selected.has(e.id)} onChange={()=>toggleSelect(e.id)}/></td>
                      <td style={{whiteSpace:"nowrap",fontSize:11,color:"var(--text3)"}}>{toDate(e.date).toLocaleString()}</td>
                      <td style={{fontWeight:500,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.description||e.category||"-"}</td>
                      <td>
                        <span className={`badge ${e.expenseType==="shop"?"badge-shop":e.expenseType==="owner"?"badge-owner":e.expenseType==="daily"?"badge-daily":"badge-morning"}`}>
                          {e.expenseType||"daily"}
                        </span>
                      </td>
                      <td style={{fontSize:12}}>{e.ownerType}{e.staffName?` · ${e.staffName}`:""}</td>
                      <td className="amt-neg">{fmt(e.amountUSD||0)}</td>
                      <td style={{fontSize:11,color:"var(--text3)"}}>{e.amountKHR?fmtK(e.amountKHR):"-"}</td>
                      <td>
                        <div style={{display:"flex",gap:5}}>
                          <button className="btn btn-edit" onClick={()=>setEditRec(e)}><Icon name="edit" size={12}/></button>
                          <button className="btn btn-danger" onClick={()=>onDelete("expense",e.id)}><Icon name="trash" size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {editRec && (
        <EditExpenseModal
          record={editRec} staffList={staffList} t={t}
          onClose={()=>setEditRec(null)}
          onSave={(data)=>onUpdate("expense",editRec.id,data)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROFIT CALCULATOR PAGE — NEW
───────────────────────────────────────────── */
function CalculatorPage({ incomes, expenses, recurring, t }) {
  const [mode, setMode]             = useState("today"); // today | month | year | custom
  const [customStart, setCustomStart] = useState(() => { const d=new Date(); d.setDate(d.getDate()-7); return d.toISOString().slice(0,10); });
  const [customEnd, setCustomEnd]     = useState(() => new Date().toISOString().slice(0,10));
  const [includeRec, setIncludeRec]   = useState(true);
  const chartRef = useRef(null);

  const getRange = useCallback(() => {
    const now = new Date();
    if(mode==="today") {
      return { start: new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0), end: new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59,999), days:1 };
    } else if(mode==="month") {
      const start = new Date(now.getFullYear(),now.getMonth(),1);
      const end   = new Date(now.getFullYear(),now.getMonth()+1,0,23,59,59,999);
      const days  = end.getDate();
      return { start, end, days };
    } else if(mode==="year") {
      const start = new Date(now.getFullYear(),0,1);
      const end   = new Date(now.getFullYear(),11,31,23,59,59,999);
      const days  = Math.ceil((end-start)/(1000*60*60*24));
      return { start, end, days };
    } else {
      const start = new Date(customStart+"T00:00:00");
      const end   = new Date(customEnd+"T23:59:59");
      const days  = Math.max(1, Math.ceil((end-start)/(1000*60*60*24))+1);
      return { start, end, days };
    }
  },[mode,customStart,customEnd]);

  const { start, end, days } = getRange();

  const inRange = arr => arr.filter(it=>{ const d=toDate(it.date); return d>=start&&d<=end; });
  const filteredInc = inRange(incomes);
  const filteredExp = inRange(expenses);

  const grossIncome   = filteredInc.reduce((s,i)=>s+(i.amountUSD||0)+(i.amountKHR||0)/KHR_RATE,0);
  const dailyExpTotal = filteredInc.reduce((s,i)=>s+(i.dailyExpUSD||0),0);
  const regularExpTotal = filteredExp.reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0);

  // pro-rate recurring costs
  let recurringCost = 0;
  if(includeRec) {
    const monthlyTotal = recurring.filter(r=>r.freq==="monthly").reduce((s,r)=>s+(r.amountUSD||0)+(r.amountKHR||0)/KHR_RATE,0);
    const yearlyTotal  = recurring.filter(r=>r.freq==="yearly").reduce((s,r)=>s+(r.amountUSD||0)+(r.amountKHR||0)/KHR_RATE,0);
    const daysInMonth  = 30;
    const daysInYear   = 365;
    recurringCost = (monthlyTotal/daysInMonth + yearlyTotal/daysInYear) * days;
  }

  const totalExpAll = dailyExpTotal + regularExpTotal + recurringCost;
  const netProfit   = grossIncome - totalExpAll;
  const margin      = grossIncome > 0 ? (netProfit/grossIncome*100).toFixed(1) : "0.0";
  const avgPerDay   = days > 0 ? netProfit/days : 0;

  // bar chart: day by day breakdown
  useEffect(()=>{
    if(!chartRef.current || mode==="today") return;
    const dayCount = Math.min(days, 31);
    const labels = [];
    const incData = [];
    const expData = [];
    for(let i=0;i<dayCount;i++){
      const d = new Date(start); d.setDate(start.getDate()+i);
      if(d > end) break;
      const dayStart = new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0);
      const dayEnd   = new Date(d.getFullYear(),d.getMonth(),d.getDate(),23,59,59,999);
      labels.push(d.toLocaleDateString("default",{month:"short",day:"numeric"}));
      incData.push(incomes.filter(it=>{ const dt=toDate(it.date); return dt>=dayStart&&dt<=dayEnd; }).reduce((s,it)=>s+(it.amountUSD||0)+(it.amountKHR||0)/KHR_RATE,0));
      expData.push(expenses.filter(et=>{ const dt=toDate(et.date); return dt>=dayStart&&dt<=dayEnd; }).reduce((s,et)=>s+(et.amountUSD||0)+(et.amountKHR||0)/KHR_RATE,0));
    }
    const ctx=chartRef.current.getContext("2d");
    if(chartRef.current._ci) chartRef.current._ci.destroy();
    chartRef.current._ci=new Chart(ctx,{
      type:"line",
      data:{labels,datasets:[
        {label:t("income"),data:incData,borderColor:"#1F6B40",backgroundColor:"rgba(31,107,64,0.1)",fill:true,tension:0.4,pointRadius:3},
        {label:t("expense"),data:expData,borderColor:"#A8292F",backgroundColor:"rgba(168,41,47,0.1)",fill:true,tension:0.4,pointRadius:3}
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{color:"#5A4535",font:{family:"Sora",size:11},padding:12}}},scales:{x:{grid:{display:false},ticks:{color:"#9A8575",font:{size:9}}},y:{grid:{color:"#EAE4DA"},ticks:{color:"#9A8575",font:{size:10}}}}}
    });
    return ()=>{ if(chartRef.current?._ci) chartRef.current._ci.destroy(); };
  },[mode,filteredInc,filteredExp,days]);

  const modeLabel = {today:t("today"), month:t("thisMonth"), year:t("thisYear"), custom:t("custom")}[mode];

  return (
    <div>
      {/* Quick date selector */}
      <div className="card" style={{marginBottom:18}}>
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon"><Icon name="filter" size={13}/></div>{t("filterDate")}</div>
        </div>
        <div className="quick-date-row">
          {["today","month","year","custom"].map(m=>(
            <button key={m} className={`quick-date-btn ${mode===m?"active":""}`} onClick={()=>setMode(m)}>
              <Icon name={m==="today"?"sun":m==="month"?"calendar":m==="year"?"layers":"filter"} size={12}/>
              {t(m==="today"?"today":m==="month"?"thisMonth":m==="year"?"thisYear":"custom")}
            </button>
          ))}
        </div>
        {mode==="custom" && (
          <div className="form-grid" style={{maxWidth:460}}>
            <div className="form-group">
              <label className="form-label"><Icon name="calendar" size={11}/>{t("startDate")}</label>
              <input className="form-input" type="date" value={customStart} onChange={e=>setCustomStart(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label"><Icon name="calendar" size={11}/>{t("endDate")}</label>
              <input className="form-input" type="date" value={customEnd} onChange={e=>setCustomEnd(e.target.value)}/>
            </div>
          </div>
        )}
        <label className="toggle-switch" style={{marginTop:12}}>
          <input type="checkbox" checked={includeRec} onChange={e=>setIncludeRec(e.target.checked)}/>
          <span style={{fontSize:12.5,color:"var(--text2)",fontWeight:500,fontFamily:"'Noto Sans Khmer','Sora',sans-serif"}}>{t("includeRecurring")} (pro-rated for {days} day{days!==1?"s":""})</span>
        </label>
      </div>

      {/* Main result */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <div className={`calc-result-big ${netProfit>=0?"stat-card green":"stat-card red"}`}>
          <div className="calc-result-label"><Icon name="zap" size={13}/> {t("netProfit")} — {modeLabel}</div>
          <div className={`calc-result-value ${netProfit>=0?"":""}` } style={{color:netProfit>=0?"var(--green)":"var(--red)"}}>{fmt(netProfit)}</div>
          <div className="calc-result-sub"><Icon name="percent" size={11}/> Margin: {margin}% &nbsp;|&nbsp; <Icon name="clock" size={11}/> {t("perDay")}: {fmt(avgPerDay)}</div>
        </div>
        <div className="card" style={{display:"flex",flexDirection:"column",gap:0}}>
          <div className="calc-section-title"><Icon name="arrowUp" size={12} color="var(--green)"/>{t("grossIncome")}</div>
          <div className="calc-row" style={{background:"var(--green-dim)"}}>
            <div className="calc-row-label"><Icon name="income" size={14} color="var(--green)"/>{t("grossIncome")}</div>
            <div className="calc-row-value" style={{color:"var(--green)"}}>{fmt(grossIncome)}</div>
          </div>
          <div className="calc-section-title"><Icon name="arrowDown" size={12} color="var(--red)"/>Expenses</div>
          <div className="calc-row" style={{background:"rgba(13,148,136,0.07)"}}>
            <div className="calc-row-label"><Icon name="zap" size={14} color="var(--teal)"/>{t("totalDailyExp")}</div>
            <div className="calc-row-value" style={{color:"var(--teal)"}}>{fmt(dailyExpTotal)}</div>
          </div>
          <div className="calc-row" style={{background:"var(--red-dim)"}}>
            <div className="calc-row-label"><Icon name="expense" size={14} color="var(--red)"/>Regular Expenses</div>
            <div className="calc-row-value" style={{color:"var(--red)"}}>{fmt(regularExpTotal)}</div>
          </div>
          {includeRec && (
            <div className="calc-row" style={{background:"rgba(92,51,23,0.06)"}}>
              <div className="calc-row-label"><Icon name="recurring" size={14} color="var(--accent)"/>{t("totalRecurring")} ({days}d)</div>
              <div className="calc-row-value" style={{color:"var(--accent)"}}>{fmt(recurringCost)}</div>
            </div>
          )}
          <div style={{borderTop:"2px solid var(--border)",marginTop:6,paddingTop:10}}>
            <div className="calc-row" style={{background:netProfit>=0?"var(--green-dim)":"var(--red-dim)"}}>
              <div className="calc-row-label" style={{fontWeight:700}}><Icon name="dollar" size={14} color={netProfit>=0?"var(--green)":"var(--red)"}/>{t("netProfit")}</div>
              <div className="calc-row-value" style={{color:netProfit>=0?"var(--green)":"var(--red)",fontSize:18}}>{fmt(netProfit)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Period chart */}
      {mode!=="today" && (
        <div className="card" style={{marginBottom:18}}>
          <div className="card-header">
            <div className="card-title"><div className="card-title-icon"><Icon name="trending" size={13}/></div>Income vs Expense Trend ({modeLabel})</div>
          </div>
          <div className="chart-box" style={{height:220}}><canvas ref={chartRef}/></div>
        </div>
      )}

      {/* Record breakdown */}
      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{color:"var(--green)"}}>
              <div className="card-title-icon" style={{background:"var(--green-dim)",color:"var(--green)"}}><Icon name="income" size={13}/></div>
              {t("incomeList")}
            </div>
            <span style={{fontSize:11,color:"var(--text4)",background:"var(--surface2)",padding:"2px 9px",borderRadius:20}}>{filteredInc.length}</span>
          </div>
          <div className="tbl-wrap" style={{maxHeight:300}}>
            <table>
              <thead><tr>
                <th><Icon name="calendar" size={10}/> {t("date")}</th>
                <th><Icon name="tag" size={10}/> {t("source")}</th>
                <th><Icon name="dollar" size={10}/> Income</th>
                <th><Icon name="zap" size={10}/> Daily Exp</th>
              </tr></thead>
              <tbody>
                {filteredInc.length===0
                  ? <tr><td colSpan={4}><div className="empty-state"><p>{t("noRecords")}</p></div></td></tr>
                  : filteredInc.map(i=>(
                    <tr key={i.id}>
                      <td style={{fontSize:11,color:"var(--text3)"}}>{toDate(i.date).toLocaleDateString()}</td>
                      <td style={{fontWeight:500}}>{i.source||"-"}</td>
                      <td className="amt-pos">{fmt((i.amountUSD||0)+(i.amountKHR||0)/KHR_RATE)}</td>
                      <td className="amt-teal">{i.dailyExpUSD?fmt(i.dailyExpUSD):"-"}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{color:"var(--red)"}}>
              <div className="card-title-icon" style={{background:"var(--red-dim)",color:"var(--red)"}}><Icon name="expense" size={13}/></div>
              {t("expenseList")}
            </div>
            <span style={{fontSize:11,color:"var(--text4)",background:"var(--surface2)",padding:"2px 9px",borderRadius:20}}>{filteredExp.length}</span>
          </div>
          <div className="tbl-wrap" style={{maxHeight:300}}>
            <table>
              <thead><tr>
                <th><Icon name="calendar" size={10}/> {t("date")}</th>
                <th><Icon name="info" size={10}/> {t("description")}</th>
                <th><Icon name="tag" size={10}/> Type</th>
                <th><Icon name="dollar" size={10}/> Amount</th>
              </tr></thead>
              <tbody>
                {filteredExp.length===0
                  ? <tr><td colSpan={4}><div className="empty-state"><p>{t("noRecords")}</p></div></td></tr>
                  : filteredExp.map(e=>(
                    <tr key={e.id}>
                      <td style={{fontSize:11,color:"var(--text3)"}}>{toDate(e.date).toLocaleDateString()}</td>
                      <td style={{fontWeight:500,maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.category||e.description||"-"}</td>
                      <td><span className={`badge ${e.expenseType==="shop"?"badge-shop":e.expenseType==="owner"?"badge-owner":"badge-daily"}`}>{e.expenseType||"daily"}</span></td>
                      <td className="amt-neg">{fmt((e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DAILY SUMMARY PAGE
───────────────────────────────────────────── */
function SummaryList({ incomes, expenses, t }) {
  const dayKey = it => toDate(it.date).toISOString().slice(0,10);
  const [expanded, setExpanded] = useState({});

  const days = Array.from(new Set([
    ...incomes.map(dayKey),
    ...expenses.map(dayKey)
  ])).sort((a,b)=>b.localeCompare(a));

  return (
    <div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon"><Icon name="list" size={13}/></div>{t("list")}</div>
          <span style={{fontSize:11,color:"var(--text4)",background:"var(--surface2)",padding:"2px 9px",borderRadius:20}}>{days.length} days</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr>
              <th><Icon name="calendar" size={10}/> Date</th>
              <th><Icon name="income" size={10}/> Income</th>
              <th><Icon name="dollar" size={10}/> Cash</th>
              <th><Icon name="layers" size={10}/> Bank</th>
              <th><Icon name="zap" size={10}/> App</th>
              <th><Icon name="zap" size={10}/> Daily Exp</th>
              <th><Icon name="expense" size={10}/> Reg Exp</th>
              <th><Icon name="dollar" size={10}/> P/L</th>
            </tr></thead>
            <tbody>
              {days.length===0
                ? <tr><td colSpan={8}><div className="empty-state"><p>{t("noRecords")}</p></div></td></tr>
                : days.map(day=>{
                  const inc = incomes.filter(i=>dayKey(i)===day);
                  const exp = expenses.filter(e=>dayKey(e)===day);
                  const totalInc   = inc.reduce((s,i)=>s+(i.amountUSD||0)+(i.amountKHR||0)/KHR_RATE,0);
                  const cashTotal  = inc.reduce((s,i)=>s+(i.cashUSD||0),0);
                  const bankTotal  = inc.reduce((s,i)=>s+(i.bankUSD||0),0);
                  const appTotal   = inc.reduce((s,i)=>s+(i.appUSD||0),0);
                  const dailyExpT  = inc.reduce((s,i)=>s+(i.dailyExpUSD||0),0);
                  const totalExp   = exp.reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0);
                  const profit     = totalInc-totalExp-dailyExpT;
                  return (
                    <tr key={day}>
                      <td style={{fontWeight:700,color:"var(--brown-mid)"}}>{day}</td>
                      <td className="amt-pos">{fmt(totalInc)}</td>
                      <td className="amt-pos">{cashTotal>0?fmt(cashTotal):"-"}</td>
                      <td className="amt-blue">{bankTotal>0?fmt(bankTotal):"-"}</td>
                      <td style={{color:"var(--accent)",fontWeight:600}}>{appTotal>0?fmt(appTotal):"-"}</td>
                      <td className="amt-teal">{dailyExpT>0?fmt(dailyExpT):"-"}</td>
                      <td className="amt-neg">{totalExp>0?fmt(totalExp):"-"}</td>
                      <td className={profit>=0?"amt-pos":"amt-neg"}>{fmt(profit)}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>

      <div>
        {days.map(day=>{
          const inc = incomes.filter(i=>dayKey(i)===day);
          const exp = expenses.filter(e=>dayKey(e)===day);
          const totalInc   = inc.reduce((s,i)=>s+(i.amountUSD||0)+(i.amountKHR||0)/KHR_RATE,0);
          const cashTotal  = inc.reduce((s,i)=>s+(i.cashUSD||0),0);
          const bankTotal  = inc.reduce((s,i)=>s+(i.bankUSD||0),0);
          const appTotal   = inc.reduce((s,i)=>s+(i.appUSD||0),0);
          const totalKHR   = inc.reduce((s,i)=>s+(i.amountKHR||0),0);
          const dailyExpT  = inc.reduce((s,i)=>s+(i.dailyExpUSD||0),0);
          const totalExp   = exp.reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0);
          const shopExp    = exp.filter(e=>e.expenseType==="shop"||(!e.expenseType&&e.ownerType==="Owner")).reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0);
          const ownerExp   = exp.filter(e=>e.expenseType==="owner").reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0);
          const profit     = totalInc-totalExp-dailyExpT;
          const isOpen     = expanded[day];

          return (
            <div key={day} className="day-block">
              <div className="day-block-header" onClick={()=>setExpanded(p=>({...p,[day]:!p[day]}))}>
                <div className="day-block-date"><Icon name="calendar" size={14}/> {day}</div>
                <div className="day-chips">
                  <span className="badge badge-cash"><Icon name="dollar" size={10}/> {fmt(cashTotal)}</span>
                  <span className="badge badge-bank"><Icon name="layers" size={10}/> {fmt(bankTotal)}</span>
                  {appTotal>0 && <span className="badge badge-app"><Icon name="zap" size={10}/> {fmt(appTotal)}</span>}
                  {dailyExpT>0 && <span className="badge badge-daily"><Icon name="arrowDown" size={10}/> {fmt(dailyExpT)}</span>}
                  <span className="badge badge-morning"><Icon name="income" size={10}/> {fmt(totalInc)}</span>
                  <span className="badge badge-staff"><Icon name="expense" size={10}/> {fmt(totalExp)}</span>
                  <span className={`badge ${profit>=0?"badge-owner":"badge-staff"}`}>{profit>=0?<Icon name="check" size={10}/>:<Icon name="x" size={10}/>} {fmt(profit)}</span>
                  <span style={{fontSize:18,color:"var(--text4)",marginLeft:4}}>{isOpen?"▲":"▼"}</span>
                </div>
              </div>

              {isOpen && (
                <div className="day-block-body">
                  <div className="day-income-row">
                    <div className="day-income-cell">
                      <div className="day-income-cell-label"><Icon name="income" size={10}/> Total Income</div>
                      <div className="day-income-cell-val green">{fmt(totalInc)}</div>
                      {totalKHR>0 && <div style={{fontSize:11,color:"var(--text4)",marginTop:2}}>{fmtK(totalKHR)}</div>}
                    </div>
                    <div className="day-income-cell">
                      <div className="day-income-cell-label"><Icon name="dollar" size={10}/> Cash</div>
                      <div className="day-income-cell-val green">{fmt(cashTotal)}</div>
                    </div>
                    <div className="day-income-cell">
                      <div className="day-income-cell-label"><Icon name="layers" size={10}/> Bank</div>
                      <div className="day-income-cell-val blue">{fmt(bankTotal)}</div>
                    </div>
                    <div className="day-income-cell">
                      <div className="day-income-cell-label"><Icon name="zap" size={10}/> App</div>
                      <div className="day-income-cell-val accent">{fmt(appTotal)}</div>
                    </div>
                    <div className="day-income-cell">
                      <div className="day-income-cell-label"><Icon name="arrowDown" size={10}/> Daily Exp</div>
                      <div className="day-income-cell-val teal">{fmt(dailyExpT)}</div>
                    </div>
                    <div className="day-income-cell">
                      <div className="day-income-cell-label"><Icon name="expense" size={10}/> Reg Expenses</div>
                      <div className="day-income-cell-val red">{fmt(totalExp)}</div>
                    </div>
                    <div className="day-income-cell">
                      <div className="day-income-cell-label">{profit>=0?<Icon name="check" size={10}/>:<Icon name="x" size={10}/>} Profit</div>
                      <div className={`day-income-cell-val ${profit>=0?"green":"red"}`}>{fmt(profit)}</div>
                    </div>
                  </div>

                  {inc.length>0 && (
                    <div style={{marginBottom:14}}>
                      <div className="day-exp-title"><Icon name="income" size={11}/> Income Records ({inc.length})</div>
                      {inc.map(i=>(
                        <div key={i.id} className="day-exp-item">
                          <span style={{color:"var(--text2)",flex:1}}>{i.source||"-"}</span>
                          {i.dailyExpUSD>0 && <span className="amt-teal" style={{fontSize:11,margin:"0 8px"}}>-{fmt(i.dailyExpUSD)} daily</span>}
                          <span style={{fontSize:11,color:"var(--text4)",margin:"0 10px"}}>{toDate(i.date).toLocaleTimeString()}</span>
                          <span className="amt-pos">{fmt((i.amountUSD||0)+(i.amountKHR||0)/KHR_RATE)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {exp.length>0 && (
                    <div className="day-exp-row">
                      <div className="day-exp-title"><Icon name="expense" size={11}/> Expenses ({exp.length})</div>
                      {shopExp>0 && (
                        <div style={{marginBottom:8}}>
                          <div style={{fontSize:11,color:"var(--blue)",fontWeight:700,marginBottom:4,display:"flex",alignItems:"center",gap:5}}><Icon name="layers" size={12}/>Shop: {fmt(shopExp)}</div>
                          {exp.filter(e=>e.expenseType==="shop"||(!e.expenseType&&e.ownerType==="Owner")).map(e=>(
                            <div key={e.id} className="day-exp-item">
                              <span style={{flex:1,color:"var(--text2)"}}>{e.description||e.category||"-"}</span>
                              <span className="amt-neg">{fmt((e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {ownerExp>0 && (
                        <div style={{marginBottom:8}}>
                          <div style={{fontSize:11,color:"var(--green)",fontWeight:700,marginBottom:4,display:"flex",alignItems:"center",gap:5}}><Icon name="user" size={12}/>Owner: {fmt(ownerExp)}</div>
                          {exp.filter(e=>e.expenseType==="owner").map(e=>(
                            <div key={e.id} className="day-exp-item">
                              <span style={{flex:1,color:"var(--text2)"}}>{e.description||e.category||"-"}</span>
                              <span className="amt-neg">{fmt((e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REPORTS PAGE
───────────────────────────────────────────── */
function ReportsPage({ incomes, expenses, t }) {
  const [mode,setMode]   = useState("monthly");
  const [year,setYear]   = useState(new Date().getFullYear());
  const [month,setMonth] = useState(new Date().getMonth()+1);

  const filterRange = useCallback(()=>{
    const start = mode==="monthly" ? new Date(year,month-1,1) : new Date(year,0,1);
    const end   = mode==="monthly" ? new Date(year,month,0,23,59,59,999) : new Date(year,11,31,23,59,59,999);
    const inRange = arr => arr.filter(it=>{ const d=toDate(it.date); return d>=start&&d<=end; });
    return { inc:inRange(incomes), exp:inRange(expenses) };
  },[mode,year,month,incomes,expenses]);

  const {inc,exp} = filterRange();
  const totalInc   = inc.reduce((s,i)=>s+(i.amountUSD||0)+(i.amountKHR||0)/KHR_RATE,0);
  const totalExp   = exp.reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0);
  const dailyExpT  = inc.reduce((s,i)=>s+(i.dailyExpUSD||0),0);
  const profit     = totalInc-totalExp-dailyExpT;
  const cashT      = inc.reduce((s,i)=>s+(i.cashUSD||0),0);
  const bankT      = inc.reduce((s,i)=>s+(i.bankUSD||0),0);
  const appT       = inc.reduce((s,i)=>s+(i.appUSD||0),0);
  const shopExpT   = exp.filter(e=>e.expenseType==="shop"||(!e.expenseType&&e.ownerType==="Owner")).reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0);
  const ownerExpT  = exp.filter(e=>e.expenseType==="owner").reduce((s,e)=>s+(e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE,0);

  return (
    <div>
      <div className="filter-bar">
        <span className="filter-label"><Icon name="filter" size={12}/>{t("filter")}</span>
        <div className="filter-sep"/>
        <select className="form-select" style={{width:130,padding:"6px 10px"}} value={mode} onChange={e=>setMode(e.target.value)}>
          <option value="monthly">{t("monthly")}</option>
          <option value="yearly">{t("yearly")}</option>
        </select>
        <input className="form-input" style={{width:88,padding:"6px 10px"}} type="number" value={year} onChange={e=>setYear(+e.target.value||year)} />
        {mode==="monthly" && (
          <input className="form-input" style={{width:68,padding:"6px 10px"}} type="number" min="1" max="12" value={month} onChange={e=>setMonth(+e.target.value||1)} />
        )}
      </div>

      <div className="stat-grid" style={{marginBottom:18}}>
        <div className="stat-card green">
          <div className="stat-row">
            <div><div className="stat-label">{t("totalIncome")}</div><div className="stat-value green">{fmt(totalInc)}</div></div>
            <div className="stat-icon-wrap green"><Icon name="income" size={19}/></div>
          </div>
          <div className="breakdown-strip">
            <span className="breakdown-pill cash"><span className="dot green"></span>Cash {fmt(cashT)}</span>
            <span className="breakdown-pill bank"><span className="dot blue"></span>Bank {fmt(bankT)}</span>
            {appT>0 && <span className="breakdown-pill app"><span className="dot accent"></span>App {fmt(appT)}</span>}
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-row">
            <div><div className="stat-label">{t("totalExpense")}</div><div className="stat-value red">{fmt(totalExp+dailyExpT)}</div><div className="stat-sub">Daily: {fmt(dailyExpT)}</div></div>
            <div className="stat-icon-wrap red"><Icon name="expense" size={19}/></div>
          </div>
          <div className="breakdown-strip">
            <span className="breakdown-pill"><span className="dot blue"></span>Shop {fmt(shopExpT)}</span>
            <span className="breakdown-pill"><span className="dot green"></span>Owner {fmt(ownerExpT)}</span>
          </div>
        </div>
        <div className={`stat-card ${profit>=0?"green":"red"}`}>
          <div className="stat-row">
            <div><div className="stat-label">{t("profit")}</div><div className={`stat-value ${profit>=0?"green":"red"}`}>{fmt(profit)}</div></div>
            <div className={`stat-icon-wrap ${profit>=0?"green":"red"}`}><Icon name="dollar" size={19}/></div>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{color:"var(--green)"}}>
              <div className="card-title-icon" style={{background:"var(--green-dim)",color:"var(--green)"}}><Icon name="income" size={13}/></div>
              {t("incomeList")}
            </div>
            <span style={{fontSize:11,color:"var(--text4)",background:"var(--surface2)",padding:"2px 9px",borderRadius:20}}>{inc.length}</span>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr>
                <th><Icon name="calendar" size={10}/> {t("date")}</th>
                <th><Icon name="tag" size={10}/> {t("source")}</th>
                <th><Icon name="dollar" size={10}/> Cash</th>
                <th><Icon name="layers" size={10}/> Bank</th>
                <th><Icon name="zap" size={10}/> App</th>
                <th><Icon name="arrowDown" size={10}/> DailyExp</th>
                <th><Icon name="dollar" size={10}/> Total</th>
              </tr></thead>
              <tbody>
                {inc.length===0
                  ? <tr><td colSpan={7}><div className="empty-state"><p>{t("noRecords")}</p></div></td></tr>
                  : inc.map(i=>(
                    <tr key={i.id}>
                      <td style={{fontSize:11,color:"var(--text3)"}}>{toDate(i.date).toLocaleDateString()}</td>
                      <td style={{fontWeight:500}}>{i.source}</td>
                      <td>{i.cashUSD?fmt(i.cashUSD):"-"}</td>
                      <td>{i.bankUSD?fmt(i.bankUSD):"-"}</td>
                      <td>{i.appUSD?fmt(i.appUSD):"-"}</td>
                      <td className="amt-teal">{i.dailyExpUSD?fmt(i.dailyExpUSD):"-"}</td>
                      <td className="amt-pos">{fmt((i.amountUSD||0)+(i.amountKHR||0)/KHR_RATE)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{color:"var(--red)"}}>
              <div className="card-title-icon" style={{background:"var(--red-dim)",color:"var(--red)"}}><Icon name="expense" size={13}/></div>
              {t("expenseList")}
            </div>
            <span style={{fontSize:11,color:"var(--text4)",background:"var(--surface2)",padding:"2px 9px",borderRadius:20}}>{exp.length}</span>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr>
                <th><Icon name="calendar" size={10}/> {t("date")}</th>
                <th><Icon name="info" size={10}/> {t("category")}</th>
                <th><Icon name="tag" size={10}/> Type</th>
                <th><Icon name="user" size={10}/> {t("ownerType")}</th>
                <th><Icon name="dollar" size={10}/> Amount</th>
              </tr></thead>
              <tbody>
                {exp.length===0
                  ? <tr><td colSpan={5}><div className="empty-state"><p>{t("noRecords")}</p></div></td></tr>
                  : exp.map(e=>(
                    <tr key={e.id}>
                      <td style={{fontSize:11,color:"var(--text3)"}}>{toDate(e.date).toLocaleDateString()}</td>
                      <td style={{fontWeight:500}}>{e.category||e.description||"-"}</td>
                      <td><span className={`badge ${e.expenseType==="shop"?"badge-shop":e.expenseType==="owner"?"badge-owner":"badge-daily"}`}>{e.expenseType||"daily"}</span></td>
                      <td style={{fontSize:12}}>{e.ownerType}{e.staffName?` · ${e.staffName}`:""}</td>
                      <td className="amt-neg">{fmt((e.amountUSD||0)+(e.amountKHR||0)/KHR_RATE)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RECURRING PAGE
───────────────────────────────────────────── */
function RecurringPage({ recurring, onAdd, onDelete, onUpdate, t }) {
  const [f,setF]     = useState({name:"",amountUSD:"",amountKHR:"",freq:"monthly"});
  const [msg,setMsg] = useState(null);
  const [editRec,setEditRec] = useState(null);
  const [selected,setSelected] = useState(new Set());
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  async function submit(e){
    e.preventDefault();
    if(!f.name.trim()){ setMsg({text:t("errorName"),type:"error"}); return; }
    await onAdd({ name:f.name.trim(), amountUSD:parseFloat(f.amountUSD)||0, amountKHR:parseFloat(f.amountKHR)||0, freq:f.freq });
    setF({name:"",amountUSD:"",amountKHR:"",freq:"monthly"});
    setMsg({text:t("successAdded"),type:"success"});
  }

  const totalMonthly = recurring.filter(r=>r.freq==="monthly").reduce((s,r)=>s+(r.amountUSD||0)+(r.amountKHR||0)/KHR_RATE,0);
  const totalYearly  = recurring.filter(r=>r.freq==="yearly").reduce((s,r)=>s+(r.amountUSD||0)+(r.amountKHR||0)/KHR_RATE,0);

  const toggleSelect = (id) => setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleAll    = () => setSelected(selected.size===recurring.length ? new Set() : new Set(recurring.map(r=>r.id)));

  async function deleteSelected(){
    if(!window.confirm(`Delete ${selected.size} records?`)) return;
    for(const id of selected) await onDelete(id,true);
    setSelected(new Set());
  }

  return (
    <div>
      <div className="two-col section-gap">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-icon"><Icon name="plus" size={13}/></div>{t("addRecurring")}</div>
          </div>
          {msg && <div className={`alert alert-${msg.type}`}><Icon name={msg.type==="success"?"check":"alert"} size={14}/>{msg.text}</div>}
          <form onSubmit={submit}>
            <div className="form-group" style={{marginBottom:14}}>
              <label className="form-label"><Icon name="tag" size={11}/>{t("recurringName")}</label>
              <input className="form-input" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Salary, Electricity, Rent…" />
            </div>
            <div className="form-grid" style={{marginBottom:14}}>
              <div className="form-group"><label className="form-label"><Icon name="dollar" size={11}/>{t("amountUSD")}</label><input className="form-input" type="number" step="0.01" min="0" value={f.amountUSD} onChange={e=>set("amountUSD",e.target.value)} placeholder="0.00" /></div>
              <div className="form-group"><label className="form-label"><Icon name="dollar" size={11}/>{t("amountKHR")}</label><input className="form-input" type="number" step="1" min="0" value={f.amountKHR} onChange={e=>set("amountKHR",e.target.value)} placeholder="0" /></div>
            </div>
            <div className="form-group" style={{marginBottom:18}}>
              <label className="form-label"><Icon name="recurring" size={11}/>{t("frequency")}</label>
              <select className="form-select" value={f.freq} onChange={e=>set("freq",e.target.value)}>
                <option value="monthly">{t("monthly")}</option>
                <option value="yearly">{t("yearly")}</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary"><Icon name="save" size={14}/>{t("save")}</button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-icon"><Icon name="reports" size={13}/></div>{t("summary")}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="stat-card red" style={{padding:"16px 18px"}}>
              <div className="stat-label"><Icon name="calendar" size={11}/> {t("monthly")} Recurring</div>
              <div className="stat-value red" style={{fontSize:22}}>{fmt(totalMonthly)}</div>
              <div className="stat-sub">{recurring.filter(r=>r.freq==="monthly").length} items</div>
            </div>
            <div className="stat-card red" style={{padding:"16px 18px"}}>
              <div className="stat-label"><Icon name="layers" size={11}/> {t("yearly")} Recurring</div>
              <div className="stat-value red" style={{fontSize:22}}>{fmt(totalYearly)}</div>
              <div className="stat-sub">{recurring.filter(r=>r.freq==="yearly").length} items</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon"><Icon name="recurring" size={13}/></div>Recurring Expenses</div>
          <span style={{fontSize:11,color:"var(--text4)",background:"var(--surface2)",padding:"2px 9px",borderRadius:20}}>{recurring.length}</span>
        </div>
        {selected.size > 0 && (
          <div className="select-toolbar">
            <span className="select-toolbar-text">{selected.size} {t("selected")}</span>
            <button className="btn btn-del-sel" onClick={deleteSelected}><Icon name="trash" size={13}/> {t("deleteSelected")}</button>
            <button className="btn btn-ghost" style={{padding:"6px 12px",fontSize:12}} onClick={()=>setSelected(new Set())}><Icon name="x" size={12}/>Clear</button>
          </div>
        )}
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th className="cb-col"><input type="checkbox" className="cb" checked={selected.size===recurring.length&&recurring.length>0} onChange={toggleAll}/></th>
              <th><Icon name="tag" size={10}/> Name</th>
              <th><Icon name="dollar" size={10}/> USD</th>
              <th><Icon name="dollar" size={10}/> KHR</th>
              <th><Icon name="dollar" size={10}/> Total</th>
              <th><Icon name="recurring" size={10}/> {t("frequency")}</th>
              <th><Icon name="edit" size={10}/></th>
            </tr></thead>
            <tbody>
              {recurring.length===0
                ? <tr><td colSpan={7}><div className="empty-state"><p>{t("noRecords")}</p></div></td></tr>
                : recurring.map(r=>(
                  <tr key={r.id} className={selected.has(r.id)?"selected-row":""}>
                    <td style={{textAlign:"center"}}><input type="checkbox" className="cb" checked={selected.has(r.id)} onChange={()=>toggleSelect(r.id)}/></td>
                    <td style={{fontWeight:600}}>{r.name}</td>
                    <td className="amt-neu">{fmt(r.amountUSD||0)}</td>
                    <td style={{fontSize:11,color:"var(--text3)"}}>{fmtK(r.amountKHR||0)}</td>
                    <td className="amt-neg">{fmt((r.amountUSD||0)+(r.amountKHR||0)/KHR_RATE)}</td>
                    <td><span className={`badge badge-${r.freq}`}>{r.freq}</span></td>
                    <td>
                      <div style={{display:"flex",gap:5}}>
                        <button className="btn btn-edit" onClick={()=>setEditRec(r)}><Icon name="edit" size={12}/></button>
                        <button className="btn btn-danger" onClick={()=>onDelete(r.id)}><Icon name="trash" size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {editRec && (
        <EditModal title="Edit Recurring" onClose={()=>setEditRec(null)} onSave={async()=>{ await onUpdate(editRec.id,{name:editRec.name,amountUSD:parseFloat(editRec.amountUSD)||0,amountKHR:parseFloat(editRec.amountKHR)||0,freq:editRec.freq}); setEditRec(null); }} loading={false}>
          <div className="form-group" style={{marginBottom:12}}><label className="form-label"><Icon name="tag" size={11}/>Name</label><input className="form-input" value={editRec.name} onChange={e=>setEditRec(p=>({...p,name:e.target.value}))}/></div>
          <div className="form-grid" style={{marginBottom:12}}>
            <div className="form-group"><label className="form-label"><Icon name="dollar" size={11}/>USD</label><input className="form-input" type="number" step="0.01" value={editRec.amountUSD||""} onChange={e=>setEditRec(p=>({...p,amountUSD:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label"><Icon name="dollar" size={11}/>KHR</label><input className="form-input" type="number" value={editRec.amountKHR||""} onChange={e=>setEditRec(p=>({...p,amountKHR:e.target.value}))}/></div>
          </div>
          <div className="form-group"><label className="form-label"><Icon name="recurring" size={11}/>Frequency</label>
            <select className="form-select" value={editRec.freq} onChange={e=>setEditRec(p=>({...p,freq:e.target.value}))}>
              <option value="monthly">Monthly</option><option value="yearly">Yearly</option>
            </select>
          </div>
        </EditModal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAFF PAGE
───────────────────────────────────────────── */
function StaffPage({ staffList, onAddStaff, onDeleteStaff, onUpdateStaff, t }) {
  const [name,setName]   = useState("");
  const [shift,setShift] = useState("Morning");
  const [msg,setMsg]     = useState(null);
  const [editRec,setEditRec] = useState(null);
  const [selected,setSelected] = useState(new Set());

  async function submit(e){
    e.preventDefault();
    if(!name.trim()){ setMsg({text:t("errorName"),type:"error"}); return; }
    await onAddStaff({name:name.trim(),shift});
    setName(""); setShift("Morning");
    setMsg({text:t("successAdded"),type:"success"});
  }

  const toggleSelect = (id) => setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleAll    = () => setSelected(selected.size===staffList.length ? new Set() : new Set(staffList.map(s=>s.id)));
  async function deleteSelected(){
    if(!window.confirm(`Delete ${selected.size} staff?`)) return;
    for(const id of selected) await onDeleteStaff(id,true);
    setSelected(new Set());
  }

  return (
    <div className="two-col">
      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon"><Icon name="plus" size={13}/></div>{t("addStaff")}</div>
        </div>
        {msg && <div className={`alert alert-${msg.type}`}><Icon name={msg.type==="success"?"check":"alert"} size={14}/>{msg.text}</div>}
        <form onSubmit={submit}>
          <div className="form-group" style={{marginBottom:14}}>
            <label className="form-label"><Icon name="user" size={11}/>Full Name</label>
            <input className="form-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Staff full name" />
          </div>
          <div className="form-group" style={{marginBottom:18}}>
            <label className="form-label"><Icon name="clock" size={11}/>{t("shift")}</label>
            <select className="form-select" value={shift} onChange={e=>setShift(e.target.value)}>
              <option value="Morning">{t("morning")}</option>
              <option value="Afternoon">{t("afternoon")}</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary"><Icon name="save" size={14}/>{t("save")}</button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon"><Icon name="staff" size={13}/></div>Staff List</div>
          <span style={{fontSize:11,color:"var(--text4)",background:"var(--surface2)",padding:"2px 9px",borderRadius:20}}>{staffList.length}</span>
        </div>
        {selected.size > 0 && (
          <div className="select-toolbar">
            <span className="select-toolbar-text">{selected.size} {t("selected")}</span>
            <button className="btn btn-del-sel" onClick={deleteSelected}><Icon name="trash" size={13}/> {t("deleteSelected")}</button>
            <button className="btn btn-ghost" style={{padding:"6px 12px",fontSize:12}} onClick={()=>setSelected(new Set())}><Icon name="x" size={12}/>Clear</button>
          </div>
        )}
        {staffList.length===0
          ? <div className="empty-state"><div className="empty-state-icon"><Icon name="staff" size={19}/></div><p>{t("noRecords")}</p></div>
          : (
            <div className="tbl-wrap">
              <table>
                <thead><tr>
                  <th className="cb-col"><input type="checkbox" className="cb" checked={selected.size===staffList.length&&staffList.length>0} onChange={toggleAll}/></th>
                  <th><Icon name="user" size={10}/> Name</th>
                  <th><Icon name="clock" size={10}/> {t("shift")}</th>
                  <th><Icon name="edit" size={10}/></th>
                </tr></thead>
                <tbody>
                  {staffList.map(s=>(
                    <tr key={s.id} className={selected.has(s.id)?"selected-row":""}>
                      <td style={{textAlign:"center"}}><input type="checkbox" className="cb" checked={selected.has(s.id)} onChange={()=>toggleSelect(s.id)}/></td>
                      <td style={{fontWeight:500}}>{s.name}</td>
                      <td><span className={`badge badge-${s.shift==="Morning"?"morning":"afternoon"}`}>{s.shift==="Morning"?<><Icon name="sun" size={10}/> {t("morning")}</>:<><Icon name="moon" size={10}/> {t("afternoon")}</>}</span></td>
                      <td>
                        <div style={{display:"flex",gap:5}}>
                          <button className="btn btn-edit" onClick={()=>setEditRec(s)}><Icon name="edit" size={12}/></button>
                          <button className="btn btn-danger" onClick={()=>onDeleteStaff(s.id)}><Icon name="trash" size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {editRec && (
        <EditModal title="Edit Staff" onClose={()=>setEditRec(null)} onSave={async()=>{ await onUpdateStaff(editRec.id,{name:editRec.name,shift:editRec.shift}); setEditRec(null); }} loading={false}>
          <div className="form-group" style={{marginBottom:12}}><label className="form-label"><Icon name="user" size={11}/>Name</label><input className="form-input" value={editRec.name} onChange={e=>setEditRec(p=>({...p,name:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label"><Icon name="clock" size={11}/>Shift</label>
            <select className="form-select" value={editRec.shift} onChange={e=>setEditRec(p=>({...p,shift:e.target.value}))}>
              <option value="Morning">Morning</option><option value="Afternoon">Afternoon</option>
            </select>
          </div>
        </EditModal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const { lang, setLang, t } = useDict();
  const [user, setUser]               = useState(null);
  const [page, setPage]               = useState("dashboard");
  const [incomes, setIncomes]         = useState([]);
  const [expenses, setExpenses]       = useState([]);
  const [staffList, setStaffList]     = useState([]);
  const [recurring, setRecurring]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (message, type="success") => setToast({message,type});

  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(u=>{ setUser(u); if(!u) setLoading(false); });
    return ()=>unsub();
  },[]);

  useEffect(()=>{
    if(!user){ setIncomes([]); setExpenses([]); setStaffList([]); setRecurring([]); return; }
    setLoading(true);
    let loaded=0; const check=()=>{ if(++loaded>=2) setLoading(false); };
    const u1 = db.collection("income").orderBy("date","desc").onSnapshot(s=>{ setIncomes(s.docs.map(d=>({id:d.id,...d.data()}))); check(); }, e=>{ console.error(e); check(); });
    const u2 = db.collection("expense").orderBy("date","desc").onSnapshot(s=>{ setExpenses(s.docs.map(d=>({id:d.id,...d.data()}))); check(); }, e=>{ console.error(e); check(); });
    const u3 = db.collection("staff").orderBy("name","asc").onSnapshot(s=>{ setStaffList(s.docs.map(d=>({id:d.id,...d.data()}))); }, e=>console.error(e));
    const u4 = db.collection("recurring").orderBy("name","asc").onSnapshot(s=>{ setRecurring(s.docs.map(d=>({id:d.id,...d.data()}))); }, e=>console.error(e));
    return ()=>{ u1(); u2(); u3(); u4(); };
  },[user]);

  async function handleAdd(col, payload) {
    const doc = { ...payload, createdBy:user?.email||null };
    const ref = await db.collection(col).add(doc);
    const text = col==="income"
      ? `💰 Income: $${payload.amountUSD||0} | Cash:$${payload.cashUSD||0} Bank:$${payload.bankUSD||0} App:$${payload.appUSD||0} DailyExp:$${payload.dailyExpUSD||0}\n${payload.source||""}`
      : `💸 Expense: $${payload.amountUSD||0} | ${payload.description||""} | Type:${payload.expenseType||"?"} | ${payload.ownerType||""}${payload.staffName?` (${payload.staffName})`:""}`;
    await sendTelegram(text);
    showToast(t("successAdded"));
    return ref;
  }

  async function handleDelete(col, id, silent=false) {
    if(!silent && !window.confirm(t("confirmDelete"))) return;
    try { await db.collection(col).doc(id).delete(); if(!silent) showToast(t("deleted")); }
    catch(e){ showToast(e.message,"error"); }
  }

  async function handleUpdate(col, id, data) {
    try { await db.collection(col).doc(id).update(data); showToast(t("successUpdated")); }
    catch(e){ showToast(e.message,"error"); }
  }

  async function addStaff(p)          { await db.collection("staff").add(p); showToast(t("successAdded")); }
  async function deleteStaff(id,s)    { if(!s&&!window.confirm(t("confirmDelete"))) return; await db.collection("staff").doc(id).delete(); if(!s) showToast(t("deleted")); }
  async function updateStaff(id,d)    { await db.collection("staff").doc(id).update(d); showToast(t("successUpdated")); }
  async function addRecurring(p)      { await db.collection("recurring").add(p); showToast(t("successAdded")); }
  async function deleteRecurring(id,s){ if(!s&&!window.confirm(t("confirmDelete"))) return; await db.collection("recurring").doc(id).delete(); if(!s) showToast(t("deleted")); }
  async function updateRecurring(id,d){ await db.collection("recurring").doc(id).update(d); showToast(t("successUpdated")); }

  async function handleLogout(){ await auth.signOut(); setUser(null); setPage("dashboard"); showToast(t("logout")); }

  if(!user) return (
    <><GlobalStyle /><Auth onUser={u=>setUser(u)} t={k=>DICT[lang][k]||k} /></>
  );

  const NAV_META = {
    dashboard:  { title:t("dashboard"),  sub:t("dashboardDesc"),  icon:"dashboard" },
    income:     { title:t("income"),     sub:t("incomeDesc"),     icon:"income" },
    expense:    { title:t("expense"),    sub:t("expenseDesc"),    icon:"expense" },
    reports:    { title:t("reports"),    sub:t("reportsDesc"),    icon:"reports" },
    list:       { title:t("list"),       sub:t("listDesc"),       icon:"list" },
    calculator: { title:t("calculator"), sub:t("calculatorDesc"), icon:"calculator" },
    recurring:  { title:t("recurring"),  sub:t("recurringDesc"),  icon:"recurring" },
    staff:      { title:t("staff"),      sub:t("staffDesc"),      icon:"staff" },
  };
  const meta = NAV_META[page] || {};

  return (
    <>
      <GlobalStyle />
      <style>{mobileStyle}</style>
      <div className="mobile-topbar">
        <div className="mobile-topbar-logo">
          <div className="mobile-logo-icon"><Icon name="coffee" size={17} color="white"/></div>
          <h1>Chafé</h1>
        </div>
        <button className="hamburger" onClick={()=>setSidebarOpen(true)}>
          <Icon name="menu" size={19} color="rgba(255,245,232,0.8)" />
        </button>
      </div>

      <Sidebar
        page={page} setPage={setPage} onLogout={handleLogout}
        t={t} lang={lang} setLang={setLang}
        open={sidebarOpen} onClose={()=>setSidebarOpen(false)}
      />

      <div className="main-content">
        <div className="page-header">
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,background:"var(--accent-dim)",borderRadius:"var(--r-sm)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent)",flexShrink:0}}>
              <Icon name={meta.icon||"dashboard"} size={19}/>
            </div>
            <div>
              <h1 className="page-title">{meta.title}</h1>
              <p className="page-subtitle">{meta.sub}</p>
            </div>
          </div>
          <div className="signed-chip">
            <Icon name="user" size={12} color="var(--text3)" />
            {user.email}
          </div>
        </div>

        {loading ? (
          <div className="card" style={{textAlign:"center",padding:56}}>
            <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:12,color:"var(--text3)"}}>
              <div style={{width:30,height:30,border:"3px solid var(--border)",borderTopColor:"var(--accent)",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
              <span style={{fontSize:12.5}}>{t("loading")}</span>
            </div>
          </div>
        ) : <>
          {page==="dashboard"  && <Dashboard  incomes={incomes} expenses={expenses} t={t} />}
          {page==="income"     && <IncomePage  incomes={incomes} onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} t={t} />}
          {page==="expense"    && <ExpensePage expenses={expenses} staffList={staffList} onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} t={t} />}
          {page==="reports"    && <ReportsPage incomes={incomes} expenses={expenses} t={t} />}
          {page==="list"       && <SummaryList incomes={incomes} expenses={expenses} t={t} />}
          {page==="calculator" && <CalculatorPage incomes={incomes} expenses={expenses} recurring={recurring} t={t} />}
          {page==="recurring"  && <RecurringPage recurring={recurring} onAdd={addRecurring} onDelete={deleteRecurring} onUpdate={updateRecurring} t={t} />}
          {page==="staff"      && <StaffPage staffList={staffList} onAddStaff={addStaff} onDeleteStaff={deleteStaff} onUpdateStaff={updateStaff} t={t} />}
        </>}
      </div>

      <Toast toast={toast} onClear={()=>setToast(null)} />
    </>
  );
}