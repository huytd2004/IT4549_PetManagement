import { useRoutes } from "react-router-dom";
import { Routes } from "../../Routes";
function AllRoutes (){
    const element = useRoutes(Routes);
    return (
        <>
        {element}
        </>
    )
}
export default AllRoutes;