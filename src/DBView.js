import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import SimpleAccordion from './SimpleAccordion';

const DBView = ({conn, updateAllDocs}) => {
  console.log("dbList", conn);
  let dbViews = [];
  for (const [key, value] of Object.entries(conn || {})) {
    dbViews.push(
      <div key={key}>
      <Accordion.Toggle as={ListGroup.Item} variant="link" eventKey={key}>
        {key}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={key}>
        <SimpleAccordion dbName = {key} collections={value} updateAllDocs={updateAllDocs}/>
      </Accordion.Collapse>
      </div>
    );
  }
  return (
    <ListGroup as="ul" variant="flush">
    <Accordion>
      {dbViews}
    </Accordion>
    </ListGroup>
  )
};

export default DBView;
