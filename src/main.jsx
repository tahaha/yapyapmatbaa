import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import { getCurrentProductSlug } from './routing/sitePaths.js';
import './index.css';

const productSlug = getCurrentProductSlug();
const isProductsPage = /\/urunler\/?$/.test(window.location.pathname);
const Page = productSlug ? () => <ProductDetailPage slug={productSlug} /> : isProductsPage ? ProductsPage : App;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
