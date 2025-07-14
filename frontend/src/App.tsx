import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Card,
  CardContent,
  Fade,
  Slide,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Link as LinkIcon,
  ContentCopy,
  Launch,
  AutoAwesome,
} from "@mui/icons-material";
import axios from "axios";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setIsLoading(true);

    if (!longUrl) {
      setError("Please enter a URL");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/shorturls", { url: longUrl });
      setShortUrl(response.data.shortLink);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "An error occurred");
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          animation: "float 20s ease-in-out infinite",
        }}
      />
      
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          <Fade in timeout={1000}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 6,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                overflow: "visible",
                position: "relative",
                width: "100%",
                maxWidth: 500,
              }}
            >
              {/* Decorative Elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  left: -10,
                  width: 60,
                  height: 60,
                  background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              >
                <AutoAwesome sx={{ color: "white", fontSize: 28 }} />
              </Box>

              <CardContent sx={{ p: 6 }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: "2rem", sm: "3rem" },
                    }}
                  >
                    URL Shortener
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "text.secondary",
                      mb: 4,
                      fontSize: "1.1rem",
                    }}
                  >
                    Transform long URLs into short, shareable links
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    label="Enter your long URL"
                    variant="outlined"
                    fullWidth
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "& fieldset": {
                          borderWidth: 2,
                          borderColor: "rgba(102, 126, 234, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(102, 126, 234, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                        },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      borderRadius: 3,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 30px rgba(102, 126, 234, 0.4)",
                      },
                      "&:disabled": {
                        background: "rgba(0,0,0,0.12)",
                        transform: "none",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {isLoading ? "Shortening..." : "Shorten URL"}
                  </Button>
                </Box>

                {shortUrl && (
                  <Slide direction="up" in={!!shortUrl} mountOnEnter unmountOnExit>
                    <Box
                      sx={{
                        mt: 4,
                        p: 3,
                        background: "linear-gradient(45deg, #4ECDC4, #44A08D)",
                        borderRadius: 3,
                        color: "white",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(255,255,255,0.1)",
                          backdropFilter: "blur(5px)",
                        }}
                      />
                      <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <AutoAwesome /> Your shortened URL:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            background: "rgba(255,255,255,0.2)",
                            p: 2,
                            borderRadius: 2,
                            mb: 2,
                          }}
                        >
                          <Link
                            href={shortUrl}
                            target="_blank"
                            rel="noopener"
                            sx={{
                              color: "white",
                              textDecoration: "none",
                              wordBreak: "break-all",
                              fontWeight: 500,
                              flex: 1,
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {shortUrl}
                          </Link>
                          <IconButton
                            onClick={handleCopy}
                            sx={{
                              color: "white",
                              backgroundColor: "rgba(255,255,255,0.2)",
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.3)",
                              },
                            }}
                          >
                            <ContentCopy />
                          </IconButton>
                          <IconButton
                            component="a"
                            href={shortUrl}
                            target="_blank"
                            rel="noopener"
                            sx={{
                              color: "white",
                              backgroundColor: "rgba(255,255,255,0.2)",
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.3)",
                              },
                            }}
                          >
                            <Launch />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Slide>
                )}

                {error && (
                  <Slide direction="up" in={!!error} mountOnEnter unmountOnExit>
                    <Alert
                      severity="error"
                      sx={{
                        mt: 3,
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          fontSize: "1.5rem",
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  </Slide>
                )}
              </CardContent>
            </Card>
          </Fade>
        </Box>
      </Container>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          URL copied to clipboard!
        </Alert>
      </Snackbar>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </Box>
  );
}

export default App;
