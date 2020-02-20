import React from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { SIGNUP_USER } from "../../queries";
import Error from "../Error";
import helpers from "./helpers";
import validator from "validator";

const initialState = {
  email: "",
  password: "",
  passwordConfirmation: "",
  errors: [],
  formValidated: false
};

class Signup extends React.Component {
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
          this.showValidationErr(name, "eMail can not be empty");
        } else if (!validator.isEmail(value)) {
          isValidated = false;
          this.showValidationErr(name, "Invalid email format");
        }
        break;
      case "password":
        if (value === "") {
          isValidated = false;
          this.showValidationErr(name, "Password can not be empty");
        }
        break;
      case "passwordConfirmation":
        if (value === "") {
          isValidated = false;
          this.showValidationErr(
            name,
            "Password Confirmation can not be empty"
          );
        } else if (value !== this.state.password) {
          isValidated = false;
          this.showValidationErr(name, "Passwords do not match");
        }
        break;
      default:
    }

    return isValidated;
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      formValidated: this.validateField(name, value)
    });
  };

  handleSubmit = (event, signupUser) => {
    event.preventDefault();
    signupUser().then(async ({ data }) => {
      localStorage.setItem("token", data.signupUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push("/");
    });
  };

  render() {
    let passwordErr = null,
      emailErr = null,
      passwordConfirmationErr = null;

    for (let err of this.state.errors) {
      if (err.elm === "password") {
        passwordErr = err.msg;
      }
      if (err.elm === "passwordConfirmation") {
        passwordConfirmationErr = err.msg;
      }
      if (err.elm === "email") {
        emailErr = err.msg;
      }
    }
    const { email, password, passwordConfirmation } = this.state;
    return (
      <div className="App">
        <h2 className="App">Sign Up</h2>
        <Mutation mutation={SIGNUP_USER} variables={{ email, password }}>
          {(signupUser, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, signupUser)}
              >
                <input
                  onChange={this.handleChange}
                  type="email"
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
                <input
                  onChange={this.handleChange}
                  type="password"
                  value={passwordConfirmation}
                  name="passwordConfirmation"
                  placeholder="Confirm Password"
                />
                <small className="danger-error">
                  {passwordConfirmationErr ? passwordConfirmationErr : <br />}
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
export default withRouter(Signup);
