import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, isAllowed }) {
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}