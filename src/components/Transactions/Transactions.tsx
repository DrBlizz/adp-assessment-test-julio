import React, { useEffect, useState } from "react";
import IEmployee from "../../types/Employee";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import SendDataService from "../../services/SendDataService";
import "./styles.css";

interface IProps {
  employee: IEmployee;
  transactionId: string;
}

interface IMessage {
  title: string;
  message: string;
}

const previousYear = (new Date()).getFullYear() - 1;

export const Transactions: React.FC<IProps> = (props: IProps) => {
  const [modalShow, setModalShow] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [postMessage, setPostMessage] = useState<IMessage>();
  const [errorMessageClass, setErrorMessageClass] = useState<string>('');
  const { isLoading: isPostingTutorial, mutate: postTopEarner } = useMutation<any, Error>(
    async () => {
      return await SendDataService.postTopEarner(props.employee, props.transactionId);
    },
    {
      onSuccess: (res) => {
        setIsSubmitted(true);
        setModalShow(true);
        setPostMessage({title:'Sucess', message: 'The values have been submitted Successfully'});
      },
      onError: (err: any) => {
        setErrorMessageClass('error');
        setIsSubmitted(true);
        setModalShow(true);
        switch(err.status) {
          case 400:
            setPostMessage({title:'Error when submitting', message: err.response.data});
            return;
          case 404:
            setPostMessage({title:'Error when submitting', message: 'Value not found for specified ID'});
            return;
          case 503:
            setPostMessage({title:'Error when submitting', message: 'Error communicating with database'});
            return;
          default:
            setPostMessage({title:'Unexpected error ', message: 'Please reload the page and try again.'});
            return;
        }
      },
    }
  );

  const MyVerticallyCenteredModal = (props: any) => {
    return (
      <Modal
        {...props}
        size="g"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton />
        <Modal.Body>
          {isSubmitted ? 
            (
              <>
                <h3 className={"title " + errorMessageClass}>{postMessage?.title}</h3>
                <p className="message">{postMessage?.message}</p>
              </>
            ) : (
              <>
                <h4>Please confirm the data before submit</h4>
                <p>ID: {props.transactionid}</p>
                <p>Transactions: {props.transactions.join(', ')}</p>
              </>
            )
          }
        </Modal.Body>
        <Modal.Footer>
          {isSubmitted ?
            (
              <><Button onClick={props.onHide}>Close</Button></>
            ) : (
              <>
                <Button onClick={props.onSubmit}>Confirm</Button>
                <Button onClick={props.onHide} variant="secondary">Cancel</Button>
              </>
            )
          }
        </Modal.Footer>
      </Modal>
    );
  }

  const handleHideModal = () => {
    setErrorMessageClass('');
    setIsSubmitted(false);
    setModalShow(false);
  };

  useEffect(() => {
    isPostingTutorial && console.log('posting...');
  }, [isPostingTutorial]);

  const handleSubmit = () => {
    setModalShow(false)
    try {
      postTopEarner();
    } catch (err) {
      setPostMessage({title:'Unexpected error ', message: 'Please reload the page and try again.'});
    }
  };

  return (
    <>
              
      <div>The top earner of {previousYear} is:</div>
      <div>Name: {props.employee.name}</div>
      <div>ID: {props.employee.id}</div>
      <div>Transactions: {props.employee.transactions.join(', ')}</div>
      {(props.transactionId && props.employee) &&        
        (<>
          <hr/>
          <Button variant="primary" onClick={() => setModalShow(true)}>
            Submit
          </Button>

          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => handleHideModal()}
            onSubmit={() => handleSubmit()}
            transactionid={props.transactionId}
            transactions={props.employee.transactions}
          />
        </>)
      }
    </>
  )
};
