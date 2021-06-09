import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import DocumentModal from './DocumentModal';

const CollectionDetail = ({ collectionDetail }) => {
  console.log(collectionDetail);
  const rows = collectionDetail.docs && collectionDetail.docs.map((doc, idx) => {
    let allFields = [];
    for (const [key, value] of Object.entries(doc)) {
      allFields.push(
        <ListGroup.Item key={key}>
          {key}: {key == "_id" ? value.$oid : value} <i> {typeof value} </i>
        </ListGroup.Item>
      );
    }
    return (
      <tr>
      <td>
      <Accordion>
        <Accordion.Toggle variant="link" eventKey={doc._id.$oid}>
          {doc._id.$oid}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={doc._id.$oid}>
          <ListGroup as="ul" variant="flush" style={{paddingLeft: "20px"}}>
            {allFields}
            </ListGroup>
        </Accordion.Collapse>
      </Accordion>
      </td>
        <td>{"{ "+Object.keys(doc).length + " fields }"}</td>
        <td>{typeof docs}</td>
        <td>
          <ButtonGroup aria-label="actions">
            <DocumentModal type="view" collectionDetail={collectionDetail} doc={doc} />
            <DocumentModal type="update" collectionDetail={collectionDetail} doc={doc} />
            <Button variant="danger">Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    )
  });

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
       {rows}
      </tbody>
    </Table>
  )
}

export default CollectionDetail;
