import React, {useState} from "react";
import {Button, Modal} from 'react-bootstrap';


function CameraModel(){
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    return(
    <div>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Camera Access</Modal.Title>
      </Modal.Header>
      <Modal.Body>Attention Monitor would like to access your Camera!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
    
    );
    }

export default CameraModel;

