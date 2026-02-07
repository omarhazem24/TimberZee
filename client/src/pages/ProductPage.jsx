import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form, Container, Badge } from 'react-bootstrap';
import axios from 'axios';

const ProductPage = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      if (data.image) setActiveImage(data.image);
      if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
       if (!userInfo) {
           navigate('/login');
           return;
       }
       
       let cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
       const existItem = cartItems.find((x) => 
           x.product === product._id && 
           x.size === selectedSize && 
           x.color === selectedColor
       );
       
       if (existItem) {
         cartItems = cartItems.map((x) => 
            (x.product === existItem.product && x.size === existItem.size && x.color === existItem.color)
            ? { ...existItem, qty: existItem.qty + qty } 
            : x
         );
       } else {
         cartItems.push({ 
             ...product, 
             product: product._id, 
             qty: qty, 
             size: selectedSize, 
             color: selectedColor,
             image: activeImage || product.image 
         });
       }
       
       localStorage.setItem('cartItems', JSON.stringify(cartItems));
       window.dispatchEvent(new Event('cartUpdated')); 
       navigate('/cart');
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '1400px' }}>
      <Button variant="link" className='text-dark mb-2 p-0 text-decoration-none' onClick={() => navigate('/')}>
        <i className="fas fa-chevron-left fa-lg"></i>
      </Button>
      
      <Row>
        {/* Thumbnails Column */}
        <Col md={1} className="d-none d-md-flex flex-column gap-2">
            {product.images && product.images.length > 0 ? (
                product.images.map((img, index) => (
                    <div 
                        key={index} 
                        className="border rounded p-1" 
                        style={{ 
                            cursor: 'pointer', 
                            borderColor: activeImage === img ? '#000' : '#ddd',
                            borderWidth: activeImage === img ? '2px' : '1px'
                        }}
                        onMouseEnter={() => setActiveImage(img)}
                        onClick={() => setActiveImage(img)}
                    >
                         <Image 
                            src={img} 
                            fluid 
                            onError={(e) => { e.target.src = "https://placehold.co/100" }} 
                        />
                    </div>
                ))
            ) : (
                // Fallback main image thumbnail
                product.image && (
                     <div className="border rounded p-1 border-dark" style={{ cursor: 'pointer' }}>
                         <Image src={product.image} fluid />
                    </div>
                )
            )}
        </Col>

        {/* Main Image Column */}
        <Col md={5}>
          <div className="position-relative">
             <Image 
                src={activeImage || product.image} 
                alt={product.name} 
                fluid 
                className="w-100" 
                style={{ minHeight: '400px', objectFit: 'contain', backgroundColor: '#fff' }}
             />
             <div className="position-absolute top-0 end-0 p-3">
                <Button variant="light" className="rounded-circle shadow-sm border">
                    <i className="fas fa-share-alt"></i>
                </Button>
             </div>
          </div>
        </Col>
        
        {/* Product Details Column */}
        <Col md={6} lg={5} className="ps-md-5">
            <div className="border-bottom pb-3 mb-3">
                <h1 className="mb-1" style={{ fontSize: '24px', fontWeight: '500', fontFamily: 'var(--font-body)' }}>{product.name}</h1>
                {userInfo && userInfo.role === 'admin' && (
                    <Button 
                        variant="outline-dark" 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                    >
                        <i className="fas fa-edit me-1"></i> Edit Product
                    </Button>
                )}
            </div>

            <div className="mb-3">
                <div className="d-flex align-items-start">
                    <span style={{ fontSize: '14px', position: 'relative', top: '5px' }}>EGP</span>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>{product.price}</span>
                    <span style={{ fontSize: '14px', position: 'relative', top: '5px' }}>00</span>
                </div>
                <div className="text-muted small mt-1">All prices Exclude VAT.</div>
            </div>

            <div className="mb-4" style={{ maxWidth: '400px' }}>
                
                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                    <div className="mb-3">
                        <span className="fw-bold d-block mb-2">Color: <span className="fw-normal">{selectedColor}</span></span>
                        <div className="d-flex gap-2 flex-wrap">
                            {product.colors.map((c, idx) => (
                                <Button 
                                    key={idx}
                                    variant={selectedColor === c ? 'dark' : 'outline-dark'}
                                    className="rounded-pill btn-sm px-3"
                                    onClick={() => setSelectedColor(c)}
                                >
                                    {c}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes */}
                 {product.sizes && product.sizes.length > 0 && (
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold fs-6">Size: <span className="fw-normal">{selectedSize}</span></Form.Label>
                        <Form.Select 
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="shadow-sm border-secondary"
                            style={{ backgroundColor: '#f0f2f2' }}
                        >
                            {product.sizes.map((s, idx) => (
                                <option key={idx} value={s}>{s}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                )}


                <Form.Group className="mb-3">
                     <Form.Label className="fw-bold fs-6">Quantity:</Form.Label>
                     <Form.Select 
                        value={qty} 
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="shadow-sm border-secondary w-50"
                         style={{ backgroundColor: '#f0f2f2' }}
                     >
                        {[...Array(10).keys()].map(x => (
                            <option key={x + 1} value={x + 1}>
                                {x + 1}
                            </option>
                        ))}
                     </Form.Select>
                </Form.Group>

                {product.countInStock > 0 ? (
                    <div className="d-grid gap-2">
                         <Button 
                            className="btn-black rounded-pill py-2" 
                            style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}
                            onClick={addToCartHandler}
                         >
                            Add to Cart
                        </Button>
                    </div>
                ) : (
                    <div className="text-danger fw-bold fs-4">Currently Unavailable</div>
                )}
            </div>

            <hr />
            
            <div className="mt-4">
                <h4 className="mb-3">About this item</h4>
                <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    {product.description || "Premium quality shoes designed for comfort and style."}
                </p>
            </div>

        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
