import { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import MyButton from '../../components/MyButton';
import MyText from '../../components/MyText';
import MyCard from '../../components/MyCard';
import IconDelete from '../../components/svgs/IconDelete';
import IconEdit from '../../components/svgs/IconEdit';
import IconMinus from '../../components/svgs/IconMinus';
import IconPlus from '../../components/svgs/IconPlus';
import IconReply from '../../components/svgs/IconReply';

import colors from '../../assets/colors';
import data from '../../assets/data/data.json';
import { avatars, avatarStyles } from '../../assets/images/avatars';
// import { accessibilityStateKeys } from '@testing-library/react-native/build/helpers/accessiblity';

const CommentsList = ({
  comments, replyTargetIdxs, setReplyTargetIdxs, handleClickDelete, handleClickEdit, style, ...rest
}) => {  
  

  const PostActionButtons = ({ postObj, commentGroupIdx, replyIdx }) => {
    if (postObj.user.username === data.currentUser.username) {
      return (
        <>
          <MyButton
            style={styles.onPostActionButton}
            // style={styles.deleteButton}
            onPress={() => handleClickDelete(
              { commentGroup: commentGroupIdx, reply: replyIdx }
            )}
            // onPress={() => console.log(`{ commentGroup: ${commentGroupIdx}, reply: ${replyIdx} }`)}
          >
            <IconDelete style={styles.onPostActionButtonIcon} />
            <MyText style={{fontWeight: '700', color: colors.primary.softRed}}
            >Delete</MyText>
          </MyButton>
          <MyButton
            style={styles.onPostActionButton}
            // style={styles.editButton}
            onPress={() => handleClickEdit(
              { commentGroup: commentGroupIdx, reply: replyIdx }
            )}
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
          <MyButton
            style={[styles.onPostActionButton, {width: 120}]}
            onPress={() => setReplyTargetIdxs(null)} // NO_TARGET
            // testID="`cancelReplyButton_${commentId}_${replyId}`"
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
          <MyButton
            style={styles.onPostActionButton}
            onPress={() => setReplyTargetIdxs(
              { commentGroup: commentGroupIdx, reply: replyIdx }
            )}
            // testID="`replyButton_${commentId}_${replyId}`"
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
    const [score, setScore] = useState(postObj.score);
    const [voteStatus, setVoteStatus] = useState(postObj.voteStatus || null);

    const handleUpvote = () => {
      if (voteStatus === 'up') {
        // undo upvote
        setScore(score - 1);
        setVoteStatus(null);
      } else if (voteStatus === 'down') {
          // change downvote to upvote
          setScore(score + 2);
          setVoteStatus('up');
        } else {
            // upvote
            setScore(score + 1);
            setVoteStatus('up');
          }
      };

      const handleDownvote = () => {
        if (voteStatus === 'down') {
          // undo downvote
          setScore(score + 1);
          setVoteStatus(null);
        } else if (voteStatus === 'up') {
            // change upvote to downvote
            setScore(score - 2); // subtract 2 instead of 1
            setVoteStatus('down');
          } else {
              // downvote
              if (score === 0) {
                // do nothing
                return;
              }
              setScore(score - 1);
              setVoteStatus('down');
            }

        if (voteStatus === 'up' && score === 1) { // check if user cancels their downvote after previously upvoting
          // If previous vote status was up and the score is 1
          // then set the score to 0
          setScore(0);
          setVoteStatus(null);
        }
      };

    return (
      <MyCard key={commentGroupIdx} {...rest}>
        <View style={styles.cardTopRow}>
          <Image
            style={styles.avatar}
            source={avatars[postObj.user.username]}
          />
          <MyText style={styles.postAuthor}>{postObj.user.username}</MyText>
          {/* <YouTag postAuthor={postObj.user.username} /> */}
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
            // testID="`votes_${commentId}_${replyId}`"
          >
             <MyButton
            onPress={handleUpvote}
            style={[styles.voteButton, voteStatus === 'up' && styles.voteButtonActive]}
          >
            <IconPlus style={styles.voteIcon} />
          </MyButton>
          <MyText style={styles.voteScore}>{score}</MyText>
          <MyButton
            onPress={handleDownvote}
            style={[styles.voteButton, voteStatus === 'down' && styles.voteButtonActive]}
          >
            <IconMinus style={styles.voteIcon} />
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
            style={replyIdx === 0 ? {marginTop:0} : {}} // for border appearance
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
      testID='commentsList'
    />
  );
};

/* Styles */
const styles = StyleSheet.create({
  ...avatarStyles,
  commentsList: {
    flex: 1,
    height: '100%',
    // marginBottom: 10,
  },
  postGroupContainer: {
    // width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 15,
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
    color: colors.primary.darkBlue,
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
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  vote: {
    flexDirection: 'row',
    height: '100%',
    width: 120,
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
    marginTop: 15,
    width: '100%',
    paddingLeft: 15,

    borderLeftWidth: 1,
    borderLeftColor: colors.neutral.lightGray,
  },
});

export default CommentsList;
