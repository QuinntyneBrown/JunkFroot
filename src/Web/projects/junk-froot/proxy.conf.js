module.exports = {
  "/api": {
    target: process.env["services__api-gateway__https__0"]
         || process.env["services__api-gateway__http__0"]
         || "https://localhost:5100",
    secure: false,
    changeOrigin: true,
  }
};
