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

document.addEventListener('DOMContentLoaded', () => {
    loadTodoList();
  
    document.getElementById('add-todo').addEventListener('click', async () => {
      const task = document.getElementById('todo-task').value;
      const genre = document.getElementById('todo-genre').value;
  
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
          alert('Error adding task.');
        }
      } catch (err) {
        console.error('Error adding task:', err);
      }
    });
  });
  
  // Fetch and display the to-do list
  async function loadTodoList() {
    try {
      const response = await fetch('http://54.211.108.140:3222/api/todos', {
        credentials: 'include',
      });
      const todos = await response.json();
      const todoList = document.getElementById('todo-list');
      todoList.innerHTML = '';
  
      todos.forEach((todo) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <span>${todo.task} - <strong>${todo.genre}</strong></span>
          <button onclick="deleteTodo('${todo._id}')">Delete</button>
        `;
        todoList.appendChild(listItem);
      });
    } catch (err) {
      console.error('Error loading to-do list:', err);
    }
  }
  
  // Delete a to-do item
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
  