import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Reports from "../Pages/Reports";
import history from "./history";
import Login from "./login";
import TakeImage from "../Pages/takeImage";
import SignUp from "./Signup";

const PrivateRoutes = () => {
  let token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/" />;
};

function MyRoutes({ children }) {
  return (
    <Router history={history}>
      {children}
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/reports" element={<Reports />} exact />
          <Route path="/take-image" element={<TakeImage />} />
          <Route path="*" element={<Login />} exact />
        </Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Routes>
    </Router>
  );
}

export default MyRoutes;
