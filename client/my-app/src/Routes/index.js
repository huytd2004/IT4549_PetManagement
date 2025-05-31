import Calendar from "../Apps/calendar";
import Dashboard from "../Apps/dashboard";
import FAQ from "../Apps/faq";
import LayoutAdmin from "../Apps/Layout/layoutAdmin";
import Login from "../Apps/Login";
import Pet from "../Apps/Pet";
import Register from "../Apps/Register";
import ServiceHistory from "../Apps/service/service-history";
import ServiceList from "../Apps/service/service-list";
import ServicePrice from "../Apps/service/service-price";
import ServiceDetailPage from "../Apps/service/serviceDetailPage";
import ServiceRegister from "../Apps/service/serviceRegister";
import PrivateRoutes from "../components/privateRoutes";
import Logout from "../Apps/Logout";
import PetManage from "../Apps/Manage/pet.manage";
import StaffManage from "../Apps/Manage/staff.manage";
import CustomerManage from "../Apps/Manage/customer.manage";
import ServiceManage from "../Apps/Manage/service.manage";
import PetDetail from "../Apps/Pet/petDetail";
import AccommodationManage from "../Apps/StayManage";
import AccountManage from "../Apps/AccountManage";
import Appointments from "../Apps/Appointments";
import MedicalForm from "../Apps/Appointments/medicalForm";
export const Routes = [
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/",
        element: <LayoutAdmin />,
        children: [
            {
                element: <PrivateRoutes />,
                children: [
                    {
                        path: "/",
                        element: <Dashboard />,
                    },
                    {
                        path: "/pet",
                        element: <Pet />,
                    },
                    {
                        path:"/pet/:id",
                        element:<PetDetail/>
                    },
                    {
                        path: "/logout",
                        element: <Logout />,
                    },
                    {
                        path: "/service/list",
                        element: <ServiceList />,
                    },
                    {
                        path: "/service/history",
                        element: <ServiceHistory />,
                    },
                    {
                        path: "/service/price",
                        element: <ServicePrice />,
                    },
                    {
                        path: "/service/:id",
                        element: <ServiceDetailPage />,
                    },
                    {
                        path: "/service/register",
                        element: <ServiceRegister />,
                    },
                    {
                        path: "/faq",
                        element: <FAQ />,
                    },
                    {
                        path: "/calendar",
                        element: <Calendar />,
                    },
                    {
                        path:"/manage/pets",
                        element:<PetManage/>
                    },
                    {
                        path:"/manage/staff",
                        element:<StaffManage/>
                    },
                    {
                        path:"/manage/customers",
                        element:<CustomerManage/>
                    },
                    {
                        path:"/manage/service",
                        element:<ServiceManage/>
                    },
                    {
                        path:"/stay-manage",
                        element:<AccommodationManage/>
                    },
                    {
                        path:"/account-manage",
                        element:<AccountManage/>
                    },
                    {
                        path:"/appointments",
                        element:<Appointments/>
                    },
                    {
                        path:"/medical-form/:petId" ,
                        element:<MedicalForm/>
                    }
                ],
            },
        ],
    },
];
