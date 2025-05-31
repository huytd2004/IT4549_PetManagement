import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAllCookie } from "../../helper/cookies.helper";
import { useDispatch } from "react-redux";
import { ckeckLogin } from "../../Action/login";

function Logout(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        deleteAllCookie();
        dispatch(ckeckLogin(false));//cap nhat trang thai dang nhap
        navigate("/login");//dieu huong ve trang dang nhap
    },[dispatch,navigate]);

    return null;
        
    
}
export default Logout;