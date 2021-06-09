import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const SimpleAccordion = ({dbName, collections, updateAllDocs}) => {
  const accordionItem = collections.map((collection, idx) => {
    return (
        <ListGroup.Item key={idx} onClick={()=>updateAllDocs(dbName, collection)}>
          {collection}
        </ListGroup.Item>
      );
  });
  return (
    <ListGroup as="ul" variant="flush" style={{paddingLeft: "20px"}}>
      {accordionItem}
    </ListGroup>
  );
};

export default SimpleAccordion;
