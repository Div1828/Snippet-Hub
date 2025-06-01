import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/ui/Layout.tsx";
import Homepage from "./pages/Homepage.tsx";
import AddSnip from "./pages/AddSnip.tsx";
import Categories from "./pages/Categories.tsx";
import View from "./pages/View.tsx";

import type { JSX } from "react";

const App = (): JSX.Element => {
  return (
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/addsnip" element={<AddSnip />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/view/:id" element={<View />} /> 
          </Routes>
        </Layout>
      </BrowserRouter>
  );
};

export default App;