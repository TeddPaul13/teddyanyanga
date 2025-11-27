import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import resume from "../Teddy_Software_Resume.pdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RequestUserEmail() {
  const [show, setShow] = useState(false);
  const [sender_name, setSender_name] = useState(" ");
  const [sender_email, setSender_email] = useState(" ");
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setShow(false);
    setErrors({});
  };
  const handleShow = () => setShow(true);

  // Validate form fields, error messages are shown under the respective form fields

  function validateForm(value) {
    const errors = {};
    if (!value.sender_name || !value.sender_name.trim()) {
      errors.sender_name = "Name is required";
    }
    if (!value.sender_email || !value.sender_email.trim()) {
      errors.sender_email = "Email is required";
    } else {
      // Regular expression for a simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.sender_email)) {
        errors.sender_email = "Please enter a valid email";
      }
    }
    setErrors(errors);
    return errors;
  }

  function downloadResume() {
    const anchor = document.createElement("a");
    anchor.href = resume;
    anchor.download = "Teddy Anyanga's Resume";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  // Send Email for every download.

  const sendEmailForDownload = (e) => {
    e.preventDefault();

    const errors = validateForm({ sender_name, sender_email });

    if (Object.keys(errors).length === 0) {
      const service_id = "service_98mdcg3";
      const template_id = "template_t9684fw";
      const public_key = "IrkTjBWVD4j3FzvhC";

      const templateParams = {
        from_name: sender_name,
        to_name: "Teddy",
        reply_to: sender_email,
      };

      emailjs
        .send(service_id, template_id, templateParams, public_key)
        .then((response) => {
          console.log("Email sent succesfully", response);
          setSender_email(" ");
          setSender_name(" ");
          downloadResume();
          handleClose();
          displaySuccessToast();
        })
        .catch((error) => {
          console.log("Error sending email", error);
        });
    } else {
      console.log("Validation errors", errors);
    }
    // TODO Explore displaying an Error toast if the download is not successful.
    const displaySuccessToast = () => {
      toast.success("Download Successful!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    };
  };

  return (
    <>
      <Button variant="outline-info" onClick={handleShow}>
        Download CV
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Please Enter Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={sendEmailForDownload}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g: Teddy Anyanga"
                name="sender_name"
                value={sender_name}
                onChange={(e) => setSender_name(e.target.value)}
                autoFocus
                required
              />
              {errors.sender_name && (
                <p className="text-danger">{errors.sender_name}</p>
              )}
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="sender_email"
                value={sender_email}
                onChange={(e) => setSender_email(e.target.value)}
                required
              />
              {errors.sender_email && (
                <p className="text-danger">{errors.sender_email}</p>
              )}
            </Form.Group>
            <p>
              {" "}
              Your details are for tracking purposes only. I receive a push
              notification for every successful download. This helps me keep
              track of who has my Resume.
            </p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={sendEmailForDownload}>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default RequestUserEmail;
