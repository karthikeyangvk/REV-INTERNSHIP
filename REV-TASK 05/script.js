// Get references to elements
const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Function to add a task
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  // Create <li> element
  const li = document.createElement('li');

  // Create checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  // When checkbox is clicked, toggle line-through
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      li.style.textDecoration = 'line-through';
    } else {
      li.style.textDecoration = 'none';
    }
  });

  // Create text node
  const textNode = document.createTextNode(' ' + taskText + ' ');

  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';

  // Delete button removes the task
  deleteBtn.addEventListener('click', () => {
    li.remove();
  });

  // Add everything to <li>
  li.appendChild(checkbox);
  li.appendChild(textNode);
  li.appendChild(deleteBtn);

  // Add <li> to <ul>
  taskList.appendChild(li);

  // Clear the input box
  taskInput.value = '';
});

