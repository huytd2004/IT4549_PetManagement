import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../../service/user.service';
import { useNavigate } from "react-router-dom";
import { setCookie } from '../../helper/cookies.helper';
import { ckeckLogin } from "../../Action/login"
import { useDispatch } from "react-redux";
const theme = createTheme();

const Login = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[2].value;
    console.log(email, password)
    const respons = await login(email, password);
    console.log(respons);
    if (respons.length > 0) {
      setCookie("id", respons[0].id, 1);
      setCookie("name", respons[0].name, 1);
      setCookie("email", respons[0].email, 1);
      setCookie("token", respons[0].token, 1);
      setCookie("role", respons[0].role, 1)
      dispatch(ckeckLogin(true));

      const role = respons[0].role;

      switch (role) {
        case "admin":
          navigator("/"); // hoặc "/dashboard"
          break;
        case "DOCTOR":
          navigator("/calendar");
          break;
        case "staff":
          navigator("/service/list");
          break;
        case "user":
          navigator("/pet");
          break;
        default:
          navigator("/"); // fallback
      }
    }
    else {
      alert("Sai tài khoản hoặc mật khẩu");
    }
    // const option = {
    //     userEmail:email,
    //     userPassword: password,
    // }
    // console.log(option)
    // Xử lý đăng nhập ở đây
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffcdd2', // Màu hồng nhạt
          backgroundImage: 'linear-gradient(45deg, #ffcdd2 0%, #f8bbd0 100%)', // Gradient màu hồng
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Đăng nhập
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={rememberMe}
                      color="primary"
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Nhớ mật khẩu"
                />
                <Link href="/forgot-password" variant="body2">
                  Quên mật khẩu?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#e91e63',
                  '&:hover': {
                    backgroundColor: '#d81b60',
                  },
                }}
              >
                Đăng nhập
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2">
                    Bạn chưa có tài khoản?{' '}
                    <Link href="/register" variant="body2" sx={{ color: '#e91e63' }}>
                      Đăng ký ngay
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;