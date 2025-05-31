import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/ui/ui/Layout.tsx";
import Homepage from "./pages/Homepage.tsx";
import AddSnip from "./pages/AddSnip.tsx";

import type { JSX } from "react";
import Categories from "./pages/Categories.tsx";


const App = () : JSX.Element => {
  return (
    <>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/addsnip" element={<AddSnip />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </>
  )
}

export default App