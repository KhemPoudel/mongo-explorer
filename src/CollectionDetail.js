import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import DocumentModal from './DocumentModal';
import { invoke } from '@tauri-apps/api/tauri';

const CollectionDetail = ({ collectionDetail }) => {
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
        <td>{typeof doc}</td>
        <td>
          <ButtonGroup aria-label="actions">
            <DocumentModal type="view" collectionDetail={collectionDetail} doc={doc} />
            <DocumentModal type="update" collectionDetail={collectionDetail} doc={doc} />
            <Button variant="danger" onClick={()=>deleteDoc(doc._id.$oid)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    )
  });

  const insertButton = <DocumentModal type="insert" collectionDetail={collectionDetail} doc={{}}/>;

  const deleteDoc = async (objectId) => {
    try {
      const count = await invoke("delete_one", {
          db: collectionDetail.db,
          collection: collectionDetail.collection,
          objectId: objectId
        });
        console.log("success=> ",count);
    } catch(e) {
      console.log(e);
    }
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>{collectionDetail.db}</Breadcrumb.Item>
        <Breadcrumb.Item>{collectionDetail.collection}</Breadcrumb.Item>
      </Breadcrumb>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Type</th>
            <th>Actions {insertButton} </th>
          </tr>
        </thead>
        <tbody>
         {rows}
        </tbody>
      </Table>
    </>
  )
}

export default CollectionDetail;
