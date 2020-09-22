import React from "react";

import "./modal.css";

const Modal = (props) => {
  return (
    <React.Fragment>
      <div className="modal">
        <header className="modal__header">
          <h1>{props.title}</h1>
        </header>
        <section className="modal__content">{props.children}</section>
        <section className="modal__actions">
          {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button>}
          {props.canConfirm && <button className="btn" onClick={props.onConfirm}>Confirm</button>}
        </section>
      </div>
    </React.Fragment>
  );
};

export default Modal;
