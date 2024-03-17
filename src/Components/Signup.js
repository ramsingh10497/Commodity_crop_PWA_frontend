import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const validateFields = () => {
    const errors = {};
    if (!name) {
      errors["name"] = "Name is Required!";
    }
    if (!email) {
      errors["email"] = "Email is Required!";
    }
    if (!password) {
      errors["password"] = "Password is Required!";
    }
    return errors;
  };

  const sendData = () => {
    const payload = {
      name,
      email,
      password,
    };
    setLoader(true);
    axios
      .post(`${BACKEND_URL}/api/users/create`, payload, {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      })
      .then(({ data }) => {
        setLoader(false);
        if (data.success) {
          toast.success(data.message);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.data));
          navigate("/reports");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        setLoader(false);
        toast.error(err.message || "Something went wrong");
      });
  };

  const handleSubmit = () => {
    const errors = validateFields();
    if (Object.keys(errors).length == 0) {
      sendData();
    }
    setErrors(errors);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              SignUp
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                autoFocus
              />
              {errors.email && (
                <Typography variant="p" sx={{ color: "red", fontSize: "12px" }}>
                  {errors.email}
                </Typography>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <Typography variant="p" sx={{ color: "red", fontSize: "12px" }}>
                  {errors.email}
                </Typography>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                autoComplete="current-password"
              />
              {errors.password && (
                <Typography variant="p" sx={{ color: "red", fontSize: "12px" }}>
                  {errors.password}
                </Typography>
              )}
              <LoadingButton
                loading={loader}
                loadingPostition="start"
                variant="contained"
                fullWidth
                onClick={handleSubmit}
              >
                SignUp
              </LoadingButton>
            </Box>
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
