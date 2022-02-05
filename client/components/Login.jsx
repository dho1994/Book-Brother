import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContextProvider";
import { signInWithEmail, googleSignIn, makeNewSession } from "../firebase.js";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import axios from "axios";
import { BrowserRouter, Link, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import IconButton from "@mui/material/IconButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { value, setValue } = useContext(GlobalContext);
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      await makeNewSession(email, password);
      setValue(email);
      history.push("/home");
    } catch (err) {
      console.log(err, "err from firebase");
    }
  };

  const handleLoginForGoogle = async (e) => {
    e.preventDefault();
    try {
      const email = await googleSignIn();
      const result = await axios({
        method: "POST",
        url: "/account",
        data: {
          email: email,
          books: [],
        },
      });
      setValue(email);
      history.push("/home");
    } catch (err) {
      console.log(err, "from handleLoginForGoogle");
    }
  };

  return (
    <div className="login">
      <img src="./assets/Logo.png" />
      <div>
        <form type="submit" onSubmit={loginUser}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', p: '0', border: '1px solid #212121', padding: '2vh', borderRadius: '5px 5px 5px', boxShadow: '0px 0px 3px 2px rgba(0, 0, 0, 0.2)', mt: '1rem', width: '35vh', mixWidth: '10px', height: '45vh', background: 'rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '3vh' }} > Sign In</h2>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <FormControl sx={{ m: 1, width: '35vh', mixWidth: '8px' }} variant="standard" required>
                <InputLabel htmlFor="email" style={{ fontSize: '2vh' }}>Email</InputLabel>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                    </InputAdornment>
                  }
                  required
                />
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", mb: "2em" }}>
              <FormControl
                sx={{ m: 1, width: "35vh", minWidth: "8px" }}
                variant="standard"
                required
              >
                <InputLabel htmlFor="password" style={{ fontSize: "1.5vh" }}>
                  Password
                </InputLabel>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                />
              </FormControl>
            </Box>
            <Button variant='contained' style={{ fontSize: '1.5vh', margin: "0 0 1em 0" }}
              sx={{
                backgroundColor: '#11A797',
                ':hover': {
                  backgroundColor: '#70baa4',
                },
              }}
              type='submit'
              onSubmit={loginUser}>
              Sign In
            </Button>
            <Button variant='contained' style={{ backgroundColor: '#fff', fontSize: '1.5vh', margin: "0 0 1em 0", color: '#000' }} type='submit' onClick={handleLoginForGoogle}>
              <img
                src="https://img.icons8.com/fluency/48/000000/google-logo.png"
                alt="google icon"
                height="30em"
              />
              &nbsp;
              Sign in with Google
            </Button>
            <div style={{ margin: "2em 0 1em 0", fontSize: "2vh" }}>
              Need to create an account? &nbsp;
              <Link to="/signup">Sign Up</Link>
            </div>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default Login;
