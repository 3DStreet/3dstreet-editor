import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuthContext();

  if (!currentUser) {
    return <Navigate to={'/'} />;
  }

  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export { ProtectedRoute };
