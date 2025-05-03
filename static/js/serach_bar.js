document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('quick_search');
    const searchButton = document.getElementById('searchBtn');
    const equipmentSections = document.querySelectorAll('.equipment-section');
    const equipmentContainer = document.querySelector('.equipment-section'); // Main content container for equipment
    const existingMessage = document.getElementById('no-match-message');

    // Function to filter equipment based on search input
    function filterEquipment() {
        const searchQuery = searchInput.value.toLowerCase();
        let foundMatch = false;

        // Remove any previous "No match" message
        if (existingMessage) {
            existingMessage.remove();
        }

        // Hide all equipment sections initially
        equipmentSections.forEach(section => {
            section.style.display = 'none';
        });

        // Loop through each equipment section to find matches
        equipmentSections.forEach(section => {
            const equipmentBoxes = section.querySelectorAll('.box');
            let sectionHasMatch = false;

            // Loop through each equipment box in the section
            equipmentBoxes.forEach(box => {
                const title = box.querySelector('h3').textContent.toLowerCase();
                const description = box.querySelector('p').textContent.toLowerCase();

                // If search query matches either title or description
                if (title.includes(searchQuery) || description.includes(searchQuery)) {
                    box.style.display = 'block'; // Show matching equipment
                    sectionHasMatch = true;
                } else {
                    box.style.display = 'none'; // Hide non-matching equipment
                }
            });

            // If any equipment inside the section matches, show the section
            if (sectionHasMatch) {
                section.style.display = 'block';
                foundMatch = true;
            }
        });

        // If no equipment matches, display a "No match found" message
        if (!foundMatch) {
            const message = document.createElement('div');
            message.id = 'no-match-message';
            message.textContent = 'No equipment found matching your search. Please try again with different keywords.';
            message.style.textAlign = 'center';
            message.style.fontSize = '18px';
            message.style.color = '#FF0000';
            message.style.padding = '20px';
            equipmentContainer.innerHTML = ''; // Clear equipment content
            equipmentContainer.appendChild(message); // Append message instead of equipment
        }
    }

    // Bind the filter function to the search button
    searchButton.addEventListener('click', filterEquipment);
});
