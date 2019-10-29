import test from "enhanced-tape";
import { createStore, combineReducers } from "redux";
import describeState, { combineStates } from "describe_state";

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
});

test("combineStates", function(t) {
  t.test("combines states into reducers object", function(t) {
    let state = describeState({name: "todos", getInitialState: () => [1]});
    let store = createStore(combineReducers(combineStates([state])));

    t.same(store.getState().todos, [1]);
  
    t.end();
  });

  t.test("throws instead of overwriting existing state", function(t) {
    let todos_1 = describeState({name: "todos", getInitialState: () => []});
    let todos_2 = describeState({name: "todos", getInitialState: () => []});

    t.throws(() => combineStates([todos_1, todos_2]), /state/);
  
    t.end();
  });
});