import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = { todos: {} };

    this.handleNewTodoInput = this.handleNewTodoInput.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.enableEditMode = this.enableEditMode.bind(this);
    this.updateCurrentTodo = this.updateCurrentTodo.bind(this);
  }

  componentDidMount() {
    axios.get('https://todo-87ea8.firebaseio.com/.json')
      .then((res) => {
        this.setState({todos: res.data})
  });
}

  createTodo(todoText) {
    let newTodo = { title: todoText, createdAt: new Date };

    axios({
      url: '.json',
      baseURL: 'https://todo-87ea8.firebaseio.com/',
      method: "POST",
      data: newTodo
    }).then((response) => {

      let todos = this.state.todos;
      let newTodoId = response.data.name;
      todos[newTodoId] = newTodo;
      this.setState({ todos: todos });
    }).catch((error) => {
      console.log(error);
    });
  }

  handleNewTodoInput(event) {
    if (event.charCode === 13) {
      this.createTodo(event.target.value);
      event.target.value = "";
    }
  }


  renderNewTodoBox() {
    return (
      <div className="new-todo-box pb-2">
        <input className="w-100" placeholder="What do you have to do?" onKeyPress={ this.handleNewTodoInput } />
      </div>
    );
  }

  deleteTodo(todo) {
    axios.delete('https://todo-87ea8.firebaseio.com/'+todo+'.json')
      .then((res) => {
        let todos = this.state.todos;
        delete todos[todo];
        this.setState({ todos: todos });
    });
      }

  selectTodo(todo) {
    this.setState({currentTodo: todo})
  }


  renderTodoList() {
    let todoElements = [];

    for(let todoId in this.state.todos) {
      let todo = this.state.todos[todoId]

      todoElements.push(
        <div className="todo d-flex justify-content-between pb-4" key={todoId}>
          <div className="mt-2" onClick={ () => this.selectTodo(todoId) }>
            <h4>{todo.title}</h4>
            <div>{moment(todo.createdAt).calendar()}</div>
          </div>
          <button
            className="ml-4 btn btn-link"
            onClick={ () => { this.deleteTodo(todoId) } }
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    return (
      <div className="todo-list">
        {todoElements}
      </div>
    );
  }

    enableEditMode() {
      this.setState({edit: true});
    }

    updateCurrentTodo(todo, newText) {
      console.log(todo);
      console.log(newText);
      axios.patch('https://todo-87ea8.firebaseio.com/'+todo+'.json', {title: newText})
        .then((res) => {
          let todos = this.state.todos;
        todos[todo].title = newText;
        this.setState({ todos: todos });
        this.setState({currentTodo: false})
        this.setState({edit: false});
        })
    }

    renderSelectedTodo() {
    let content;

    if (this.state.currentTodo) {
      let currentTodo = this.state.todos[this.state.currentTodo];
      if(!this.state.edit) {
        content =  (
          <div>
            <div className="d-flex justify-content-end mb-3">
              <button onClick={this.enableEditMode}>Edit</button>
            </div>
            <h1>{currentTodo.title}</h1>
          </div>
        );
      } else {
        content =  (
          <div>
            <div className="d-flex justify-content-end mb-3">
              <button onClick={() => {this.updateCurrentTodo(this.state.currentTodo, this.revisedTodo.value)}}>Save</button>
            </div>
            <input className="w-100" defaultValue={currentTodo.title} ref={(input) => {
                  this.revisedTodo = input;
                }} />
          </div>
        );
      }
    }

    return content;
  }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
            {this.renderNewTodoBox()}
            {this.renderTodoList()}
          </div>
           <div className="col-6 px-4">
            {this.renderSelectedTodo()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
