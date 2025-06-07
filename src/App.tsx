import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import { useAuth } from "./logic/authContext.tsx";
import Layout from "./components/ui/Layout.tsx";
import Homepage from "./pages/Homepage.tsx";
import AddSnip from "./pages/AddSnip.tsx";
import Categories from "./pages/Categories.tsx";
import View from "./pages/View.tsx";
import Login from "./pages/Login.tsx"
import Signup from "./pages/Signup.tsx"
import PrivateRoute from "./components/PrivateRoute";

import type { JSX } from "react";

const App = (): JSX.Element => {

  const { loading } = useAuth();

  if (loading) {
    return <Spinner size="xl" />; 
  }

  return (
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/homepage" element={<PrivateRoute><Homepage /></PrivateRoute>} />
            <Route path="/addsnip" element={<PrivateRoute><AddSnip /></PrivateRoute>} />
            <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
            <Route path="/view/:id" element={<PrivateRoute><View /></PrivateRoute>} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </BrowserRouter>
  );
};

export default App;