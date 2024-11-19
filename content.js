const categories = {
  "Religious Attention": {
   "keywords": [
      "পূজা", "ঈদ", "মুর্তি", "মিলাদ", "মাহফিল", "মসজিদ", "মাজার", "সনাতন", 
      "প্রতিমা", "ইসলামি", "ইসলামী", "মণ্ডপ", "সাম্প্রদায়িক", "খ্রিস্টান", "নামাজ", 
      "প্রার্থনা", "পবিত্র", "পূর্ণিমা", "ইজতেমা", "ইসলামবিরোধী", "ধর্মীয়"
    ]
  },
  "Ethnic Attention": {
    "keywords": [
      "খাগড়াছড়ি", "রাঙ্গামাটি", "বান্দরবন", "পাহাড়", "পাহাড়ী", "পার্বত্য", 
      "সাজেক", "ঝর্ণা", "সেনাশাসন", "ইউপিডিএফ"
    ]
  },
  "Corruption Reports": {
    "keywords": [
      "অর্থ পাচার", "দুর্নীতি", "আত্মসাৎ", "সরকারী টাকা", "সরকারি দুর্নীতি", 
      "চোরাই", "লুট", "লোপাট", "দুর্নীতিবাজ", "দুর্নীতিমুক্ত"
    ]
  },
  "Mob Justice": {
    "keywords": [
      "মব", "সন্দেহে হত্যা", "মারধর", "পিটিয়ে হত্যা", "গণপিটুনি", "হত্যাকাণ্ড"
    ]
  },
  "Advisor": {
    "keywords": [
      "উপদেষ্টা", "ড. ইউনূস", "প্রধান উপদেষ্টা", "ক্রীড়া উপদেষ্টা", "গণশিক্ষা উপদেষ্টা", 
      "মৎস্য উপদেষ্টা", "পরিবেশ উপদেষ্টা", "রাজনীতিবিদ"
    ]
  },
  "Law and Order": {
    "keywords": [
      "গ্রেফতার", "মামলা", "শহীদ", "গ্রেফতারী", "জেল", "সাজার", "অভিযোগ", "লাঠিচার্জ", 
      "নিষেধাজ্ঞা", "আদেশ", "বাতিল"
    ]
  },
  "July Movement and Injured People Status": {
    "keywords": [
      "জুলাই", "আন্দোলন", "শহীদ", "বিপ্লব", "গণ-অভ্যুত্থান"
    ]
  },
  "Financial/Economic Progress": {
    "keywords": [
      "আয়", "রিজার্ভ", "রেমিটেন্স", "অর্থ", "ফাউন্ডেশন", "মুগ্ধ"
    ]
  },
  "Movement": {
    "keywords": [
      "আন্দোলন", "মিছিল", "সমাবেশ", "অবরোধ", "বিক্ষোভ"
    ]
  },
  "Public Opinion": {
    "keywords": [
      "মন্তব্য", "মতামত", "জনমত"
    ]
  },
  "Public Expectations from Government": {
    "keywords": [
      "দাবী", "সুপারিশ", "মন্তব্য", "প্রতিবাদ", "দাবি", "ফাউন্ডেশন"
    ]
  }
};

function logKeywords(category) {
  console.log(`Loaded Keywords for ${category}:`, categories[category]?.keywords || []);
}

function fetchTitles(category) {
  const links = document.querySelectorAll('a');
  if (links.length === 0) {
    console.warn("No links found on the current page.");
    return;
  }

  // Log the keywords for the selected category
  logKeywords(category);

  const seenTitles = new Set();
  const seenLinks = new Set();
  const matchedTitles = [];

  links.forEach((link) => {
    const text = link.textContent.trim();
    const href = link.href;

    if (
      categories[category]?.keywords.some((keyword) => text.includes(keyword)) &&
      !seenTitles.has(text) &&
      !seenLinks.has(href)
    ) {
      matchedTitles.push({ Title: text, Link: href });
      seenTitles.add(text);
      seenLinks.add(href);
    }
  });

  if (matchedTitles.length > 0) {
    console.log("Matched Titles (Duplicates Removed):", matchedTitles);
    downloadResults(matchedTitles, category);
  } else {
    console.log("No matching titles found for the selected category.");
  }
}

// Function to download results as a text file
function downloadResults(matchedTitles, category) {
  const textContent = matchedTitles
    .map(({ Title, Link }) => `Title: ${Title}\nLink: ${Link}\n`)
    .join("\n");
  
  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `${category}_results.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'filterTitles') {
    console.log('Received category:', request.category); // Log the received category
    fetchTitles(request.category);
  }
});    