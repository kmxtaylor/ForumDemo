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
  const [inputPlaceholder, setInputPlaceholder] = useState('Type a comment...');

  useEffect(() => {
    // change input placeholder
    let placeholder;
    if (Number.isInteger(replyToIdx)) {
      placeholder = `Type a reply to ${comments[replyToIdx].user.username}...`;
    }
    else {
      placeholder = 'Type a comment...';
    }
    setInputPlaceholder(placeholder);
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
      const newPost = {
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
        ...(
          Number.isInteger(replyToIdx)
          ? { replyingTo: comments[replyToIdx].user.username } // reply mode
          : { replies: [] } // comment mode
        ),
      };
      
      if (Number.isInteger(replyToIdx)) {
        setComments(currComments => {
          currComments[replyToIdx].replies.push(newPost);
          return currComments;
        });
      }
      else {
        setComments(currComments => [...currComments, newPost]);
      }

      setPostText('');
      // console.log('adding new post:', newPost);
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
        placeholder={inputPlaceholder}
      />
    </>
  );
};

export default Forum;
