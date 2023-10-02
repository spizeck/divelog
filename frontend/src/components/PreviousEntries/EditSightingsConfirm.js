import React from 'react';
import { Modal, Button, List } from 'semantic-ui-react';


const EditSightingsConfirm = ({ formState, handleEditSightingClose, handleUpdateSubmit }) => {
    return (
      <Modal open={true} onClose={handleEditSightingClose}>
        <Modal.Header>Confirm Sightings for Dive</Modal.Header>
        <Modal.Content>
            
                
          <h2>Please confirm your sightings</h2>
          <List>
          <List.Item>
                {formState
                  .filter(item => item.count > 0)
                  .map(item => (
                    <li key={item.name}>
                      <strong>{item.name}:</strong> {item.count}
                    </li>
                  ))}
            </List.Item>
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={handleUpdateSubmit}>
            Confirm
          </Button>
          <Button onClick={handleEditSightingClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    );
  };
  
  export default EditSightingsConfirm;
  