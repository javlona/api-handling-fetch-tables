let loadButton = document.querySelector('#btn'),
    nameList = document.querySelector('#nameList');

// fetched users in localStorage
    let userStorage;

// fetched todos in localStorage
    let todosStorage;


// locale storage shortcuts
let storage = {
    add: function(key, value){
        return localStorage.setItem(key, JSON.stringify(value))
    },
    get: function(key){
        return JSON.parse(localStorage.getItem(key))
    },
    remove: function(key){
        localStorage.removeItem(key)
    }
};


function mainAction() {
    
    fetchDataToStorage()
    fetchTodos()
    addTodosToLocalStorage()

}

// fetch users from api to localStorage
function fetchDataToStorage() {
    nameList.innerHTML = ""
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(result => result.json())
        .then(data => {

            // fetched users is stored to localStorage
            storage.add('users', data)
            userStorage = storage.get('users')

            // render users to DOM from localStorage
            let tr;
            userStorage.forEach(user => {
                tr = `
                <td><a href="todo.html" target="_blank" onclick="selectUser(${user.id})">${user.name}</a></td>
                <td>${user.website}</td>
                <td>${user.phone}</td>
                <td>${user.address.city}</td>
                <td>${user.email}</td>
                `
                nameList.innerHTML += tr
            })
        })
        .catch(err => console.log(err, "error"))
}

// fetch todos from api to localStorage
async function fetchTodos() {
    let url = 'https://jsonplaceholder.typicode.com/todos'

    try {
        let response = await fetch(url)
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

async function addTodosToLocalStorage() {
    let response = await fetchTodos()
    
    // fetched todos is stored to localStorage
    storage.add('todos', response)
    todosStorage = storage.get('todos')
    
}

function getUsersTodos(todosStorage, id) {
    let result = []
    for(let todo of todosStorage){
        if(todo.userId === id)
        result.push(todo)
    }
    return result

}

// 
function selectUser(id) {
   
    let current = getUsersTodos(todosStorage, id)
    storage.add('currentTodo', current)

    console.log(id)
}

let title = document.getElementById('first_name')
let username = document.getElementById('last_name')
let phone = document.getElementById('phone')
let website = document.getElementById('website')
let email = document.getElementById('email')
let form = document.getElementById('form')


function User(name, username, phone, website, email) {
    this.name = name,
    this.username = username,
    this.phone = phone,
    this.website = website,
    this.email = email,
    this.address = {street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874', geo: {lat: '-37.3159', lng: '81.1496'}},
    this.company = {name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server neural-net', bs: 'harness real-time e-markets'}
}

async function createUser(e) {
    e.preventDefault();

    let user = new User(title.value, username.value, phone.value, website.value, email.value)

    let res = await postIt(user)
    
    let users = storage.get('users')

    storage.add("users", [...users, res])

    console.log(users)

}

async function postIt(data) {
    let response = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)  
        }
    )
    return response.json()
    
}

form.addEventListener('submit', createUser)
loadButton.addEventListener('click', mainAction)