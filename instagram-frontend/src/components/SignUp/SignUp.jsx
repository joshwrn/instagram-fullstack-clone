import React, { useEffect, useState, useCallback, useH } from 'react';
import { Link } from 'react-router-dom';
import Styles from '../../styles/sign-up/sign-up.module.css';
// import { signIn, firestore } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import debounce from '../../functions/debounce';
import FormHelper from './FormHelper';
import SignUpVerify from './SignUpVerify';
import { SIGN_UP } from '../../graphql/mutations/authMutations';
import {
  CHECK_USERNAME_EXIST,
  CHECK_EMAIL_EXIST,
} from '../../graphql/queries/authQueries';
import { useMutation, useQuery } from '@apollo/client';

const SignUp = () => {
  const { currentUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [formInput, setFormInput] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    verifyPassword: '',
  });
  const [valid, setValid] = useState(false);
  const [errors, setErrors] = useState({
    nameTaken: false,
    emailTaken: false,
    passwordMismatch: false,
    usernameShort: true,
    emailEmpty: true,
    nameEmpty: true,
    passwordShort: true,
  });
  const {
    data: usernameData,
    loading: usernameLoading,
    error: usernameError,
  } = useQuery(CHECK_USERNAME_EXIST, {
    variables: { username: formInput.username },
  });

  const {
    data: emailData,
    loading: emailLoading,
    error: emailError,
  } = useQuery(CHECK_EMAIL_EXIST, {
    variables: { email: formInput.email },
  });

  useEffect(() => {
    for (const key in errors) {
      if (errors[key] === true) {
        setValid(false);
        return;
      } else {
        setValid(true);
      }
    }
  }, [errors]);

  useEffect(() => {
    if (usernameData) {
      if (usernameData.checkUsernameExist) {
        setErrors((prev) => ({ ...prev, nameTaken: true }));
      } else {
        setErrors((prev) => ({ ...prev, nameTaken: false }));
      }
    }
  }, [usernameData]);

  useEffect(() => {
    if (emailData) {
      if (emailData.checkEmailExist) {
        setErrors((prev) => ({ ...prev, emailTaken: true }));
      } else {
        setErrors((prev) => ({ ...prev, emailTaken: false }));
      }
    }
  }, [emailData]);

  useEffect(() => {
    //username
    if (formInput.username.length < 2) {
      setErrors((prev) => ({ ...prev, usernameShort: true }));
    }
    if (formInput.username.length > 2) {
      setErrors((prev) => ({ ...prev, usernameShort: false }));
    }
    // display name
    if (formInput.displayName.length < 2) {
      setErrors((prev) => ({ ...prev, nameEmpty: true }));
    }
    if (formInput.displayName.length > 2) {
      setErrors((prev) => ({ ...prev, nameEmpty: false }));
    }
    //email
    if (formInput.email.length < 1) {
      setErrors((prev) => ({ ...prev, emailEmpty: true }));
    }
    if (formInput.email.length > 1) {
      setErrors((prev) => ({ ...prev, emailEmpty: false }));
    }
    //password
    if (formInput.password.length < 6) {
      setErrors((prev) => ({ ...prev, passwordShort: true }));
    }
    if (formInput.password.length > 6) {
      setErrors((prev) => ({ ...prev, passwordShort: false }));
    }
    //verify password
    if (formInput.password !== formInput.verifyPassword) {
      setErrors((prev) => ({ ...prev, passwordMismatch: true }));
    }
    if (formInput.password === formInput.verifyPassword) {
      setErrors((prev) => ({ ...prev, passwordMismatch: false }));
    }
  }, [formInput]);

  const [addUser, { loading, error, data }] = useMutation(SIGN_UP, {
    onError: (err) => {
      console.log(err);
    },
    onCompleted: (data) => {
      setSuccess(true);
    },
  });

  const handleUsernameChange = (e) => {
    const value = e;
    const reg = /[^a-zA-Z\d\-\_]/gi;
    const newVal = value.replace(reg, '');
    const lower = newVal.toLowerCase();
    setFormInput((prev) => ({ ...prev, username: lower }));
  };

  const handleEmail = (value) => {
    const reg = /[^a-zA-Z\d\-\_\@\.]/gi;
    const newVal = value.replace(reg, '');
    const lower = newVal.toLowerCase();
    setFormInput((prev) => ({ ...prev, email: lower }));
  };

  const handleDisplayName = (value) => {
    const reg = /[^a-zA-Z" "]/gi;
    const ws = /[" *"]/gi;
    const newVal = value.replace(reg, '');
    const remove = newVal.replace(ws, ' ');
    setFormInput((prev) => ({ ...prev, displayName: remove }));
  };

  const handleValue = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      handleUsernameChange(value);
    } else if (name === 'email') {
      handleEmail(value);
    } else if (name === 'displayName') {
      handleDisplayName(value);
    } else {
      setFormInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser({
      variables: {
        username: formInput.username,
        displayName: formInput.displayName,
        email: formInput.email,
        password: formInput.password,
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  let view;

  if (!currentUser) {
    view = (
      <div className={Styles.signUp}>
        <div className={Styles.container}>
          <div className={Styles.formContainer}>
            {success ? (
              <SignUpVerify email={formInput.email} />
            ) : (
              <form pattern="[0-9a-zA-Z_.-]*" className={Styles.form}>
                <div className={Styles.header}>
                  {/* <img className={Styles.logoImg} src={logo} alt="" /> */}
                  <div className={Styles.textContainer}>
                    <h2 className={Styles.headerText}>Sign Up</h2>
                  </div>
                </div>

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

                <FormHelper
                  field={formInput.username}
                  error={errors.nameTaken}
                  length={2}
                  neutral="Username must be 3-15 characters."
                  correct="Username is available"
                  incorrect="Username already taken"
                />

                <div className={Styles.inputLabelDiv}>
                  <p className={Styles.inputLabel}>Full Name</p>
                </div>

                <div className={Styles.input}>
                  <input
                    required
                    autoComplete="off"
                    onChange={handleValue}
                    className={Styles.inputBox}
                    type="text"
                    name="displayName"
                    placeholder="Full Name"
                    maxLength="15"
                    minLength="3"
                    value={formInput.displayName}
                  />
                </div>

                <FormHelper
                  field={formInput.displayName}
                  error={false}
                  length={2}
                  neutral="Enter your full name."
                  correct="Success"
                  incorrect="Name too short"
                />

                <div className={Styles.inputLabelDiv}>
                  <p className={Styles.inputLabel}>Email</p>
                </div>

                <div className={Styles.input}>
                  <input
                    required
                    onChange={handleValue}
                    className={Styles.inputBox}
                    type="text"
                    name="email"
                    placeholder="email@example.com"
                    minLength="3"
                    value={formInput.email}
                  />
                </div>

                <FormHelper
                  field={formInput.email}
                  error={errors.emailTaken}
                  length={0}
                  neutral="Enter valid email."
                  correct="Valid"
                  incorrect="Email already exists."
                />

                <div className={Styles.inputLabelDiv}>
                  <p className={Styles.inputLabel}>Password</p>
                </div>

                <div className={Styles.input}>
                  <input
                    required
                    onChange={handleValue}
                    className={Styles.inputBox}
                    type="password"
                    name="password"
                    placeholder="********"
                    maxLength="16"
                    minLength="5"
                    value={formInput.password}
                  />
                </div>

                <FormHelper
                  field={formInput.email}
                  error={errors.passwordMismatch}
                  length={0}
                  neutral=""
                  correct=""
                  incorrect=""
                />

                <div className={Styles.inputLabelDiv}>
                  <p className={Styles.inputLabel}>Verify Password</p>
                </div>

                <div className={Styles.input}>
                  <input
                    required
                    onChange={handleValue}
                    className={Styles.inputBox}
                    type="password"
                    name="verifyPassword"
                    placeholder="********"
                    maxLength="16"
                    minLength="5"
                    value={formInput.verifyPassword}
                  />
                </div>

                <FormHelper
                  field={formInput.email}
                  error={errors.passwordMismatch}
                  length={0}
                  neutral="‎"
                  correct="‎"
                  incorrect="Passwords don't match."
                />

                <button
                  type="submit"
                  onClick={valid ? handleSubmit : (e) => e.preventDefault()}
                  className={Styles.signUpButton}
                  style={
                    valid
                      ? {
                          backgroundColor: 'black',
                          cursor: 'pointer',
                        }
                      : { backgroundColor: 'gray', cursor: 'not-allowed' }
                  }
                >
                  Sign Up
                </button>
                <p className={Styles.loginText}>
                  Already have an account?{' '}
                  <Link to="/login" className={Styles.signInLink}>
                    Sign In
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
        <div className={Styles.image}></div>
      </div>
    );
  }

  if (currentUser) {
    view = (
      <div className={Styles.signUp}>
        <div className={Styles.notFoundContainer}>
          <h3>Already Logged In</h3>
          <Link to="/">
            <button className={Styles.returnButton}>Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{view}</>;
};

export default SignUp;
