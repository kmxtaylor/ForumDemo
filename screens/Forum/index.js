import { useState, useEffect } from 'react';

import InputContainer from './InputContainer';
import CommentsList from './CommentsList';

import data from '../../assets/data/data.json';

/* Manage data between CommentList */
const Forum = () => {
  const [comments, setComments] = useState([]);
  const [postText, setPostText] = useState('');

  const NO_TARGET = null;
  const [replyToIdx, setReplyToIdx] = useState(NO_TARGET);
  const [inputPlaceholderText, setInputPlaceholderText] = useState('');

  useEffect(() => {
    // change input placeholder
    let placeholder;
    if (replyToIdx !== NO_TARGET) {
      try {
        placeholder = `Type reply to ${comments[replyToIdx].user.username}...`;
      }
      catch (err) {
        placeholder = 'Type reply...';
        console.error(err.message);
        console.log('replyToIdx: ', replyToIdx);
      }
    }
    else {
      placeholder = 'Type comment...';
    }
    setInputPlaceholderText(placeholder);
    // console.log(placeholder);
  }, [replyToIdx]);

  function calcNextId() {
    if (comments.length === 0 ) {
      return 1;
    }

    const usedIds = new Set();
    
    // Add all existing ids to the set
    comments.forEach((item) => {
      usedIds.add(item.id);
      item.replies.forEach((reply) => {
        usedIds.add(reply.id);
      });
    });
    
    // Find the largest used id (maintain order by not reusing deleted ids unless all deleted)
    let maxUsedId = Math.max(...usedIds);
    
    return maxUsedId + 1;
  }

  const addPost = () => {
    if (postText !== '') {
      const myUname = data.currentUser.username;
      if (replyToIdx === NO_TARGET) {
        const newComment = {
          id: calcNextId(),
          content: postText,
          createdAt: 'just now', // idk how accurate we wanna be
          score: 0,
          user: {
            image: {
              png: `./images/avatars/image-${myUname}.png`,
              webp: `./images/avatars/image-${myUname}.webp`,
            },
            username: myUname,
          },
          replies: [],
        };
        // use updater function for data locking
        setComments(currComments => [...currComments, newComment]);
        setPostText('');
        // console.log('adding new comment:', newComment);
      }
      else {
        const newReply = {
          id: calcNextId(),
          content: postText,
          createdAt: 'just now', // idk how accurate we wanna be
          score: 0,
          replyingTo: comments[replyToIdx].user.username,
          user: {
            image: {
              png: `./images/avatars/image-${myUname}.png`,
              webp: `./images/avatars/image-${myUname}.webp`,
            },
            username: myUname,
          },
        };
        // use updater function for data locking
        setComments(currComments => {
          currComments[replyToIdx].replies.push(newReply);
          return currComments;
        });
        setPostText('');
        // console.log('adding new reply:', newReply);
      }
    }
  };

  return (
    <>
      <CommentsList
        comments={comments}
        replyToIdx={replyToIdx}
        setReplyToIdx={setReplyToIdx}
      />
      <InputContainer
        displayedVal={postText}
        handleKeyPress={setPostText}
        handleSubmit={addPost}
        placeholder={inputPlaceholderText}
      />
    </>
  );
};

export default Forum;
