#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use mongodb::{ Client,
    Collection,
    options::{
        ClientOptions,
        ServerAddress::{Tcp},
        Credential
    },
    bson::{
        doc,
        Document,
        oid::ObjectId
    }
};
use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use futures::stream::{TryStreamExt};
//use bson::{Bson, oid::ObjectId};

#[derive(Serialize, Deserialize, Debug)]
struct UserCredential {
    username: String,
    password: String
}

 #[derive(Serialize, Deserialize, Debug)]
 struct ConnectionDetails {
     hostname: String,
     port: u16,
     user_credentials: Option<UserCredential>,
 }

// #[derive(serde: Serialize)]
// struct DBError {
//     err: String
// }
#[derive(Debug)]
struct Connection {
    client: Client,
}

static mut CONNECTION: Option<Connection> = None;

#[tauri::command]
async fn create_connection(connection_details: ConnectionDetails) -> Result<HashMap<String, Vec<String>>, String> {
    let options = match connection_details.user_credentials {
        Some(cred) => {
            let credential = Credential::builder()
                                .username(cred.username.into())
                                .password(cred.password.into())
                                .build();
            ClientOptions::builder()
                            .hosts(vec![
                                Tcp {
                                    host: connection_details.hostname.into(),
                                    port: Some(connection_details.port),
                                }
                                ])
                              .credential(credential)
                              .build()
        },
        None => {
            ClientOptions::builder()
                            .hosts(vec![
                                Tcp {
                                    host: connection_details.hostname.into(),
                                    port: Some(connection_details.port),
                                }
                                ])
                              .build()
        }
    };

  if let Ok(c) = Client::with_options(options) {
      unsafe {
        CONNECTION = Some(Connection{ client: c.clone() });
        let mut db_hash = HashMap::new();

        let db_names = match c.list_database_names(None, None).await {
            Ok(db_names) => db_names,
            Err(err) => {
                println!("{:?}", err);
                return  Err("No databases".into());
            }
        };

        for db_name in db_names {
            let db_handle = c.database(&db_name);
            let collection_names = match db_handle.list_collection_names(None).await {
                Ok(collection_names) => collection_names,
                Err(error) => {
                    println!("{:?}", error);
                    vec![]
                    //return Err("Collection error".into());
                },
            };

            db_hash.insert(db_name, collection_names);
        }

        Ok(db_hash)

      }
  } else {
      return Err("Connection error".into());
  }

  //let client = Client::with_options(options)?;

}

#[tauri::command]
async fn find(db: String, collection: String) -> Result<Vec<Document>, String> {
    unsafe {
        match &CONNECTION {
            Some(conn) => {
                let student_coll: Collection = conn.client.database(&db).collection(&collection);
                if let Ok(all_docs_cursor) = student_coll.find(None, None).await {
                    if let Ok(v) = all_docs_cursor.try_collect().await {
                        println!("{:?}", v);
                        return Ok(v);
                    } else {
                        return Err("no docs".into());
                    }
                } else {
                    return Err("no collection".into());
                }
            },
            None => {
                return Err("no connection".into());
            }
        }
    }
}

#[tauri::command]
async fn update_one(db: String, collection:String, object_id: String, new_doc: Document) -> Result<u64, String> {
    println!("doc=> {:?}, id=> {}", &new_doc, &object_id);
    unsafe {
        match &CONNECTION {
            Some(conn) => {
                let coll: Collection = conn.client.database(&db).collection(&collection);
                if let Ok(obj_id_bson) = ObjectId::parse_str(&object_id){
                    if let Ok(update_result) = coll.update_one(
                        doc! {
                            "_id": &obj_id_bson
                        },
                        doc! {
                            "$set": new_doc
                    }, None).await {
                        return Ok(update_result.modified_count);
                    } else {
                        return Err("no collection".into());
                    }
                } else {
                     return Err("Wrong ObjectId Supplied".into());
                }
            },
            None => {
                return Err("no connection".into());
            }
        }
    }
}

#[tauri::command]
async fn insert_one(db: String, collection:String, new_doc: Document) -> Result<String, String> {
    println!("doc=> {:?}", &new_doc);
    unsafe {
        match &CONNECTION {
            Some(conn) => {
                let coll: Collection = conn.client.database(&db).collection(&collection);
                if let Ok(insert_result) = coll.insert_one(new_doc.clone(), None).await {
                    return Ok(insert_result.inserted_id.to_string());
                } else {
                    return Err("no collection".into());
                }
            },
            None => {
                return Err("no connection".into());
            }
        }
    }
}

#[tauri::command]
async fn delete_one(db: String, collection:String, object_id: String) -> Result<u64, String> {
    unsafe {
        match &CONNECTION {
            Some(conn) => {
                let coll: Collection = conn.client.database(&db).collection(&collection);
                if let Ok(obj_id_bson) = ObjectId::parse_str(&object_id){
                    if let Ok(delete_result) = coll.delete_one(
                        doc! {
                            "_id": &obj_id_bson
                        },
                        None).await {
                        return Ok(delete_result.deleted_count);
                    } else {
                        return Err("no collection".into());
                    }
                } else {
                     return Err("Wrong ObjectId Supplied".into());
                }
            },
            None => {
                return Err("no connection".into());
            }
        }
    }
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_connection, find, update_one, insert_one, delete_one])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
  // create_connection(ConnectionDetails {
  //     hostname: "localhost".to_string(),
  //     port: 27017,
  //     user_credentials: Some(UserCredential {
  //         username: "khem".to_string(),
  //         password: "idunnoe7".to_string()
  //     })
  // }).await.unwrap();
  //
  // find("test_mongo".to_string(), "students".to_string()).await.unwrap();
}
