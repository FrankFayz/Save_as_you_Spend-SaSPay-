import React from "react";
import { FiSend, FiCreditCard, FiDownload, FiSave } from "react-icons/fi";

const QuickActions = () => {
  return (
    <div className="actions">

      <div className="action action-send">
        <FiSend className="action-icon" />
        <p>Send</p>
      </div>

      <div className="action action-pay">
        <FiCreditCard className="action-icon" />
        <p>Pay</p>
      </div>

      <div className="action action-withdraw">
        <FiDownload className="action-icon" />
        <p>Withdraw</p>
      </div>

      <div className="action action-save">
        <FiSave className="action-icon" />
        <p>Save</p>
      </div>

    </div>
  );
};

export default QuickActions;