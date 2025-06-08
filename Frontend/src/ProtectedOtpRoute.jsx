import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";



function ProtectedOtpRoute({}){
    const {isOtpSend}=useSelector((state)=>state.app)

    return isOtpSend ? <Outlet/> : <Navigate to={'/'} />;
}

export default ProtectedOtpRoute;