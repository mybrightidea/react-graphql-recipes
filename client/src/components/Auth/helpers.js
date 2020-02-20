var helpers = {};
helpers.showValidationErr = function(elm, msg) {
  // in setState with callback you *BUILD A NEW OBJECT* by accessing prevState
  //https://reactjs.org/docs/react-component.html#setstate - ossum
  this.setState(prevState => ({
    errors: [
      ...prevState.errors,
      {
        elm,
        msg
      }
    ]
  }));
};

helpers.clearValidationErr = function(elm) {
  this.setState(prevState => {
    let newArr = [];
    for (let err of prevState.errors) {
      if (elm !== err.elm) {
        newArr.push(err);
      }
    }
    return { errors: newArr };
  });
};
export default helpers;
