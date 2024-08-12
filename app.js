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
    let searchValue = '';
    let classValue = '';

    // If Branch is selected, we will be searching for "Mathematical Sciences"
    if (searchCategory === 'Branch') {
        searchValue = 'mathematical sciences';
        classValue = document.getElementById('classTypeSelect').value.toLowerCase();
    } else {
        searchValue = document.getElementById('searchInput').value.toLowerCase();
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
                let valueToSearch;
                if (searchCategory === 'Branch') {
                    const branchValue = student[searchCategory]?.toLowerCase() || '';
                    const studentClassValue = student['Class']?.toLowerCase() || '';
                    if (branchValue === searchValue && (classValue === 'both' || studentClassValue === classValue)) {
                        appendStudentToResults(student, resultsContainer);
                    }
                } else {
                    valueToSearch = student[searchCategory]?.toLowerCase() || '';
                    if (valueToSearch.startsWith(searchValue)) {
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
    const nameParts = student.Name.split(' ').map(name => name.toLowerCase());
    const email = `${nameParts.join('.')}.mat24@itbhu.ac.in`;

    const li = document.createElement('li');
    li.textContent = `Email: ${email}, Branch: ${student.Branch}, Class: ${student.Class}`;
    container.appendChild(li);
}
