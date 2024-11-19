document.getElementById('categorySelect').addEventListener('change', function() {
  const selectedCategory = this.value;
  console.log('Selected Category:', selectedCategory); // Log for debugging

  // Send the selected category to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'filterTitles', category: selectedCategory });
  });
});
