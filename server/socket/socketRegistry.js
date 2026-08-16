const studentSockets = new Map();

// Add a socket for a user
const addSocket = (userId, socketId) => {
  const existingSockets =
    studentSockets.get(userId) || new Set();

  existingSockets.add(socketId);

  studentSockets.set(userId, existingSockets);
};

// Remove a socket for a user
const removeSocket = (userId, socketId) => {
  const existingSockets =
    studentSockets.get(userId);

  if (!existingSockets) {
    return;
  }

  existingSockets.delete(socketId);

  if (existingSockets.size === 0) {
    studentSockets.delete(userId);
  }
};

// Get all sockets belonging to a user
const getUserSockets = (userId) => {
  return studentSockets.get(userId) || new Set();
};

module.exports = {
  addSocket,
  removeSocket,
  getUserSockets,
};