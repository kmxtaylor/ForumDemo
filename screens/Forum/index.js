import { useState, useEffect } from 'react';

import InputContainer from './InputContainer';
import CommentsList from './CommentsList';

import data from '../../assets/data/data.json';

/* Manage data between CommentList */
const Forum = () => {
  const [comments, setComments] = useState([]);
  
  const [postText, setPostText] = useState('');
  const [replyText, setReplyText] = useState('');

  const BLANK_TARGET = null;
  const [replyTargetIdx, setReplyTargetIdx] = useState(BLANK_TARGET);
  const [inputPlaceholderText, setInputPlaceholderText] = useState('');

  useEffect(() => {
    // change input placeholder
    let placeholder;
    if (replyTargetIdx !== BLANK_TARGET) {
      try {
        placeholder = `Reply to ${comments[replyTargetIdx].user.username}...`;
      }
      catch (e) {
        placeholder = 'Reply...';
        console.log('replyTargetIdx: ', replyTargetIdx);
        console.log(replyTargetIdx?.idx);
        console.log(comments[replyTargetIdx]?.user);
      }
    }
    else {
      placeholder = 'Comment...';
    }
    setInputPlaceholderText(placeholder);
    // console.log(placeholder);

    // change input placeholder
  }, [replyTargetIdx]);

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

  const addComment = () => {
    if (postText !== '') {
      const myUname = data.currentUser.username;
      if (replyTargetIdx === BLANK_TARGET) {
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
        console.log('adding new comment:', newComment);
      }
      else {
        const newReply = {
          id: calcNextId(),
          content: postText,
          createdAt: 'just now', // idk how accurate we wanna be
          score: 0,
          replyingTo: comments[replyTargetIdx].user.username,
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
          currComments[replyTargetIdx].replies.push(newReply);
          return currComments;
        });
        setPostText('');
        console.log('adding new reply:', newReply);
      }
    }
  };

  return (
    <>
      <CommentsList
        comments={comments}
        setComments={setComments} calcNextId={calcNextId} replyText={replyText} setReplyText={setReplyText} // won't need to pass in after I change reply functionality
        replyMode={replyTargetIdx}
        setReplyMode={setReplyTargetIdx}
      />
      <InputContainer
        typedVal={postText}
        handleTyping={setPostText}
        handleSubmit={addComment}
        placeholder={inputPlaceholderText}
      />
    </>
  );
};

export default Forum;
