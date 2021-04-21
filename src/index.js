const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find(user => user.username === username);

  if(!user) {
      return response.status(404).json({error: "This user don`t exist."});
  }
  
  request.user = user;

  return next();
  
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;

  const verifyUser = users.find(user => user.username === username);

  if(verifyUser){
    return response.status(400).json({error: "Already exist this user."})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount,  (request, response) => {
  // Complete aqui
   const { user } =  request;

   return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user } = request;
  const {title, deadline} = request.body;

  const todo = {
    id: uuidv4(), 
    title,
    done: false, 
    deadline,
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const { id } = request.params;
  const {title, deadline} = request.body;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) {
    return response.status(404).json({error: "Erro de id"});
  }
 
  todo.title = title;
  todo.deadline = deadline;

  return response.json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const { id} = request.params;
  const {done} = request.body;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) {
    return response.status(404).json({error: "Don`t exist todos."});
  }
 
  todo.done = true;  //done -> se for utilizar insomnia


  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1) {
    return response.status(404).json({error: "There isn't todo with this id"});
  }
 
  user.todos.splice(todoIndex,1);

  return response.status(204).json();
});

module.exports = app;