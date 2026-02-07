import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  
  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const address = { street, city, state, zip, country };

      const { data } = await axios.post(
        '/api/auth/signup',
        { firstName, lastName, username, email, phoneNumber, password, address },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background Logo */}
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '900px',
            backgroundImage: "url('/images/z-logo-background.png')",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            opacity: 0.3, 
            zIndex: 0,
            pointerEvents: 'none'
        }}></div>

      <Container style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <h1 className='text-center mb-5' style={{ fontWeight: '800', fontSize: '2.5rem', letterSpacing: '2px' }}>CREATE ACCOUNT</h1>
          <Form onSubmit={submitHandler}>
            <Row>
                <Col md={6}>
                    <Form.Group controlId='firstName' className='mb-3'>
                    <Form.Label className='fw-bold small text-uppercase'>First Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='First Name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className='p-3 border-dark rounded-0'
                        style={{ backgroundColor: 'transparent' }}
                    ></Form.Control>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId='lastName' className='mb-3'>
                    <Form.Label className='fw-bold small text-uppercase'>Last Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className='p-3 border-dark rounded-0'
                        style={{ backgroundColor: 'transparent' }}
                    ></Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group controlId='username' className='mb-3'>
              <Form.Label className='fw-bold small text-uppercase'>Username</Form.Label>
              <Form.Control
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className='p-3 border-dark rounded-0'
                style={{ backgroundColor: 'transparent' }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email' className='mb-3'>
              <Form.Label className='fw-bold small text-uppercase'>Email Address (Verification Required)</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='p-3 border-dark rounded-0'
                style={{ backgroundColor: 'transparent' }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='phoneNumber' className='mb-3'>
              <Form.Label className='fw-bold small text-uppercase'>Phone Number</Form.Label>
              <Form.Control
                type='tel'
                placeholder='Enter phone number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className='p-3 border-dark rounded-0'
                style={{ backgroundColor: 'transparent' }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password' className='mb-3'>
              <Form.Label className='fw-bold small text-uppercase'>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='p-3 border-dark rounded-0'
                style={{ backgroundColor: 'transparent' }}
              ></Form.Control>
            </Form.Group>

            <h4 className='mt-4 mb-3 text-uppercase fw-bold h5'>Shipping Address</h4>
            <Form.Group controlId='street' className='mb-3'>
              <Form.Label className='fw-bold small text-uppercase'>Street</Form.Label>
              <Form.Control 
                type='text' 
                value={street} 
                onChange={(e) => setStreet(e.target.value)} 
                required 
                className='p-3 border-dark rounded-0'
                style={{ backgroundColor: 'transparent' }}
              />
            </Form.Group>
            
            <Row>
                <Col md={6}>
                    <Form.Group controlId='city' className='mb-3'>
                      <Form.Label className='fw-bold small text-uppercase'>City</Form.Label>
                      <Form.Control 
                        type='text' 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        required 
                        className='p-3 border-dark rounded-0'
                        style={{ backgroundColor: 'transparent' }}
                      />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId='state' className='mb-3'>
                      <Form.Label className='fw-bold small text-uppercase'>State</Form.Label>
                      <Form.Control 
                        type='text' 
                        value={state} 
                        onChange={(e) => setState(e.target.value)} 
                        required 
                        className='p-3 border-dark rounded-0'
                        style={{ backgroundColor: 'transparent' }}
                      />
                    </Form.Group>
                </Col>
            </Row>
             <Row>
                <Col md={6}>
                    <Form.Group controlId='zip' className='mb-3'>
                      <Form.Label className='fw-bold small text-uppercase'>Zip Code</Form.Label>
                      <Form.Control 
                        type='text' 
                        value={zip} 
                        onChange={(e) => setZip(e.target.value)} 
                        required 
                        className='p-3 border-dark rounded-0'
                        style={{ backgroundColor: 'transparent' }}
                      />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId='country' className='mb-3'>
                      <Form.Label className='fw-bold small text-uppercase'>Country</Form.Label>
                      <Form.Control 
                        type='text' 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)} 
                        required 
                        className='p-3 border-dark rounded-0'
                        style={{ backgroundColor: 'transparent' }}
                      />
                    </Form.Group>
                </Col>
            </Row>

            <div className='d-grid gap-2 mt-5'>
                <Button type='submit' className='btn-black text-uppercase' size='lg' style={{ borderRadius: '0', padding: '15px' }}>
                    Create Account
                </Button>
            </div>
          </Form>

          <Row className='py-4'>
            <Col className='text-center'>
              <span className="text-muted text-uppercase small" style={{ fontSize: '0.9rem' }}>Already have an account?</span> 
              <Link 
                to='/login'
                className="text-black text-decoration-none border-bottom border-dark pb-1 fw-bold text-uppercase small ms-2"
              >
                Sign In
              </Link>
            </Col>
          </Row>
      </Container>
    </div>
  );
};

export default SignupPage;
