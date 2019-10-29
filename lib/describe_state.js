export default function describeState({name, getInitialState}) {
  if (typeof getInitialState !== "function") {
    throw new TypeError(`Expected getInitialState for ${name} state to be a function, got: ${getInitialState}`);
  }

  let reducer = describeReducer({name, getInitialState});
  let newAction = (executeAction) => ({ type: actionType(name), execute: executeAction });

  return { reducer, newAction, name };
}

function describeReducer({name, getInitialState}) {
  return function reducer(state, action) {
    state = state || getInitialState();

    if (action.type === actionType(name)) {
      state = action.execute(state);
    }

    return state;
  };
}

function actionType(name) {
  return `__${name}_ACTION__`;
}

export function combineStates(states) {
  let result = {};

  states.forEach(state => {
    if (!hasKey(state, "name")) {
      throw new Error(`Each state passed to combineStates() must have a 'name' property`);
    }

    if (!hasKey(state, "reducer")) {
      throw new Error(`Each state passed to combineStates() must have a 'reducer' property`);
    }

    if (hasKey(result, state.name)) {
      throw new Error(`Duplicate state passed to combineStates: '${state.name}' state has already been defined.`);
    }
    
    result[state.name] = state.reducer;
  });

  return result;
}

function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}