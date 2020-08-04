import test from "enhanced-tape";
import { createStore, combineReducers } from "redux";
import describeState from "describe_state";

test("describeState", function(t) {
  t.test("state.reducer", function(t) {

    t.test("sets initial state", function(t) {
      let { reducer } = describeState({name: "todos", getInitialState: () => []});
      let store = createStore(combineReducers({todos: reducer}));

      t.same(store.getState().todos, []);

      t.end();
    });

    t.test("preserves state on irrelevant actions", function(t) {
      let { reducer } = describeState({name: "todos", getInitialState: () => []});
      let store = createStore(combineReducers({todos: reducer}));

      let oldTodos = store.getState().todos;
      store.dispatch({type: "DO_NOTHING"});
      t.equal(store.getState().todos, oldTodos);
    
      t.end();
    });
  });

  t.test("state.newAction()", function(t) {
    t.test("changes store state", function(t) {
      let state = describeState({name: "todos", getInitialState: () => [1]});
      let store = createStore(combineReducers({todos: state.reducer}));

      store.dispatch(state.newAction(todos => [...todos, 2]));
      t.same(store.getState().todos, [1, 2]);

      t.end();
    });

    t.test("only changes relevant state parts", function(t) {
      let todosState = describeState({name: "todos", getInitialState: () => []});
      let usersState = describeState({name: "users", getInitialState: () => []});
      let store = createStore(combineReducers({todos: todosState.reducer, users: usersState.reducer}));

      store.dispatch(todosState.newAction(() => ["todo"]));
      store.dispatch(usersState.newAction(() => ["user"]));

      t.same(store.getState().users, ["user"]);
      t.same(store.getState().todos, ["todo"]);
    
      t.end();
    });
  });

  t.test("arguments validation", function(t) {
    t.test("throws if getInitialState is not a function", function(t) {
      t.throws(() => describeState({name: "todos", getInitialState: []}), /function/);
  
      t.end();
    });
  });
});