import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';

const AdminPromotionsPage = () => {
    return (
        <Container className="mt-5">
            <h1 className="mb-4">PROMOTIONS & CODES</h1>
            <Row>
                <Col md={4}>
                    <Card className="p-3 border-0 shadow-sm mb-4">
                        <h4>Create New Code</h4>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Promo Code</Form.Label>
                                <Form.Control type="text" placeholder="e.g. SUMMER2026" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Discount %</Form.Label>
                                <Form.Control type="number" placeholder="e.g. 20" />
                            </Form.Group>
                             <div className="d-grid">
                                <Button className="btn-black">CREATE CODE</Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
                <Col md={8}>
                     <Card className="p-3 border-0 shadow-sm">
                        <h4>Active Codes</h4>
                        <Table striped bordered hover responsive className="mt-3">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Discount</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>WELCOME10</td>
                                    <td>10%</td>
                                    <td className="text-success">Active</td>
                                    <td><Button variant="danger" size="sm">Deactivate</Button></td>
                                </tr>
                                <tr>
                                    <td>VIP50</td>
                                    <td>50%</td>
                                    <td className="text-secondary">Expired</td>
                                    <td><Button variant="danger" size="sm" disabled>Deactivate</Button></td>
                                </tr>
                            </tbody>
                        </Table>
                     </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPromotionsPage;
