import {Button, Modal, Form} from 'react-bootstrap';
import {useState} from 'react';
import { invoke } from '@tauri-apps/api/tauri';

const DocumentModal = ({type, doc, collectionDetail}) => {
  const [show, setShow] = useState(false);
  const [docText, changeText] = useState(JSON.stringify(doc));

  const handleSave = async () => {
    const jsonValue = JSON.parse(docText);
    try {
      console.log("updating => ", doc);
      const count = await invoke("update_one", {
        db: collectionDetail.db,
        collection: collectionDetail.collection,
        objectId: doc._id.$oid, newDoc: jsonValue});
      console.log("success=> ",count);
      setShow(false);
    } catch(e) {
      console.log(e);
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const saveButton =   type == "update" ? <Button variant="primary" onClick={handleSave}>
      Save Changes
    </Button> : "";

  return (
    <>
      <Button variant={type == "view" ? "primary" : "secondary"} onClick={handleShow}>
        {type}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{collectionDetail.db} >> {collectionDetail.collection}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control as="textarea" rows="10" value={docText} onChange={(e) => changeText(e.target.value)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {saveButton}

        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DocumentModal;
