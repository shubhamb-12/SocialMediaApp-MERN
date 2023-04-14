import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Form from "./Form.jsx";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        backgroundColor={theme.palette.background.alt}
        width={"100%"}
        padding={"1rem 6%"}
        textAlign={"center"}
      >
        <Typography fontWeight={"bold"} fontSize={"32px"} color={"primary"}>
          Sociopedia
        </Typography>
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        padding={"2rem"}
        m={"2rem auto"}
        borderRadius={"1.5rem"}
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight={"500"} variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Sociopedia, the Social Media for Sociopaths
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
