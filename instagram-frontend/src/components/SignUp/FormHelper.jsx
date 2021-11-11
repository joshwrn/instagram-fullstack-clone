import React from 'react';
import Styles from '../../styles/sign-up/sign-up.module.css';

const FormHelper = ({ field, error, length, neutral, correct, incorrect }) => {
  let helper = <p className={Styles.nameHelper}>{neutral}</p>;

  if (field.length !== 0) {
    if (field.length <= length) {
      helper = <p className={Styles.nameHelper}>Too Short.</p>;
    } else if (error === false) {
      helper = (
        <p style={{ color: '#00C138' }} className={Styles.nameHelper}>
          {correct}
        </p>
      );
    } else {
      helper = (
        <p style={{ color: '#ff0000' }} className={Styles.nameHelper}>
          {incorrect}
        </p>
      );
    }
  }
  return <div className={Styles.helperDiv}>{helper}</div>;
};

export default FormHelper;
