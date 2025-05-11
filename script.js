let students = [];

function loadNames() {
    const nameListTextarea = document.getElementById('nameList');
    const names = nameListTextarea.value.trim().split('\n').filter(name => name !== '');
    const newStudents = names.map(name => ({ name: name.trim(), progress: 0 }));
    // Keep existing and add new, prevent duplicates
    newStudents.forEach(newStudent => {
        if (!students.some(existingStudent => existingStudent.name === newStudent.name)) {
            students.push(newStudent);
        }
    });
    updateStudentList();
    populateStudentSelect();
}

function loadCSV() {
    const csvFile = document.getElementById('csvFile');
    const file = csvFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const csvData = event.target.result;
            const lines = csvData.trim().split('\n').map(line => line.trim());
            // Assuming the first column is the student name
            const newStudents = lines.map(line => ({ name: line.split(',')[0].trim(), progress: 0 }));
            // Keep existing and add new, prevent duplicates
            newStudents.forEach(newStudent => {
                if (!students.some(existingStudent => existingStudent.name === newStudent.name)) {
                    students.push(newStudent);
                }
            });
            updateStudentList();
            populateStudentSelect();
        };
        reader.onerror = function() {
            alert('Error reading CSV file.');
        };
        reader.readAsText(file);
    } else {
        alert('Please select a CSV file.');
    }
}

function populateStudentSelect() {
    const studentSelect = document.getElementById('studentSelect');
    studentSelect.innerHTML = '';
    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = student.name;
        studentSelect.appendChild(option);
    });
}

function changeProgress(increment) {
    const studentSelect = document.getElementById('studentSelect');
    const selectedName = studentSelect.options[studentSelect.selectedIndex].textContent;
    const incrementValue = parseInt(document.getElementById('incrementValue').value) || 1;

    const studentToUpdate = students.find(student => student.name === selectedName);

    if (studentToUpdate) {
        if (increment) {
            studentToUpdate.progress += incrementValue;
        } else if (studentToUpdate.progress >= incrementValue) {
            studentToUpdate.progress -= incrementValue;
        } else {
            studentToUpdate.progress = 0;
        }
        sortStudents();
        updateStudentList();
    }
}

function sortStudents() {
    students.sort((a, b) => b.progress - a.progress);
}

function updateStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    let maxProgress = 0;
    if (students.length > 0) {
        maxProgress = students[0].progress;
    }

    students.forEach((student, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center py-4';
        const rank = index + 1;
        let progressBarWidth = '0%';

        if (maxProgress > 0) {
            progressBarWidth = `${(student.progress / maxProgress) * 100}%`;
        } else if (student.progress > 0) {
            progressBarWidth = '100%';
        }

        listItem.innerHTML = `
            <div class="rank-badge-container ${getRankBackgroundClass(rank)}">
                <span class="rank-number">${rank}</span>
            </div>
            <div class="progress-container">
                <span class="progress-label">${student.name}:</span>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progressBarWidth};"></div>
                </div>
                <span class="ml-2 text-gray-600">(${student.progress})</span>
            </div>
            ${getBadge(rank)}
        `;
        studentList.appendChild(listItem);
    });
}

function getRankBackgroundClass(rank) {
    if (rank === 1) {
        return 'rank-1-bg';
    } else if (rank === 2) {
        return 'rank-2-bg';
    } else if (rank === 3) {
        return 'rank-3-bg';
    }
    return 'bg-gray-400 text-white';
}

function getBadge(rank) {
    if (rank === 1) {
        return '<span class="badge gold-badge">🥇 Champion</span>';
    } else if (rank === 2) {
        return '<span class="badge silver-badge">🥈 First Runner-Up</span>';
    } else if (rank === 3) {
        return '<span class="badge bronze-badge">🥉 Second Runner-Up</span>';
    } else if (rank <= 5) {
        return '<span class="badge bg-blue-300 text-gray-800">⭐ Top 5</span>';
    } else if (rank >= students.length - 2 && students.length > 3) {
        return '<span class="badge bg-red-300 text-white">💪 Keep Going</span>';
    }
    return '';
}

// Initial load (if you have some default data)
// loadNames();