import { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import MyButton from 'components/MyButton';
import MyText from 'components/MyText';
import MyCard from 'components/MyCard';
import IconDelete from 'components/svgs/IconDelete';
import IconEdit from 'components/svgs/IconEdit';
import IconMinus from 'components/svgs/IconMinus';
import IconPlus from 'components/svgs/IconPlus';
import IconReply from 'components/svgs/IconReply';
import InputContainer from './InputContainer';

import Voting from '../../utils/Voting';

import colors from '../../../assets/colors';
import data from '../../../assets/data/data.json';
import { avatars, avatarStyles } from '../../../assets/images/avatars';
// import { accessibilityStateKeys } from '@testing-library/react-native/build/helpers/accessiblity';

const CommentsList = ({
  comments, replyTargetIdxs, setReplyTargetIdxs, handleClickDelete, handleClickEdit, style, ...rest
}) => {  

  const PostActionButtons = ({ postObj, commentGroupIdx, replyIdx }) => {
    const replyInputRef = useRef(null);
    const editInputRef = useRef(null);

    if (postObj.user.username === data.currentUser.username) {
      return (
        <>
          <MyButton
          InputContainer replyInputRef={replyInputRef} editInputRef={editInputRef} 

            style={styles.onPostActionButton}
            // style={styles.deleteButton}
            onPress={() => handleClickDelete(
              { commentGroup: commentGroupIdx, reply: replyIdx }
            )}
            // onPress={() => console.log(`{ commentGroup: ${commentGroupIdx}, reply: ${replyIdx} }`)}
            testID={`delete-button-${postObj.id}`}
          >
            <IconDelete style={styles.onPostActionButtonIcon} />
            <MyText style={{fontWeight: '700', color: colors.primary.softRed}}
            >Delete</MyText>
          </MyButton>
          <MyButton
            style={styles.onPostActionButton}
            // style={styles.editButton}
            onPress={() => {
              handleClickEdit({ commentGroup: commentGroupIdx, reply: replyIdx });
              // editInputRef.current.focus();
            }}
            // ref={editInputRef}
            testID={`edit-button-${postObj.id}`}
            // onPress={() => console.log(`{ commentGroup: ${commentGroupIdx}, reply: ${replyIdx} }`)}
          >
            <IconEdit style={styles.onPostActionButtonIcon} />
            <MyText style={{fontWeight: '700', color: colors.primary.moderateBlue}}
            >Edit</MyText>
          </MyButton>
        </>
      );
    }
    else {
      if (
        replyTargetIdxs?.reply === replyIdx
        && replyTargetIdxs?.commentGroup === commentGroupIdx
      ) {
        return (
          // Cancel Reply Button
          <MyButton
            style={[styles.onPostActionButton, {width: 120}]}
            onPress={() => setReplyTargetIdxs(null)} // NO_TARGET
            testID={`cancel-reply-button${postObj.id}`}
          >
            <MyText
              style={{fontWeight: '700', color: colors.primary.softRed}}
            >
              X Cancel Reply
            </MyText>
          </MyButton>
        );
      }
      else {
        return (
          // Reply Button
          <MyButton
            style={styles.onPostActionButton}
            onPress={() => {
              setReplyTargetIdxs({ commentGroup: commentGroupIdx, reply: replyIdx });
              // replyInputRef.current.focus();
            }}
            // ref={replyInputRef}
            testID={`reply-button-${postObj.id}`}
          >
            <IconReply style={styles.onPostActionButtonIcon} />
            <MyText
              style={{fontWeight: '700', color: colors.primary.moderateBlue}}
            >
              Reply
            </MyText>
          </MyButton>
        );
      }
    }
  };

  const Post = ({
    postType = 'comment', postObj, commentGroupIdx, replyIdx = null, ...rest
  }) => {
    
    // Voting values & functions are returned from the Voting hook
    const [score, voteStatus, handleUpvote, handleDownvote] = Voting(postObj.score, postObj.voteStatus);

    return (
      <MyCard key={commentGroupIdx} {...rest}>
        <View style={styles.cardTopRow}>
          <Image
            style={styles.avatar}
            source={avatars[postObj.user.username]}
          />
          <MyText style={styles.postAuthor}>{postObj.user.username}</MyText>
          {
            postObj.user.username === data.currentUser.username
            ? <MyText style={styles.youTag}>you</MyText>
            : null
          }
          <MyText style={styles.createdAt}>{postObj.createdAt}</MyText>
        </View>
        <MyText style={styles.postText}>
          { postType === 'reply' && (
              <MyText style={styles.replyAtTag}>
                @{postObj.replyingTo}
              </MyText>
            )
          }
          {' ' + postObj.content}
        </MyText>
        <View style={styles.cardActionsRow}>
          <View
            style={styles.vote}           
            // testID={`votes-${postObj.id}`}
          >
          <MyButton
            onPress={handleUpvote}
            //style={styles.voteButton}
          >
          <IconPlus style={styles} />
          </MyButton>
          <MyText style={styles.voteText}>{score}</MyText>
          <MyButton
            onPress={handleDownvote}
            //style={styles.voteButton}
          >
            <IconMinus style={styles} />
          </MyButton>
          </View>
          <View style={styles.onPostActionButtonsView}>
            <PostActionButtons
              postObj={postObj}
              commentGroupIdx={commentGroupIdx}
              replyIdx={replyIdx}
            />
          </View>
        </View>
      </MyCard>
    );
  };

  const renderPostGroup = ({ item, index: commentGroupIdx }) => (
    // Will probably refactor comment/reply card to its own container so can be easily used for both comments & replies
    <View style={styles.postGroupContainer}>
      <Post type='comment' postObj={item} commentGroupIdx={commentGroupIdx}/>

      <View style={styles.repliesContainer}>
        {item.replies.map((reply, replyIdx) => (
          <Post
            key={replyIdx}
            postType='reply'
            postObj={reply}
            commentGroupIdx={commentGroupIdx}
            replyIdx={replyIdx}
          />
        ))}
      </View>
    </View>
  );

  return (
    
    <FlatList // scrollable
      style={styles.commentsList}
      data={comments}
      renderItem={renderPostGroup}
      keyExtractor={(item, index) => index.toString()}
      testID='comments-list'
    />
    
  );
};

/* Styles */
const styles = StyleSheet.create({
  ...avatarStyles,
  commentsList: {
    flex: 1,
    // height: '100%',
    // marginBottom: 10,
    // gap: 20, // doesn't work, I think b/c of item rendering
  },
  postGroupContainer: {
    // width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 10,
  },
  cardTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 10,
  },
  postAuthor: {
    fontWeight: '700',
    marginRight: 10,
    color: colors.neutral.darkBlue,
  },
  youTag: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginRight: 10,
    borderRadius: 2,
    backgroundColor: colors.primary.moderateBlue,
    color: colors.neutral.white,
    fontWeight: '500',
    fontSize: 13,
  },
  createdAt: {
    fontWeight: '400',
    color: colors.neutral.grayishBlue,
    // textAlign: 'left',
  },
  cardActionsRow: { // should probably be extracted
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  vote: {
    flexDirection: 'row',
    height: '100%',
    // height: 40,
    width: 110,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.neutral.veryLightGray,
    borderRadius: 10,
  },
  voteText: {
    fontWeight: '700',
    color: colors.primary.moderateBlue,
  },
  onPostActionButtonsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  onPostActionButton: {
    height: '100%',
    width: 65,
    marginLeft: 10,
  },
  onPostActionButtonIcon: {
    marginRight: 5,
  },
  // onPostActionText: {
  //   fontWeight: '700',
  // },
  postText: {
    width: '100%',
    marginTop: 20,
    textAlign: 'left',
    // fontSize: 16,
    fontWeight: '400',
    color: colors.neutral.grayishBlue,
  },
  replyAtTag: {
    fontWeight: '700',
    color: colors.primary.moderateBlue,
    // marginRight: 10,
  },
  repliesContainer: {
    width: '100%',
    gap: 10,
    marginTop: 10,
    paddingLeft: 15,

    borderLeftWidth: 2,
    borderLeftColor: colors.neutral.lightGray,
  },
});

export default CommentsList;
