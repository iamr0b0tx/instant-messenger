import React  from "react";
import {
  Grid,
  Typography,
} from "@material-ui/core";
import leftSideBarSVG from "./assets/leftSideBarSVG.svg";
import formStyles from "./FormStyles";



const LeftSideBar = (props) => {
  const classes = formStyles();

  return (
      <Grid container item xs={4} className={classes.leftSideBar}>
        <Grid
            className="shade"
            container
            direction="row"
            justifyContent="center"
            alignItems="center">
          <Grid container item justifyContent="space-around" xs={9}>
            <img
              className={classes.media}
              src={leftSideBarSVG}
              alt={"bubble"}
            />
            <Typography className={"shadeText"}>Converse with anyone in any language</Typography>
          </Grid>
        </Grid>
      </Grid>
  );
};

export default LeftSideBar;
