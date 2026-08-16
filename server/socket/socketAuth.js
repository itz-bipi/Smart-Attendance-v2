const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(
        new Error("Authentication required")
      );
    }

    const cookies = cookieHeader
      .split(";")
      .reduce((acc, cookie) => {
        const [key, ...value] = cookie.trim().split("=");

        acc[key] = decodeURIComponent(value.join("="));

        return acc;
      }, {});

    const token = cookies.accessToken;

    if (!token) {
      return next(
        new Error("Authentication token not found")
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.user = decoded;

    next();
  } catch (error) {
    console.error(
      "Socket authentication error:",
      error.message
    );

    next(new Error("Socket authentication failed"));
  }
};

module.exports = socketAuth;