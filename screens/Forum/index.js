import { useState, useEffect } from 'react';

import InputContainer from './InputContainer';
import CommentsList from './CommentsList';
import DeletionModal from './DeletionModal';

import data from '../../assets/data/data.json';

/* Manage data between CommentList */
const Forum = () => {
  const [comments, setComments] = useState([]);
  const [postText, setPostText] = useState('');

  const NO_TARGET = null;
  // { commentGroup: null, reply: null };
  const [replyTargetIdxs, setReplyTargetIdxs] = useState(NO_TARGET);
  const [replyingToUsername, setReplyingToUsername] = useState('');
  const [inputPlaceholder, setInputPlaceholder] = useState('Type a comment...');

  // useState for modal visibility and comment to delete
  // { commentGroup: null, reply: null };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTargetIdxs, setDeleteTargetIdxs] = useState(NO_TARGET);

  useEffect(() => {
    console.log(
      'will reply to: ',
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
        // add to replies
        setComments(currComments => {
          currComments[replyTargetIdxs.commentGroup]
            .replies.push(newPost); // simplest: add to end of comment group
          return currComments;
        });
      }
      else {
        // add to comment groups
        setComments(currComments => [...currComments, newPost]);
      }

      setPostText('');
      setReplyTargetIdxs(NO_TARGET);
      // setReplyingToUsername(''); // already handled by other setter
      // console.log('adding new post:', newPost);
    }
  };

  // Function to delete post and open modal to confirm delete post
  const deletePost = ( idxObj ) => {
    setDeleteTargetIdxs(idxObj);
    setIsModalVisible(true);

    console.log(
      'initiate delete:',
      // idxObj,
      `commentGroup: ${idxObj?.commentGroup}\t`,
      `reply: ${idxObj?.reply}`
    );
  };

  // function to cancel delete post
  // Closes modal after delete post is cancelled
  const cancelDeletePost = () => {
    setDeleteTargetIdxs(NO_TARGET);
    setIsModalVisible(false);
  };

  // Function to confirm and delete post.
  // Closes modal after delete post is confirmed
  const confirmDeletePost = () => {
    // setComments(currComments => {
    //   const newComments = [...currComments];
    //   newComments.splice(deleteTargetIdxs, 1);
    //   return newComments;
    // });
    console.log(
      'confirmed delete:',
      `commentGroup: ${replyTargetIdxs?.commentGroup}\t`,
      `reply: ${replyTargetIdxs?.reply}`
    );
    if (deleteTargetIdxs?.reply) {
      // delete individual reply
      setComments(currComments => {
        const newComments = [...currComments];
        newComments[deleteTargetIdxs.commentGroup].replies
          .splice(deleteTargetIdxs.reply, 1);
        return newComments;
      });
    }
    else {
      // delete whole comment group
      setComments(currComments => {
        const newComments = [...currComments];
        newComments.splice(deleteTargetIdxs.commentGroup, 1);
        return newComments;
      });
    }
    setDeleteTargetIdxs(NO_TARGET);
    setIsModalVisible(false);
  };

  const editPost = ({ postObj }) => {
    alert('Editing not yet implemented');
  };

  return (
    <>
      <DeletionModal
        isModalVisible={isModalVisible}
        cancelDeletePost={cancelDeletePost}
        confirmDeletePost={confirmDeletePost}
      />
      <CommentsList
        comments={comments}
        replyTargetIdxs={replyTargetIdxs}
        setReplyTargetIdxs={setReplyTargetIdxs}
        handleClickDelete={deletePost}
        handleClickEdit={editPost}
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
