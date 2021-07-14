import leftSideBarImg from "./assets/leftSideBarImg.png";
import { makeStyles } from "@material-ui/core/styles";

const formStyles = makeStyles((theme) => ({
  formHeader: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(10),
  },
  formButton: {
    marginLeft: "25px",
  },
  loginButton: {
    backgroundColor: "white",
    marginLeft: theme.spacing(2),
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    border: "none"
  },
  topHeader: {
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

export default formStyles;