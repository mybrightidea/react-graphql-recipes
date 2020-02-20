import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from "../../queries";
import Error from "../Error";
import CKEditor from "react-ckeditor-component";

const initialState = {
  name: "",
  category: "Breakfast",
  description: "",
  instructions: "",
  imageUrl: "",
  email: ""
};
class AddRecipe extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };
  componentDidMount = () => {
    this.setState({ email: this.props.session.getCurrentUser.email });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event, addRecipe) => {
    event.preventDefault();

    addRecipe().then(({ data }) => {
      this.clearState();
      this.props.history.push("/");
    });
  };

  handleInstructionsChange = event => {
    const newContent = event.editor.getData();
    this.setState({ instructions: newContent });
  };

  validateForm = () => {
    const { imageUrl, name, category, description, instructions } = this.state;

    const isInvalid =
      !imageUrl || !name || !category || !description || !instructions;

    return isInvalid;
  };

  updateCache = (cache, { data: { addRecipe } }) => {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });

    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });
  };
  render() {
    const {
      imageUrl,
      name,
      category,
      description,
      instructions,
      email
    } = this.state;
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{
          imageUrl,
          name,
          category,
          description,
          instructions,
          email
        }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { email } }
        ]}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2>Add Recipe</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addRecipe)}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Recipe Name"
                  onChange={this.handleChange}
                  value={name}
                />
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Recipe Image Url"
                  onChange={this.handleChange}
                  value={imageUrl}
                />
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <input
                  type="text"
                  name="description"
                  placeholder="Add Description"
                  onChange={this.handleChange}
                  value={description}
                />
                <label htmlFor="instructions">Add Instructions</label>
                <CKEditor
                  name="instructions"
                  content={instructions}
                  events={{ change: this.handleInstructionsChange }}
                ></CKEditor>

                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(AddRecipe);
