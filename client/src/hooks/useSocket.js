import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../services/socketService';
import {
  addLiveAttendee,
  setStudentActiveSessionFromSocket,
} from '../redux/slices/attendanceSlice';
import { addNotification } from '../redux/slices/uiSlice';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();

    // Listener for students when teacher starts session
    const handleSessionStarted = (data) => {
      console.log('Real-time attendance session received:', data);
      dispatch(setStudentActiveSessionFromSocket(data));
      dispatch(
        addNotification({
          title: 'Live Attendance Started!',
          message: 'An attendance session was just started for your subject. Scan or verify now!',
          type: 'info',
          data,
        })
      );
    };

    // Listener for session room join confirmation
    const handleRoomJoined = (data) => {
      console.log('Joined attendance room:', data);
    };

    // Listener for attendance errors
    const handleAttendanceError = (data) => {
      console.warn('Socket attendance error:', data);
    };

    // Listener for live attendee updates (if broadcasted in room)
    const handleAttendeeMarked = (attendee) => {
      dispatch(addLiveAttendee(attendee));
    };

    socket.on('attendance-session-started', handleSessionStarted);
    socket.on('attendance-room-joined', handleRoomJoined);
    socket.on('attendance-error', handleAttendanceError);
    socket.on('student-marked-present', handleAttendeeMarked);

    return () => {
      socket.off('attendance-session-started', handleSessionStarted);
      socket.off('attendance-room-joined', handleRoomJoined);
      socket.off('attendance-error', handleAttendanceError);
      socket.off('student-marked-present', handleAttendeeMarked);
    };
  }, [isAuthenticated, role, user, dispatch]);
};

export default useSocket;
