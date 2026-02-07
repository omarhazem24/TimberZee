import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Alert, Container } from 'react-bootstrap';
import axios from 'axios';

const CompletionPage = () => {
    const [searchParams] = useSearchParams();
    
    // Paymob params
    const success = searchParams.get('success');
    const paymobId = searchParams.get('id'); // Transaction ID
    const amountCents = searchParams.get('amount_cents');
    const orderId = searchParams.get('order'); // Paymob Order ID

    const [status, setStatus] = useState('loading');
    const [errorMsg, setErrorMsg] = useState('');
    const processedRef = useRef(false); 

    useEffect(() => {
        if (processedRef.current) return;
        
        const createOrder = async () => {
             const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
             const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

             // Check success flag string from url
             if (success === 'true' && cartItems.length > 0 && userInfo) {
                 try {
                     processedRef.current = true; // Mark as processing
                     
                     // Calculate prices locally for record
                     const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
                     const shippingPrice = itemsPrice > 100 ? 0 : 10;
                     const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
                     const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

                     const config = {
                         headers: {
                             'Content-Type': 'application/json',
                             Authorization: `Bearer ${userInfo.token}`,
                         },
                     };

                     const orderData = {
                         orderItems: cartItems,
                         shippingAddress: userInfo.address || {
                             street: 'N/A', city: 'N/A', state: 'N/A', zip: 'N/A', country: 'N/A'
                         },
                         paymentMethod: 'Paymob',
                         itemsPrice,
                         shippingPrice,
                         taxPrice,
                         totalPrice,
                         paymentResult: {
                             id: paymobId,
                             status: 'succeeded',
                             email_address: userInfo.email,
                             update_time: new Date().toISOString()
                         },
                         isPaid: true,
                         paidAt: new Date().toISOString(),
                     };

                     // Create Order in Database
                     const { data } = await axios.post('/api/orders', orderData, config);
                     
                     // Mark as paid immediately since we rely on `success=true` callback
                     await axios.put(`/api/orders/${data._id}/pay`, {
                          id: paymobId,
                          status: 'succeeded',
                          update_time: new Date().toISOString(),
                          email_address: userInfo.email
                     }, config);

                     setStatus('success');
                     localStorage.removeItem('cartItems');
                     
                 } catch (error) {
                     console.error(error);
                     setErrorMsg(error.response?.data?.message || error.message);
                     setStatus('error');
                 }
             } else if (success === 'false') {
                 setStatus('failed');
             } else {
                 // Already processed or invalid check
                 setStatus('success');
             }
        };

        if (success !== null) {
            createOrder();
        }
    }, [success, paymobId, userInfo]); // Add userInfo to deps in clean code, accessing from localStorage inside effect is safer

    return (
        <Container className='mt-5 text-center'>
            <h1>Payment Status</h1>
            {status === 'loading' && <Alert variant='info'>Finalizing your order...</Alert>}
            
            {status === 'success' && (
                <Alert variant='success'>
                    Payment Succeeded! Your order has been placed. <br/>
                    Transaction ID: {paymobId}
                </Alert>
            )}

            {status === 'failed' && (
                <Alert variant='warning'>
                    Payment Failed. Please try again.
                </Alert>
            )}
            
            {status === 'error' && (
                <Alert variant='danger'>
                    Payment Succeeded but Order Creation Failed: {errorMsg} <br/>
                    Please contact support with Transaction ID: {paymobId}
                </Alert>
            )}

            <Link to='/orders' className='btn btn-black'>View My Orders</Link>
        </Container>
    )
}

export default CompletionPage;
