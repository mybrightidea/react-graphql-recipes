import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import { SIGNIN_USER } from "../../queries";
import Error from "../Error";

import helpers from "./helpers";

const initialState = {
  email: "",
  password: "",
  errors: [],
  formValidated: false
};

class Signin extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  showValidationErr = helpers.showValidationErr.bind(this);
  clearValidationErr = helpers.clearValidationErr.bind(this);

  validateField(name, value) {
    let isValidated = true;

    this.clearValidationErr(name);
    switch (name) {
      case "email":
        if (value === "") {
          isValidated = false;
          this.showValidationErr(name, "email can not be empty");
        }
        break;
      case "password":
        if (value === "") {
          isValidated = false;
          this.showValidationErr(name, "Password can not be empty");
        }
        break;
      default:
    }

    return isValidated;
  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState(prevState => ({
      [name]: value,
      formValidated: this.validateField(name, value)
    }));
  };

  handleSubmit = (event, signinUser) => {
    event.preventDefault();
    signinUser().then(async ({ data }) => {
      localStorage.setItem("token", data.signinUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push("/");
    });
  };

  render() {
    let passwordErr = null,
      emailErr = null;

    for (let err of this.state.errors) {
      if (err.elm === "password") {
        passwordErr = err.msg;
      }
      if (err.elm === "email") {
        emailErr = err.msg;
      }
    }
    const { email, password } = this.state;
    return (
      <div className="App">
        <h2 className="App">Sign In</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ email, password }}>
          {(signinUser, { data, loading, error }) => {
            return (
              <form
                autoComplete="off"
                className="form"
                onSubmit={event => this.handleSubmit(event, signinUser)}
              >
                <input
                  onChange={this.handleChange}
                  type="text"
                  value={email}
                  name="email"
                  placeholder="eMail Address"
                />
                <small className="danger-error">
                  {emailErr ? emailErr : <br />}
                </small>
                <input
                  onChange={this.handleChange}
                  type="password"
                  value={password}
                  name="password"
                  placeholder="Password"
                />
                <small className="danger-error">
                  {passwordErr ? passwordErr : <br />}
                </small>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={loading || !this.state.formValidated}
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}
export default withRouter(Signin);
