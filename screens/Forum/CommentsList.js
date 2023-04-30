// import { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
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

const CommentsList = ({
  replyToIdx, setReplyToIdx, comments, style, ...rest
}) => {
  const deletePost = (item) => {
    alert('Deletion not yet implemented');
  };

  const editPost = (item) => {
    alert('Editing not yet implemented');
  };

  const ActionButtons = ({ item }) => {
    // if (item?.author === currentUser?.username) {
    return (
      <>
        <MyButton
          style={styles.onPostActionButton}
          // style={styles.deleteButton}
          onPress={() => deletePost(item)}
        >
          <IconDelete style={styles.onPostActionButtonIcon} />
          <MyText style={[styles.onPostActionText, { color: colors.primary.softRed }]}
          >Delete</MyText>
        </MyButton>
        <MyButton
          style={styles.onPostActionButton}
          // style={styles.editButton}
          onPress={() => editPost(item)}
        >
          <IconEdit style={styles.onPostActionButtonIcon} />
          <MyText style={[styles.onPostActionText, { color: colors.primary.moderateBlue }]}
          >Edit</MyText>
        </MyButton>
      </>
    );
  }

  const ReplyControls = ({ index }) => {
    if (replyToIdx === index) {
      return (
        <MyButton
          style={styles.onPostActionButton}
          onPress={() => setReplyToIdx(null)}
          // testID="`cancelReplyButton_${commentId}_${replyId}`"
        >
          <MyText
            style={[styles.onPostActionText, { color: colors.primary.softRed }]}
          >
            X Cancel
          </MyText>
        </MyButton>
      );
    }
    else {
      return (
        <MyButton
          style={styles.onPostActionButton}
          onPress={() => setReplyToIdx(index)}
          // testID="`replyButton_${commentId}_${replyId}`"
        >
          <IconReply style={styles.onPostActionButtonIcon} />
          <MyText
            style={[styles.onPostActionText, { color: colors.primary.moderateBlue }]}
          >
            Reply
          </MyText>
        </MyButton>
      );
    }
  };

  const tempUsername = 'juliusomo';

  const renderPostGroup = ({ item, index }) => (
    // Will probably refactor comment/reply card to its own container so can be easily used for both comments & replies
    <View style={styles.postGroupContainer}>
      <MyCard key={index}>
        <View style={styles.cardTopRow}>
          <Image
            style={styles.avatar}
            source={avatars[item.user.username || tempUsername]}
          />
          <MyText style={styles.postAuthor}>{item.user.username}</MyText>
          {/* <YouTag postAuthor={item.user.username || tempUsername} /> */}
          {
                (item.user.username || tempUsername) === data.currentUser.username
                ? <MyText style={styles.youTag}>you</MyText>
                : null
              }
          <MyText style={styles.createdAt}>{item.createdAt}</MyText>
        </View>
        <MyText style={styles.commentText}>
          {' ' + item.content}
        </MyText>
        <View style={styles.cardActionsRow}>
          <View
            style={styles.vote}           
            // testID="`votes_${commentId}_${replyId}`"
          >
            <IconPlus />
            <MyText style={styles.voteText}>{item.score}</MyText>
            <IconMinus />
          </View>
          <View style={styles.onPostActionButtonsView}>
            <ActionButtons />
          </View>
        </View>

        {/* temp container */}
        <View style={styles.replyInputContainer}>
          <ReplyControls index={index} />
        </View>

      </MyCard>

      <View style={styles.repliesContainer}>
        {item.replies.map((reply, i) => (
          <MyCard key={i} style={i === 0 ? {marginTop:0} : {}}>
            <View style={styles.cardTopRow}>
              <Image
                style={styles.avatar}
                source={avatars[reply.user.username || tempUsername]}
              />
              <MyText style={styles.postAuthor}>{reply.user.username}</MyText>
              {/* <YouTag postAuthor={reply.user.username || tempUsername} /> */}
              {
                (reply.user.username || tempUsername) === data.currentUser.username
                ? <MyText style={styles.youTag}>you</MyText>
                : null
              }
              <MyText style={styles.createdAt}>{reply.createdAt}</MyText>
            </View>
            <MyText style={styles.commentText}>
              <MyText style={styles.replyAtTag}>@{reply.user.username || tempUsername}</MyText>{' ' + reply.content}
            </MyText>
            <View style={styles.cardActionsRow}>
              <View
                style={styles.vote}           
                // testID="`votes_${commentId}_${replyId}`"
              >
                <IconPlus />
                <MyText style={styles.voteText}>{reply.score}</MyText>
                <IconMinus />
              </View>
              <View style={styles.onPostActionButtonsView}>
                <ActionButtons />
              </View>
            </View>
          </MyCard>
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
  onPostActionText: {
    fontWeight: '700',
  },
  commentText: {
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
  replyText: {
    // fontSize: 16,
    fontWeight: '500',
    color: colors.neutral.grayishBlue,
    marginVertical: 2,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical: 5,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    // fontSize: 16,
  },
  replyButton: {
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    fontWeight: '700',
  },
});

export default CommentsList;
