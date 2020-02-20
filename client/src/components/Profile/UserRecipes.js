import React, { Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import { Link } from "react-router-dom";
import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER,
  UPDATE_USER_RECIPE
} from "../../queries";
import Spinner from "../Spinner";

class UserRecipes extends React.Component {
  state = {
    _id: "",
    name: "",
    imageUrl: "",
    category: "",
    description: "",
    modal: false
  };
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleSubmit = (event, updateUserRecipe) => {
    event.preventDefault();
    updateUserRecipe().then(({ data }) => {
      console.log(data);
      this.closeModal();
    });
  };
  handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm("Confirm delete recipe?");

    if (confirmDelete) {
      deleteUserRecipe().then(({ data }) => {});
    }
  };
  closeModal = () => {
    this.setState({ modal: false });
  };

  loadRecipe = recipe => {
    this.setState({ ...recipe, modal: true });
  };

  render() {
    const { email } = this.props;
    const { modal } = this.state;
    return (
      <Query query={GET_USER_RECIPES} variables={{ email }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div className="error">Error</div>;

          return (
            <Fragment>
              <h3>Your Contibuted Recipes</h3>
              {!data.getUserRecipes.length && (
                <p>
                  <strong>Add some recipes!</strong>
                </p>
              )}
              <ul>
                {modal && (
                  <EditRecipeModal
                    closeModal={this.closeModal}
                    handleChange={this.handleChange}
                    recipe={this.state}
                    handleSubmit={this.handleSubmit}
                  />
                )}

                {data.getUserRecipes.map(recipe => (
                  <li key={recipe._id}>
                    <Link to={`/recipes/${recipe._id}`}>{recipe.name}</Link>
                    <p style={{ marginBottom: "0" }}>Likes: {recipe.likes}</p>

                    <Mutation
                      mutation={DELETE_USER_RECIPE}
                      variables={{ _id: recipe._id }}
                      refetchQueries={() => [
                        { query: GET_ALL_RECIPES },
                        { query: GET_CURRENT_USER }
                      ]}
                      update={(cache, data) => {
                        const { getUserRecipes } = cache.readQuery({
                          query: GET_USER_RECIPES,
                          variables: { email }
                        });

                        cache.writeQuery({
                          query: GET_USER_RECIPES,
                          variables: { email },
                          data: {
                            getUserRecipes: getUserRecipes.filter(
                              recipe =>
                                recipe._id !== data.data.deleteUserRecipe._id
                            )
                          }
                        });
                      }}
                    >
                      {(deleteUserRecipe, attrs = {}) => (
                        <div>
                          <button
                            className="button-primary"
                            //                            onClick={() => this.setState({ modal: true })}
                            onClick={() => this.loadRecipe(recipe)}
                          >
                            Update
                          </button>
                          <p
                            className="delete-button"
                            onClick={() => this.handleDelete(deleteUserRecipe)}
                          >
                            {attrs.loading ? "Deleting ..." : "X"}
                          </p>
                        </div>
                      )}
                    </Mutation>
                  </li>
                ))}
              </ul>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}
const EditRecipeModal = ({
  handleSubmit,
  handleChange,
  closeModal,
  recipe
}) => (
  <Mutation
    mutation={UPDATE_USER_RECIPE}
    variables={{
      _id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      category: recipe.category
    }}
  >
    {updateUserRecipe => (
      <div className="modal modal-open">
        <div className="modal-inner">
          <div className="modal-content">
            <form
              className="modal-content-inner"
              onSubmit={event => handleSubmit(event, updateUserRecipe)}
            >
              <h4>Edit Recipe</h4>

              <label htmlFor="name">Recipe Name</label>
              <input
                type="text"
                name="name"
                value={recipe.name}
                onChange={handleChange}
              />
              <label htmlFor="imageUrl">Recipe Image</label>
              <input
                type="text"
                name="imageUrl"
                value={recipe.imageUrl}
                onChange={handleChange}
              />
              <label htmlFor="category">Category of Recipe</label>
              <select
                name="category"
                value={recipe.category}
                onChange={handleChange}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
              <label htmlFor="description">Recipe Description</label>
              <input
                type="text"
                name="description"
                value={recipe.description}
                onChange={handleChange}
              />

              <hr />
              <div className="modal-buttons">
                <button type="submit" className="button-primary">
                  Update
                </button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </Mutation>
);
export default UserRecipes;
