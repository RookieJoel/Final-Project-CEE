let listBg = document.querySelectorAll('.bg');
let listTab = document.querySelectorAll('.tab');
let titleBanner = document.querySelector('.banner h1');
window.addEventListener("scroll", (event) => {
    /*scrollY is the web scrollbar position (pixel)*/
    let top = this.scrollY;
    /*index is the order of classes bg (0,1,2,3,4,5,6,7,8)
    When scrolling the web, the classes bg scroll down,
    the bigger the index, the faster the movement
    */
    listBg.forEach((bg, index) => {
        if(index != 0 && index != 8){
            bg.style.transform = `translateY(${(top*index/2)}px)`;
        }else if(index == 0){
            bg.style.transform = `translateY(${(top/3)}px)`;
        }
    })
    titleBanner.style.transform = `translateY(${(top*4/2)}px)`;

    /* parallax scroll in tab
    when tab's position is less than 550 px
    from scrollbar position add active class to animate 
    and vice versa
    */
    listTab.forEach(tab =>{
        if(tab.offsetTop - top < 550){
            tab.classList.add('active');
        }else{
            tab.classList.remove('active');
        }
    })
});  

document.getElementById('add-todo').addEventListener('click', async () => {
    const task = document.getElementById('todo-task').value.trim();
    const genre = document.getElementById('todo-genre').value.trim();

    if (!task || !genre) {
        alert('Please fill out both fields.');
        return;
    }

    try {
        const response = await fetch('http://54.211.108.140:3222/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ task, genre }),
        });

        if (response.ok) {
            document.getElementById('todo-task').value = '';
            document.getElementById('todo-genre').value = '';
            loadTodoList();
        } else {
            const errorData = await response.json();
            alert(`Error adding task: ${errorData.error}`);
        }
    } catch (err) {
        console.error('Error adding task:', err);
    }
});

// Filter Tasks
document.getElementById('filter-button').addEventListener('click', () => {
    const genre = document.getElementById('filter-genre').value.trim();
    loadTodoList(genre);
});

// Fetch and display the to-do list
async function loadTodoList(filterGenre = '') {
    try {
        const response = await fetch('http://54.211.108.140:3222/api/todos', {
            credentials: 'include',
        });

        const todos = await response.json();
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';

        todos
            .filter((todo) => !filterGenre || todo.genre.toLowerCase().includes(filterGenre.toLowerCase()))
            .forEach((todo) => {
                const listItem = document.createElement('li');
                listItem.setAttribute('data-id', todo._id);
                listItem.classList.add('todo-item');
                if (todo.completed) {
                    listItem.classList.add('completed');
                }

                listItem.innerHTML = `
                    <div class="todo-content">
                        <input type="checkbox" ${todo.completed ? 'checked' : ''} onclick="toggleComplete('${todo._id}', this.checked)" />
                        <span class="task-description">${todo.task}</span>
                        <span class="task-genre">${todo.genre}</span>
                    </div>
                    <button onclick="deleteTodo('${todo._id}')">Delete</button>
                `;
                todoList.appendChild(listItem);
            });
    } catch (err) {
        console.error('Error loading to-do list:', err);
    }
}

// Toggle Complete
async function toggleComplete(todoId, completed) {
    try {
        const response = await fetch(`http://54.211.108.140:3222/api/todos/${todoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ completed }),
        });

        if (response.ok) {
            const listItem = document.querySelector(`li[data-id="${todoId}"]`);
            if (completed) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
        } else {
            alert('Error updating task.');
        }
    } catch (err) {
        console.error('Error updating task:', err);
    }
}

// Delete a To-Do Item
async function deleteTodo(todoId) {
    try {
        const response = await fetch(`http://54.211.108.140:3222/api/todos/${todoId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            loadTodoList();
        } else {
            alert('Error deleting task.');
        }
    } catch (err) {
        console.error('Error deleting task:', err);
    }
}

  