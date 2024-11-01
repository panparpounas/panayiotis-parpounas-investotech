let rowToDelete = null; // Variable to hold the row to be deleted

// Add an event listener for form submission
document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Retrieve form values
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const age = parseInt(document.getElementById('age').value); // Convert age to an integer
    const favoriteColor = document.getElementById('favoriteColor').value;
    
    // Collect checked contact preferences
    const contactPreferences = [];
    if (document.getElementById('contactEmail').checked) contactPreferences.push('Email');
    if (document.getElementById('contactPhone').checked) contactPreferences.push('Phone Call');
    if (document.getElementById('contactSMS').checked) contactPreferences.push('SMS');

    // Validate form inputs before adding to table
    if (!validateForm(email, age, contactPreferences)) {
        return; // Exit if validation fails
    }

    // Add a new row to the table
    addRowToTable(name, surname, email, age, favoriteColor, contactPreferences.join(', '));
    
    // Reset the form for new input
    this.reset();
});

// Function to validate the form inputs
function validateForm(email, age, contactPreferences) {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showValidationMessage('Invalid email format.'); // Show validation error in modal
        return false; // Validation failed
    }
    if (age >= 120) {
        showValidationMessage('Age must be less than 120.'); // Show validation error in modal
        return false; // Validation failed
    }
    if (contactPreferences.length === 0) {
        showValidationMessage('At least one contact preference must be selected.'); // Show validation error in modal
        return false; // Validation failed
    }
    return true; // All validations passed
}

// Function to show validation message in the modal
function showValidationMessage(message) {
    document.getElementById('validationMessage').innerText = message; // Set the error message in the modal
    const validationModal = new bootstrap.Modal(document.getElementById('validationModal')); // Initialize the modal
    validationModal.show(); // Display the modal
}

// Function to add a new row to the data table
function addRowToTable(name, surname, email, age, favoriteColor, contactPreferences) {
    const tableBody = document.getElementById('tableBody'); // Reference to the table body
    const row = tableBody.insertRow(); // Insert a new row

    // Populate the row cells with the user input data
    row.insertCell(0).innerText = name;
    row.insertCell(1).innerText = surname;
    row.insertCell(2).innerText = email;
    row.insertCell(3).innerText = age;
    row.insertCell(4).innerText = favoriteColor;
    row.insertCell(5).innerText = contactPreferences;

    // Create a delete button for the row
    const deleteCell = row.insertCell(6);
    const deleteBtn = document.createElement('button'); // Create a button element
    deleteBtn.innerText = 'Delete'; // Button text
    deleteBtn.classList.add('btn', 'btn-small', 'btn-danger'); // Add Bootstrap classes
    deleteBtn.onclick = function() {
        // Set the row to delete and open the delete confirmation modal
        rowToDelete = row;
        const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        deleteConfirmModal.show();
    };
    deleteCell.appendChild(deleteBtn); // Add delete button to the row

    // Display the table container if data is present
    checkTableData(); // Update the no data message
}

// Function to check if the table has data
function checkTableData() {
    const tableBody = document.getElementById('tableBody');
    const noData = document.getElementById('noData');
    if (tableBody.rows.length === 0) {
        noData.style.display = 'block'; // Show no data message if no rows
        document.getElementById('tableContainer').style.display = 'none'; // Hide table container
    } else {
        noData.style.display = 'none'; // Hide no data message if rows exist
        document.getElementById('tableContainer').style.display = 'block'; // Show table container
    }
}

// Call checkTableData on page load
document.addEventListener('DOMContentLoaded', checkTableData);

// Event listener for the export button
document.getElementById('exportBtn').addEventListener('click', function() {
    const tableBody = document.getElementById('tableBody');
    const jsonData = []; // Array to hold JSON data

    // Loop through table rows to construct JSON data
    for (let row of tableBody.rows) {
        const rowData = {
            name: row.cells[0].innerText,
            surname: row.cells[1].innerText,
            email: row.cells[2].innerText,
            age: row.cells[3].innerText,
            favoriteColor: row.cells[4].innerText,
            contactPreferences: row.cells[5].innerText.split(', ') // Split string to array
        };
        jsonData.push(rowData); // Add row data to JSON array
    }

    // Display JSON data in the modal
    document.getElementById('jsonOutput').innerText = JSON.stringify(jsonData, null, 2);
});

// Event listener for the delete confirmation button in the modal
document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    if (rowToDelete) {
        // Delete the row from the table body
        document.getElementById('tableBody').deleteRow(rowToDelete.rowIndex - 1);
        
        checkTableData(); // Update the "no data" message if needed
        rowToDelete = null; // Clear the rowToDelete variable

        // Hide the delete confirmation modal
        const deleteConfirmModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
        deleteConfirmModal.hide();
    }
});
