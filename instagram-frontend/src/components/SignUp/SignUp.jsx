import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Styles from '../../styles/sign-up/sign-up.module.css';
// import { signIn, firestore } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/img/logo/logo-2.png';
import debounce from '../../functions/debounce';

const SignUp = () => {
  const { currentUser } = useAuth();
  const [formInput, setFormInput] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    verifyPassword: '',
  });
  const [errors, setErrors] = useState({
    nameTaken: false,
    emailTaken: false,
    passwordMismatch: false,
  });

  const { nameTaken, emailTaken, passwordMismatch } = errors;

  const handleChange = (e) => {
    const value = e;
    const reg = /[^a-zA-Z\d]/gi;
    const newVal = value.replace(reg, '');
    const lower = newVal.toLowerCase();
    setFormInput({ ...formInput, username: lower });
  };

  const debounceChange = useCallback(
    debounce((nextValue) => handleChange(nextValue), 500),
    []
  );

  const handleValue = (e) => {
    console.log(formInput);
    const { name, value } = e.target;
    if (name === 'username') {
      handleChange(value);
    } else {
      setFormInput({
        ...formInput,
        [name]: value,
      });
    }
  };

  // useEffect(() => {
  //   let foundName;
  //   const check = async () => {
  //     if (userInput.length > 2) {
  //       await firestore
  //         .collection('users')
  //         .where('username', '==', userInput)
  //         .get()
  //         .then((searchResults) => {
  //           return searchResults.forEach((doc) => {
  //             foundName = doc.data();
  //           });
  //         });
  //       if (foundName === undefined) {
  //         setNameTaken(false);
  //       } else {
  //         setNameTaken(true);
  //       }
  //     }
  //   };
  //   check();
  // }, [userInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // signIn();
  };

  const doNothing = (e) => {
    e.preventDefault();
  };

  let nameHelper = (
    <p className={Styles.nameHelper}>Name must be 3-15 characters.</p>
  );

  if (formInput.username.length !== 0) {
    if (formInput.username.length <= 2) {
      nameHelper = <p className={Styles.nameHelper}>Too Short.</p>;
    } else if (nameTaken === false) {
      nameHelper = (
        <p style={{ color: '#00C138' }} className={Styles.nameHelper}>
          Name is available.
        </p>
      );
    } else {
      nameHelper = (
        <p style={{ color: '#ff0000' }} className={Styles.nameHelper}>
          Name has already been taken.
        </p>
      );
    }
  }

  return (
    <>
      {!currentUser ? (
        <div className={Styles.signUp}>
          <div className={Styles.container}>
            <div className={Styles.header}>
              <img className={Styles.logoImg} src={logo} alt="" />
              <div className={Styles.textContainer}>
                <h2 className={Styles.headerText}>Sign Up</h2>
              </div>
            </div>
            <div className={Styles.formContainer}>
              <form pattern="[0-9a-zA-Z_.-]*" className={Styles.form}>
                <div className={Styles.inputLabelDiv}>
                  <p className={Styles.inputLabel}>Username</p>
                </div>
                <div className={Styles.input}>
                  <div className={Styles.username}>
                    <p>@</p>
                  </div>
                  <input
                    required
                    autoComplete="off"
                    onChange={handleValue}
                    className={Styles.searchInputBox}
                    type="text"
                    name="username"
                    placeholder="username"
                    maxLength="15"
                    minLength="3"
                    value={formInput.username}
                  />
                </div>
                <div className={Styles.helperDiv}>{nameHelper}</div>
                <div className={Styles.input}>
                  <input
                    required
                    autoComplete="off"
                    onChange={handleValue}
                    className={Styles.inputBox}
                    type="text"
                    name="fullName"
                    placeholder="full name"
                    maxLength="15"
                    minLength="3"
                    value={formInput.fullName}
                  />
                </div>

                <div className={Styles.input}>
                  <input
                    required
                    onChange={handleValue}
                    className={Styles.inputBox}
                    type="text"
                    name="email"
                    placeholder="email"
                    minLength="3"
                    value={formInput.email}
                  />
                </div>
                <div className={Styles.input}>
                  <input
                    required
                    onChange={handleValue}
                    className={Styles.inputBox}
                    type="password"
                    name="password"
                    placeholder="password"
                    maxLength="16"
                    minLength="5"
                    value={formInput.password}
                  />
                </div>
                <div className={Styles.input}>
                  <input
                    required
                    onChange={handleValue}
                    className={Styles.inputBox}
                    type="password"
                    name="verifyPassword"
                    placeholder="verify password"
                    maxLength="16"
                    minLength="5"
                    value={formInput.verifyPassword}
                  />
                </div>
                <button
                  type="submit"
                  onClick={
                    !nameTaken && formInput.username.length > 2
                      ? handleSubmit
                      : doNothing
                  }
                  className={Styles.signUpButton}
                  style={
                    !nameTaken && formInput.username.length > 2
                      ? {
                          backgroundColor: 'black',
                          cursor: 'pointer',
                        }
                      : { backgroundColor: 'gray', cursor: 'not-allowed' }
                  }
                >
                  Sign Up
                </button>
              </form>
              <p className={Styles.or}>Already signed up?</p>
              <Link to="/login">
                <button className={Styles.loginButton}>Login</button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className={Styles.signUp}>
          <div className={Styles.notFoundContainer}>
            <h3>Already Logged In</h3>
            <Link to="/">
              <button className={Styles.returnButton}>Return Home</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
