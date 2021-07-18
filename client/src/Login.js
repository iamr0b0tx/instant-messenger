import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
} from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";
import formStyles from "./FormStyles";
import LeftSideBar from "./LeftSideBar";



const Login = (props) => {
  const classes = formStyles();
  const history = useHistory();
  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.root}>
      <LeftSideBar />

      <Grid item xs={8} className={classes.rightSideBar}>
        <Grid container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              className={classes.topHeader}>
          <Typography color={"secondary"}>Don't Have an Account?</Typography>
          <Button
              variant="outlined"
              className={classes.loginButton}
              color={"primary"}
              onClick={() => history.push("/register")}>
            Register
          </Button>
        </Grid>

        <Grid>
          <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center">
            <form onSubmit={handleLogin}>
              <Grid>
                <Typography variant="h5" className={classes.formHeader}>Welcome back!</Typography>

                <Grid>
                  <FormControl margin="normal" required>
                    <TextField
                      aria-label="username"
                      label="Username"
                      name="username"
                      type="text"
                    />
                  </FormControl>
                </Grid>
                <FormControl margin="normal" required>
                  <TextField
                    label="password"
                    aria-label="password"
                    type="password"
                    name="password"
                  />
                </FormControl>

                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                  <Button type="submit" variant="contained" size="large" color="primary" className={classes.formButton}>
                    Login
                  </Button>
                </Grid>

              </Grid>
            </form>
          </Grid>
        </Grid>

      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
