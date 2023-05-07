import { useState, useEffect, useRef } from 'react';

import InputContainer from './InputContainer';
import CommentsList from './CommentsList';
import DeletionModal from './DeletionModal';

import data from '/../assets/data/data.json';

/* Manage data between CommentList */
const Forum = () => {
  // const [comments, setComments] = useState([]);
  const [comments, setComments] = useState(data.comments);
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

  // model edit functionality state management after delete
  const [editTargetIdxs, setEditTargetIdxs] = useState(NO_TARGET);

  /* Init Refs */
  const textInputRef = useRef(null);

  useEffect(() => {
    // console.log(
    //   'will reply to: ',
    //   `commentGroup: ${replyTargetIdxs?.commentGroup}\t`,
    //   `reply: ${replyTargetIdxs?.reply}`
    // );

    // change input placeholder
    let placeholder;
    if (replyTargetIdxs) {
      let commentGroup = { ...comments[replyTargetIdxs.commentGroup] };
      const replyToName = (
        commentGroup?.replies?.[replyTargetIdxs?.reply]?.user?.username
        ?? commentGroup?.user?.username
      );
      setReplyingToUsername(replyToName); // store for easier tagging reference
      placeholder = `Type a reply to @${replyToName}...`;

      // show keyboard when reply button is pressed
      textInputRef.current.focus();
    }
    else {
      setReplyingToUsername('');
      placeholder = 'Type a comment...';
    }
    setInputPlaceholder(placeholder);
    // console.log(placeholder);
  }, [replyTargetIdxs]);

  useEffect(() => {
    if (editTargetIdxs) {
      // show keyboard when edit button is pressed
      textInputRef.current.focus();
    }
  }, [editTargetIdxs]);

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
  const startDeletePost = (idxObj) => {
    setDeleteTargetIdxs(idxObj);
    setIsModalVisible(true);

    // console.log(
    //   'initiate delete:',
    //   // idxObj,
    //   `commentGroup: ${idxObj?.commentGroup}\t`,
    //   `reply: ${idxObj?.reply}`
    // );
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
    // console.log(
    //   'confirmed delete:',
    //   `commentGroup: ${deleteTargetIdxs?.commentGroup}\t`,
    //   `reply: ${deleteTargetIdxs?.reply}`
    // );
    if (deleteTargetIdxs?.reply !== NO_TARGET) {
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

    // if deleting comment you were editing, clear edit state
    if (
      deleteTargetIdxs?.reply === editTargetIdxs?.reply
      && deleteTargetIdxs?.commentGroup === editTargetIdxs?.commentGroup
    ) {
      setEditTargetIdxs(NO_TARGET);
      setPostText('');
      // console.log('deleted comment you were editing; exiting edit mode');
    }

    setDeleteTargetIdxs(NO_TARGET);
    setIsModalVisible(false);
  };

  const startEditPost = (idxObj) => {
    setEditTargetIdxs(idxObj); // may be unnecessary
    // console.log(
    //   'initiate edit:',
    //   // idxObj,
    //   `commentGroup: ${idxObj?.commentGroup}\t`,
    //   `reply: ${idxObj?.reply}`
    // );

    if (idxObj?.reply !== NO_TARGET) {
      // edit reply
      setPostText(
        comments[idxObj.commentGroup].replies[idxObj.reply].content
      );
    }
    else {
      // edit parent comment of comment group
      setPostText(
        comments[idxObj.commentGroup].content
      );
    }
  };

  const saveEdits = () => {
    // we should eventually handle the edge case where you start editing and then you delete the comment you were editing
    // console.log(
    //   'saved edits:',
    //   `commentGroup: ${editTargetIdxs?.commentGroup}\t`,
    //   `reply: ${editTargetIdxs?.reply}`
    // );

    if (editTargetIdxs?.reply !== NO_TARGET) {
      // edit reply
      setComments(currComments => {
        const newComments = [...currComments];
        newComments[editTargetIdxs.commentGroup]
          .replies[editTargetIdxs.reply].content = postText;
        return newComments;
      });
    }
    else {
      // edit parent comment of comment group
      setComments(currComments => {
        const newComments = [...currComments];
        newComments[editTargetIdxs.commentGroup].content = postText;
        return newComments;
      });
    }

    setEditTargetIdxs(NO_TARGET);
    setPostText('');
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
        handleClickDelete={startDeletePost}
        handleClickEdit={startEditPost}
      />
      <InputContainer
        displayedVal={postText}
        handleKeyPress={setPostText}
        handleSendPost={addPost}
        handleSaveEdits={saveEdits}
        placeholder={inputPlaceholder}
        editingMode={editTargetIdxs !== NO_TARGET}
        textInputRef={textInputRef}
      />
    </>
  );
};

export default Forum;
