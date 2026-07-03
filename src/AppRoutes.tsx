import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallBackPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoutes";

const AppRoutes = () => {
  return (
    // all our routes will be defined here, keeping them grouped in a single file for better maintainability
    <Routes>
      <Route path='/' element={<Layout showHero={true}><HomePage /></Layout>} />
      <Route path='/auth-callback' element={<AuthCallbackPage />} />
      <Route element={<ProtectedRoute />} >
        <Route path='/user-profile' element={<Layout><UserProfilePage /></Layout>} />
      </Route>
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;