import {useState} from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import {Container, Row, Col} from 'react-bootstrap';
import DBView from './DBView';
import CollectionDetail from './CollectionDetail';

const ConnectionsView = ({conn}) => {
  const [ collectionData, changeCollectionData ] = useState({allData:[], activeCollectionIndex: -1});

  const updateAllDocs = async (dbName, collectionName) => {
    let activeCollectionIndex = collectionData.allData.findIndex(({db, collection})=> {
      return (db == dbName && collection == collectionName);
    });

    let {allData} = collectionData;

    //if(activeCollectionIndex < 0) {
      console.log("calling invoke");
      try {
        const docs = await invoke("find", {db: dbName, collection: collectionName});

        allData.push({db: dbName, collection: collectionName, docs});
        activeCollectionIndex = collectionData.allData.length - 1;
        console.log("allDocs after invoke: ", collectionData);
      } catch(e) {
        console.log(e);
      }
    //}

    changeCollectionData({allData, activeCollectionIndex});
  }

  let collectionDetail = collectionData.allData[collectionData.activeCollectionIndex] || {};

  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <DBView conn={conn} updateAllDocs={updateAllDocs}/>
        </Col>
        <Col md={8}>
          <CollectionDetail collectionDetail={collectionDetail} />
        </Col>
      </Row>
    </Container>
  );
};

export default ConnectionsView;
