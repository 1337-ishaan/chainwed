import { useSnapshot } from 'valtio';
import { RouteProps, Route, Navigate } from 'react-router-dom';

import { state } from 'state';

const ProtectedRoute = (props: RouteProps): JSX.Element => {
  const snap = useSnapshot(state);
  return snap.isWalletConnected ? <Route {...props} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
