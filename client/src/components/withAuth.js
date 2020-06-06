import React from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";
import { GET_CURRENT_USER } from "../queries";

const withAuth = conditionFunc => Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({ data, loading, refetch }) => {
      if (loading) return null;
      return conditionFunc(data) ? (
        <Component {...props} refetch={refetch} session={data} />
      ) : (
        <Redirect to="/" />
      );
    }}
  </Query>
);

export default withAuth;