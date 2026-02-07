import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import CompletionPage from './pages/CompletionPage';
import ProfilePage from './pages/ProfilePage';
import ProductPage from './pages/ProductPage';
import AdminPromotionsPage from './pages/AdminPromotionsPage';
import AdminRevenuePage from './pages/AdminRevenuePage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import OrderListPage from './pages/OrderListPage';
import OrderPage from './pages/OrderPage';

const AppContent = () => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideHeader && <Header />}
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/product/:id' element={<ProductPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/completion' element={<CompletionPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/orders' element={<OrderListPage />} />
            <Route path='/order/:id' element={<OrderPage />} />
            
            <Route path='/admin/promotions' element={<AdminPromotionsPage />} />
            <Route path='/admin/revenue' element={<AdminRevenuePage />} />
            <Route path='/admin/product/create' element={<CreateProductPage />} />
            <Route path='/admin/product/:id/edit' element={<EditProductPage />} />
          </Routes>
        </Container>
      </main>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
