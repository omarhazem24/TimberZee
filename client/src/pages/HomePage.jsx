import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const userInfo =  localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const location = useLocation();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const keyword = new URLSearchParams(location.search).get('keyword') || '';
    const { data } = await axios.get(`/api/products?keyword=${keyword}`);
    setProducts(data);
  };

  const createProductHandler = () => {
      navigate('/admin/product/create');
  };

  useEffect(() => {
    fetchProducts();
  }, [location.search]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = {
           headers: {
            Authorization: `Bearer ${userInfo.token}`,
           }
        }
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts();
      } catch (error) {
        alert(error.message);
      }
    }
  };
  
  const addToCartHandler = (product) => {
       // Simple cart logic using localStorage
       let cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
       const existItem = cartItems.find((x) => x.product === product._id);
       
       if (existItem) {
         cartItems = cartItems.map((x) => x.product === existItem.product ? { ...existItem, qty: existItem.qty + 1 } : x);
       } else {
         cartItems.push({ ...product, product: product._id, qty: 1 });
       }
       
       localStorage.setItem('cartItems', JSON.stringify(cartItems));
       window.dispatchEvent(new Event('cartUpdated'));
       setShowToast(true);
  };

  // Admin Dashboard View
  if (userInfo && userInfo.role === 'admin') {
      return (
        <div className="admin-dashboard text-center mt-5">
            <h1 className="mb-5">ADMIN DASHBOARD</h1>
            <Row className="justify-content-center">
                <Col md={4} className="mb-4">
                    <Link to="/admin/product/create" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>+</div>
                                <Card.Title>CREATE ITEM</Card.Title>
                                <Card.Text>Add a new product to the store</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/admin/promotions" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>%</div>
                                <Card.Title>PROMOTIONS</Card.Title>
                                <Card.Text>Manage promo codes & discounts</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/admin/revenue" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>EGP</div>
                                <Card.Title>TOTAL REVENUE</Card.Title>
                                <Card.Text>View sales analytics</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>

            <h3 className="mt-5 text-start" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '2px' }}>CURRENT INVENTORY</h3>
             <Row className="mt-4 text-start">
                    {products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                        <Card 
                            className="h-100 border-0 shadow product-card-hover" 
                            style={{ overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '100%', backgroundColor: '#f8f9fa' }}>
                                <Card.Img 
                                    variant="top" 
                                    src={product.image} 
                                    onError={(e) => {
                                      e.target.onerror = null; 
                                      e.target.src = "https://placehold.co/600x600?text=No+Image";
                                    }}
                                    style={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        left: 0, 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover'
                                    }} 
                                />
                                <div 
                                    className="position-absolute top-0 end-0 p-2"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteHandler(product._id); }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '35px', height: '35px' }}>
                                        <i className="fas fa-trash text-danger"></i>
                                    </div>
                                </div>
                            </div>
                            <Card.Body className="d-flex flex-column">
                                <Card.Title as="h5" className="mb-1 text-uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                                    {product.name}
                                </Card.Title>
                                <Card.Text className="text-muted fw-bold mb-3">
                                    EGP {product.price}
                                </Card.Text>
                                
                                <div className="mt-auto">
                                     <Button 
                                        variant="dark" 
                                        className="btn-black btn-sm w-100 rounded-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCartHandler(product);
                                        }}
                                     >
                                        <i className="fas fa-shopping-bag me-2"></i>ADD TO CART
                                     </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    ))}
            </Row>
        </div>
      );
  }

  return (
    <>
      <div className="hero-banner">
         <h1 className="hero-title">NEW ARRIVALS</h1>
         <p className="hero-subtitle">SUMMER COLLECTION 2026</p>
         <Button className="btn-black">SHOP NOW</Button>
      </div>

      <Row className='align-items-center mb-4 mt-5'>
        <Col>
          <h2 style={{ fontFamily: 'var(--font-heading)', letterSpacing: '2px' }}>LATEST DROPS</h2>
        </Col>
        {userInfo && userInfo.role === 'admin' && (
          <Col className='text-end'>
            <Button className='btn-black' onClick={createProductHandler}>
              + CREATE PRODUCT
            </Button>
          </Col>
        )}
      </Row>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
            <Card 
                className="h-100 border-0 shadow product-card-hover" 
                style={{ overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate(`/product/${product._id}`)}
            >
                <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '100%', backgroundColor: '#f8f9fa' }}>
                    <Card.Img 
                        variant="top" 
                        src={product.image} 
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://placehold.co/600x600?text=No+Image";
                        }}
                        style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                        }} 
                    />
                </div>
                <Card.Body className="d-flex flex-column">
                    <Card.Title as="h5" className="mb-1 text-uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                        {product.name}
                    </Card.Title>
                    <Card.Text className="text-muted fw-bold mb-3">
                        EGP {product.price}
                    </Card.Text>
                    
                    <div className="mt-auto">
                            <Button 
                            variant="dark" 
                            className="btn-black btn-sm w-100 rounded-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCartHandler(product);
                            }}
                            >
                            <i className="fas fa-shopping-bag me-2"></i>ADD TO CART
                            </Button>
                    </div>
                </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <ToastContainer className="p-3" position="top-end" style={{ zIndex: 9999, position: 'fixed' }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="dark">
          <Toast.Header closeButton={false} className="d-flex justify-content-between">
            <img
              src="/images/z-logo.png"
              className="rounded me-2"
              alt=""
              style={{ height: '20px' }}
            />
            <strong className="me-auto text-dark">TemberZee</strong>
            <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
          </Toast.Header>
          <Toast.Body className="text-white">
            Added to cart successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default HomePage;
