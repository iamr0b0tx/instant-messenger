import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import { register } from "./store/utils/thunkCreators";
import leftSideBarImg from "./assets/leftSideBarImg.png";
import leftSideBarSVG from "./assets/leftSideBarSVG.svg";

const useStyles = makeStyles((theme) => ({
  formHeader: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(10),
  },
  createButton: {
    marginLeft: "25px",
  },
  loginButton: {
    backgroundColor: "white",
    marginLeft: theme.spacing(2),
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    border: "none"
  },
  signUpForm: {
    backgroundColor: "green",
  },
  topHeader: {
    backgroundColor: "yellow",
    padding: "15px 50px"
  },
  leftSideBar: {
    '& .shade': {
      '& img':{
        marginBottom: theme.spacing(5)
      },
      '& .shadeText': {
        color: "white",
        fontSize: "xx-large",
        textAlign: "center",
      },

      height:"100%",
      width:"100%",
      opacity: 0.85,
      background: 'linear-gradient(to bottom, #3A8DFF 70%, #86B9FF 100%)',
    },

    backgroundImage: `url('${leftSideBarImg}')`,
    backgroundRepeat: "no-repeat",
    backgroundColor: '#86B9FF',
  },
  rightSideBar: {
    backgroundColor: "blue",
    height: "100%"
  },
  media: {
    maxWidth: "100%",
  },
  root: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(5),
      width: theme.spacing(50),
    },
    '& .MuiButton-label': {
      height: theme.spacing(5),
      width: theme.spacing(13),
    },

    height: "100vh",
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.root}>
      <Grid item xs={3} className={classes.leftSideBar}>
        <Grid
            className="shade"
            container
            direction="row"
            justifyContent="center"
            alignItems="center">

          <Grid container justifyContent="space-around" xs={9}>
            <img
              className={classes.media}
              src={leftSideBarSVG}
              alt={"bubble"}
            />
            <Typography className={"shadeText"}>Converse with anyone in any language</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={9} className={classes.rightSideBar}>
        <Grid container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              className={classes.topHeader}>

          <Typography color={"secondary"}>Already Have an Account?</Typography>
          <Button
              variant="outlined"
              className={classes.loginButton}
              color={"primary"}
              onClick={() => history.push("/login")}>
            Login
          </Button>
        </Grid>
        <Grid>
          <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              className={classes.signUpForm}>

            <form onSubmit={handleRegister}>
              <Grid>
                <Typography variant="h5" className={classes.formHeader}>Create an account</Typography>

                <Grid>
                  <FormControl>
                    <TextField
                      aria-label="username"
                      label="Username"
                      name="username"
                      type="text"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControl>
                    <TextField
                      label="E-mail address"
                      aria-label="e-mail address"
                      type="email"
                      name="email"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControl error={!!formErrorMessage.confirmPassword}>
                    <TextField
                      aria-label="password"
                      label="Password"
                      type="password"
                      inputProps={{ minLength: 6 }}
                      name="password"
                      required
                    />
                    <FormHelperText>
                      {formErrorMessage.confirmPassword}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControl error={!!formErrorMessage.confirmPassword}>
                    <TextField
                      label="Confirm Password"
                      aria-label="confirm password"
                      type="password"
                      inputProps={{ minLength: 6 }}
                      name="confirmPassword"
                      required
                    />
                    <FormHelperText>
                      {formErrorMessage.confirmPassword}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center">
                  <Button type="submit" variant="contained" color="primary" className={classes.createButton}>
                    Create
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
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
