import test from "enhanced-tape";
import { createStore, combineReducers } from "redux";
import describeState from "../../dist/redux-describe-state";

test("README.md examples", function(t) {
  t.test("first example", function(t) {
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

    t.same(getTodos(), []);

    store.dispatch(addTodo('do this'));
    t.same(getTodos(), ['do this']);

    store.dispatch(addTodo('do that'));
    t.same(getTodos(), ['do this', 'do that']);

    store.dispatch(removeTodo('do this'));
    t.same(getTodos(), ['do that']);

    store.dispatch(resetTodos());
    t.same(getTodos(), []);

    t.end();
  });
});