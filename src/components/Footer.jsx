import { Col, Container, Row } from "react-bootstrap"


const Footer = () => {

  const currentYear = new Date(Date.now())

  return (
    <footer className="py-2 mt-4">
      <Container>
        <Row>
          <Col className="text-center text-light-emphasis">Code Shop Pro, Copyright &copy; {currentYear.getFullYear()}, All rights Reserved</Col>
        </Row>
      </Container>
    </footer>
  )
}
export default Footer