// Script to update search-index.json URLs to point to the previous section
const fs = require('fs');

// Read the search-index.json file
fs.readFile('search-index.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const searchIndex = JSON.parse(data);

    // Update each URL to point to the previous section
    searchIndex.forEach(item => {
      // Extract the section number from the URL
      const match = item.url.match(/#section-jump-(\d+)$/);
      if (match) {
        const sectionNumber = parseInt(match[1], 10);
        // If section number is greater than 0, decrement it
        if (sectionNumber > 0) {
          const newSectionNumber = sectionNumber - 1;
          item.url = item.url.replace(`#section-jump-${sectionNumber}`, `#section-jump-${newSectionNumber}`);
        }
      }
    });

    // Write the updated JSON back to the file
    fs.writeFile('search-index.json', JSON.stringify(searchIndex, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('search-index.json updated successfully');
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});