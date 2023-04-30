import { useState, useEffect } from 'react';

import InputContainer from './InputContainer';
import CommentsList from './CommentsList';

import data from '../../assets/data/data.json';

/* Manage data between CommentList */
const Forum = () => {
  const [comments, setComments] = useState([]);
  const [postText, setPostText] = useState('');

  const NO_TARGET = null;
  // { commentGroup: null, reply: null };
  const [replyTargetIdxs, setReplyTargetIdxs] = useState(NO_TARGET);
  // const [commentTargetIdx, setCommentTargetIdx] = useState(NO_TARGET);
  // const [nestedTargetIdx, setNestedTargetIdx] = useState(null);
  const [replyingToUsername, setReplyingToUsername] = useState('');
  const [inputPlaceholder, setInputPlaceholder] = useState('Type a comment...');

  useEffect(() => {
    console.log(
      `commentGroup: ${replyTargetIdxs?.commentGroup}\t`,
      `reply: ${replyTargetIdxs?.reply}`
    );

    // change input placeholder
    let placeholder;
    if (replyTargetIdxs) {
      // let replyToName;
      // if (replyTargetIdxs.reply) {
      //   let comment = comments[replyTargetIdxs.commentGroup];
      //   replyToName = comment?.replies?.[replyTargetIdxs.reply]?.user?.username
      // }
      // else {
      //   replyToName = comments[replyTargetIdxs.commentGroup]?.user?.username;
      // }
      let commentGroup = { ...comments[replyTargetIdxs.commentGroup] };
      const replyToName = (
        commentGroup?.replies?.[replyTargetIdxs.reply]?.user?.username
        ?? commentGroup?.user?.username
      );
      setReplyingToUsername(replyToName); // store for easier tagging reference
      placeholder = `Type a reply to ${replyToName}...`;
    }
    else {
      setReplyingToUsername('');
      placeholder = 'Type a comment...';
    }
    setInputPlaceholder(placeholder);
    // console.log(placeholder);
  }, [replyTargetIdxs]);

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
          replyTargetIdxs
          ? { replyingTo: replyingToUsername } // reply mode
          : { replies: [] } // comment mode
        ),
      };
      
      if (replyTargetIdxs) {
        setComments(currComments => {
          currComments[replyTargetIdxs.commentGroup]
            .replies.push(newPost); // simplest: add to end of comment group
          return currComments;
        });
      }
      else {
        setComments(currComments => [...currComments, newPost]);
      }

      setPostText('');
      setReplyTargetIdxs(NO_TARGET);
      // setReplyingToUsername(''); // already handled by other setter
      // console.log('adding new post:', newPost);
    }
  };

  return (
    <>
      <CommentsList
        comments={comments}
        replyTargetIdxs={replyTargetIdxs}
        setReplyTargetIdxs={setReplyTargetIdxs}
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
