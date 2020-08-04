export default function describeState({name, getInitialState}) {
  let reducer = describeReducer({name, getInitialState});

  let buildAction = (executeAction) => {
    return { type: actionType(name), execute: executeAction };
  };

  return { reducer, buildAction, name };
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
