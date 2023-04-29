import { useState } from 'react';

import InputContainer from './InputContainer';
import CommentsList from './CommentsList';

// import data from '../../assets/data/data.json';

/* Manage data between CommentList */
const Forum = () => {
  const [comments, setComments] = useState([]);

  const [postText, setCommentText] = useState('');
  // const [replyText, setReplyText] = useState('');

  const addComment = () => {
    const newComment = { text: postText, replies: [] };
    if (postText !== '') {
      // use updater function for data locking
      setComments(currComments => [...currComments, newComment]);
      setCommentText('');
    }
  };

  return (
    <>
      <CommentsList
        comments={comments}
        setComments={setComments} // won't need to pass in after I change reply functionality
      />
      <InputContainer
        typedVal={postText}
        handleTyping={setCommentText}
        handleSubmit={addComment}
      />
    </>
  );
};

export default Forum;
