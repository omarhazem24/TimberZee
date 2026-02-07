import { Container, Row, Col, Card } from 'react-bootstrap';

const AdminRevenuePage = () => {
    return (
        <Container className="mt-5">
            <h1 className="mb-4">TOTAL REVENUE</h1>
            <div className="bg-light p-5 rounded text-center mb-5">
                <h2 className="text-muted">Total Gross Revenue</h2>
                <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>
                    $12,450.00
                </div>
                <p className="text-muted">Since Platform Launch</p>
            </div>
            
            <Row>
                <Col md={6}>
                    <Card className="mb-4 border-0 shadow-sm p-3">
                         <h4>This Month</h4>
                         <div className="display-6">$4,200.00</div>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4 border-0 shadow-sm p-3">
                         <h4>Pending Orders</h4>
                         <div className="display-6">5</div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminRevenuePage;
