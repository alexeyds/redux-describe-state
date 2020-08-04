# redux-describe-state
Yet another abstraction over redux actions

## Installation
```
npm i redux-describe-state
```

## Usage
```js
import { createStore, combineReducers } from "redux";
import describeState from "redux-describe-state";

let { reducer: todosReducer, buildAction } = describeState({
  name: "todos",
  getInitialState: () => []
});

function addTodo(todo) {
  return buildAction(todos => [...todos, todo]);
}

function removeTodo(todo) {
  return buildAction(todos => todos.filter(t => t !== todo));
}

function resetTodos() {
  return buildAction(() => []);
}

let store = createStore(combineReducers({todos: todosReducer}));
let getTodos = () => store.getState().todos;

console.log(getTodos()); // => []

store.dispatch(addTodo('do this'));
console.log(getTodos()); // => ['do this']

store.dispatch(addTodo('do that'));
console.log(getTodos()); // => ['do this', 'do that']

store.dispatch(removeTodo('do this'));
console.log(getTodos()); // => ['do that']

store.dispatch(resetTodos());
console.log(getTodos()); // => []
```

## API
### describeState
```js
describeState({name, getInitialState})
```

- `name`: name for this state chunk. Used in generating action name. Required.
- `getInitialState`: a function which will be called in the reducer if state is blank. Required.

Returns and object with following keys:
- `reducer`: a reducer function which can be passed to redux's `combineReducers` or used on its own.
- `buildAction`: action builder function.

```js
let action = buildAction(currentState => nextState);
dispatch(action);
```

## License
MIT