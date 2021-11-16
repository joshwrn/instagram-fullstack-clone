import React, { useState } from 'react';
import { IoCloseOutline, IoCloudUploadOutline } from 'react-icons/io5';
import resizeImage from '../../functions/resizeImage';
import Styles from '../../styles/profile/profile__upload.module.css';
import { UPLOAD_POST } from '../../graphql/mutations/postMutations';
import { useMutation } from '@apollo/client';

const UploadModal = ({ getModal, setNewPost }) => {
  const [postFile, setPostFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState();

  const [uploadPost, { data, loading: uploading, error }] = useMutation(
    UPLOAD_POST,
    {
      onError(err) {
        console.log(err);
      },
    }
  );

  //+ after choosing a file store it in state
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5000000) {
      resizeImage(e, setImageFile, setPostFile, 1000);
    } else {
      setPostFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadPost({
      variables: {
        caption: caption,
        file: postFile,
      },
    });
  };

  return (
    <div className={Styles.modal}>
      <div className={Styles.container}>
        <div className={Styles.header}>
          <h3>Create New Post</h3>
          <IoCloseOutline onClick={getModal} className={Styles.close} />
        </div>
        <div className={Styles.topContainer}>
          <img
            style={!imageFile ? { display: 'none' } : null}
            className={Styles.preview}
            src={imageFile}
            alt=""
          />

          <div
            style={imageFile && { display: 'none' }}
            className={Styles.uploadContainer}
          >
            <label className={Styles.buttonContainer}>
              <input
                onChange={handleFileChange}
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                className={Styles.fileInput}
              />
              <IoCloudUploadOutline className={Styles.upload} />
              <p>
                {postFile === null ? 'File size limit 5 mb.' : 'ready to post'}
              </p>
            </label>
          </div>
          <div>
            <div className={Styles.captionContainer}>
              <textarea
                className={Styles.captionInput}
                name="caption"
                maxLength="150"
                placeholder="Enter Caption..."
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        </div>
        {uploading ? (
          <div className={`${Styles.loader} loader`} />
        ) : (
          <button
            onClick={
              postFile !== null ? handleSubmit : (e) => e.preventDefault()
            }
            type="submit"
            className={postFile === null ? Styles.postButton : Styles.saveBtn}
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
