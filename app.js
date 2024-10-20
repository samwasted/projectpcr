function handleCategoryChange() {
    const searchCategory = document.getElementById('searchCategory').value;
    const branchInputContainer = document.getElementById('branchInputContainer');
    if (searchCategory === 'Branch') {
        branchInputContainer.style.display = 'block';
        document.getElementById('searchInput').style.display = 'none';
    } else {
        branchInputContainer.style.display = 'none';
        document.getElementById('searchInput').style.display = 'block';
    }
}

function searchStudents() {
    const searchCategory = document.getElementById('searchCategory').value;
    let searchValue;
    let classValue = '';

    if (searchCategory === 'Branch') {
        searchValue = document.getElementById('branchInput').value.toLowerCase();
        classValue = document.getElementById('classTypeSelect').value.toLowerCase();
    } else {
        searchValue = document.getElementById('searchInput').value.toLowerCase();
    }

    // Abbreviation mapping for branches
    const branchMapping = {
        'mnc': 'mathematics and computing',
        'cse': 'computer science and engineering',
        'ep': 'physics'
    };

    // If the search is for a branch, map abbreviations to full names
    if (searchCategory === 'Branch' && branchMapping[searchValue]) {
        searchValue = branchMapping[searchValue];
    }

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    fetch('list.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const students = data.Data;
            students.forEach(student => {
                if (searchCategory === 'Branch') {
                    const branchValue = student[searchCategory]?.toLowerCase() || '';
                    const studentClassValue = student['Class']?.toLowerCase() || '';
                    if (branchValue.startsWith(searchValue) && (classValue === 'both' || studentClassValue === classValue)) {
                        appendStudentToResults(student, resultsContainer);
                    }
                } else {
                    const valueToSearch = student[searchCategory]?.toLowerCase() || '';
                    if (searchCategory === 'Name') {
                        // Split the name into words and check if any of them start with the search value
                        const nameWords = valueToSearch.split(' ');
                        const matches = nameWords.some(word => word.startsWith(searchValue));
                        if (matches) {
                            appendStudentToResults(student, resultsContainer);
                        }
                    } else if (valueToSearch.startsWith(searchValue)) {
                        appendStudentToResults(student, resultsContainer);
                    }
                }
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            resultsContainer.innerHTML = `<li>Error: ${error.message}</li>`;
        });
}

function appendStudentToResults(student, container) {
    const gender = student.Gender?.toLowerCase();
    let genderEmoji = '';
    if (gender === 'nar') {
        genderEmoji = '👨'; // Male emoji
    } else if (gender === 'mada') {
        genderEmoji = '👩'; // Female emoji
    }

    const li = document.createElement('li');
    let textContent = `Name: ${student.Name} ${genderEmoji}, Room No: ${student.RoomNo}, Branch: ${student.Branch}, Class: ${student.Class}`;

    // Adding the additional columns if they are not zero
    

    li.textContent = textContent;
    container.appendChild(li);
}
