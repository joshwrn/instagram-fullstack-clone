import React from 'react';
import icon from '../../assets/img/icons/envelope-free/Envelope_perspective_matte_s.png';
import Styles from '../../styles/sign-up/sign-up__verify.module.css';

const SignUpVerify = ({ email }) => {
  return (
    <div className={Styles.container}>
      <img className={Styles.icon} src={icon} alt="icon" />
      <p className={Styles.text}>Please verify your email address.</p>
      <p className={Styles.email}>{email}</p>
    </div>
  );
};

export default SignUpVerify;
