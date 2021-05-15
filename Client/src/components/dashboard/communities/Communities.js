import React from 'react'
import Container from 'react-bootstrap/Container';
import { yourCommunities } from "../Utils/YourCommunities"
import { suggestedCommunities } from "../Utils/SuggestedCommunities"
import CommunityCard from './CommunityCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../header/Header';
import SidePannel from '../sidepannel/SidePannel';

function Communities() {
    return (

        <>
            <Header />
            <div>
                <Container fluid>
                    <Row>
                        <Col sm={2}>
                            <div style={{ top: '600px' }}>
                                <SidePannel />
                            </div>

                        </Col>
                        <Col sm={10}>
                        <div style={{ position: 'relative', top: '100px' }}>
                            <div style={{ padding: '50px 0px 50px 0px' }}>
                                <h3>Your Communities</h3>
                                <Container fluid>
                                    <Row>
                                        {yourCommunities.map((community) => (
                                            <CommunityCard community={community}/>
                                        ))}
                                    </Row>
                                </Container>
                            </div>
                            <hr/>
                            <div style={{ padding: '50px 0px 50px 0px' }}>
                                <h3>Suggestions</h3>
                                <Container fluid>
                                    <Row>
                                        {suggestedCommunities.map((community) => (
                                            <CommunityCard community={community}/>
                                        ))}
                                    </Row>
                                </Container>
                            </div>
                        </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
       
    )
}

export default Communities