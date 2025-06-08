import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute() {
  const isLogin = useSelector((state) => state.app.isLogin);

  return isLogin ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
