import { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
// import PropTypes from 'prop-types';

import MyButton from '../components/MyButton';
import MyText from '../components/MyText';
import MyCard from '../components/MyCard';
import IconDelete from '../components/svgs/IconDelete';
import IconEdit from '../components/svgs/IconEdit';
import IconMinus from '../components/svgs/IconMinus';
import IconPlus from '../components/svgs/IconPlus';
import IconReply from '../components/svgs/IconReply';

import data from '../assets/data/data.json';
import requiredAvatars from '../assets/images/avatars';
import colors from '../assets/colors';

const MainScreen = () => {
  const [comments, setComments] = useState([]);

  const [postText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');

  const addComment = () => {
    const newComment = { text: postText, replies: [] };
    if (postText !== '') {
      // use updater function for data locking
      setComments(currComments => [...currComments, newComment]);
      setCommentText('');
    }
  };

  const addReply = (commentIdx) => {
    if (replyText !== '') {
      // use updater function for data locking
      setComments(currComments => {
        currComments[commentIdx].replies.push(replyText);
        return currComments;
      });
      setReplyText('');
    }
  };

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
    // }
    // else {
    //   <MyButton>
    //     <MyText>Reply!</MyText>
    //   </MyButton>
    // }
    // See below for actual reply button design
  }

  const YouTag = ({ author }) => {
    if (author === data.currentUser.username) { // something like that
      return (
        <MyText style={styles.youTag}>you</MyText>
      );
    }
    else {
      return null;
    }
  }

  const tempUsername = 'juliusomo';

  const renderPost = ({ item, index }) => (
    <MyCard>
      {/* Will probably refactor comment/reply card to its own container so can be easily used for both comments & replies */}
      <View style={styles.cardTopRow}>
        <Image
          style={styles.avatar}
          source={requiredAvatars[item.username || tempUsername]}
        />
        <MyText style={styles.postAuthor}>Name</MyText>
        <YouTag author={item.username || tempUsername} />
        <MyText style={styles.timeAgo}># days ago</MyText>
      </View>
      <MyText style={styles.commentText}>
        <MyText style={styles.replyAtUsername}>@{item.username || tempUsername}</MyText>{' ' + item.text}
      </MyText>
      <View style={styles.cardBottomRow}>
        <View
          style={styles.vote}           
          // testID="`votes_${commentId}_${replyId}`"
        >
          <IconPlus />
          <MyText style={styles.voteText}>#</MyText>
          <IconMinus />
        </View>
        <View style={styles.onPostActionButtonsView}>
          <ActionButtons />
        </View>
      </View>

      <View style={[styles.myCard, styles.replyContainer]}>
        {item.replies.map((reply, i) => (
          <MyText key={i} style={styles.replyText}>
            {reply}
          </MyText>
        ))}
      </View>

      <View style={styles.replyInputContainer}>
        <TextInput
          style={styles.replyInput}
          value={replyText}
          onChangeText={setReplyText}
          placeholder='Reply to this comment'
          onSubmitEditing={() => addReply(index)}
        />
        <MyButton
          style={styles.onPostActionButton}
          onPress={() => addReply(index)}
          // testID="`replyButton_${commentId}_${replyId}`"
        >
          <IconReply style={styles.onPostActionButtonIcon} />
          <MyText
            style={[styles.onPostActionText, { color: colors.primary.moderateBlue }]}
          >Reply</MyText>
        </MyButton>
      </View>
    </MyCard>
  );

  return (
    <>
      {/* FlatList is scrollable element */}
      <FlatList
        style={styles.commentsList}
        data={comments}
        renderItem={renderPost}
        keyExtractor={(item, index) => index.toString()}
        testID='commentsList'
      />

      <MyCard style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={postText}
          onChangeText={setCommentText}
          placeholder='Add a comment...'
          onSubmitEditing={addComment}
          multiline={true}
          // maxLength={}
          testID='input'
        />
        <View style={styles.cardBottomRow}>
          <Image
            style={styles.avatar}
            source={requiredAvatars[data.currentUser.username]}
          />
          <MyButton style={styles.sendButton} onPress={addComment}>
            <MyText style={styles.sendButtonText}>SEND</MyText>
          </MyButton>
        </View>
      </MyCard>
    </>
  );
};

/* Styles */
const styles = StyleSheet.create({
  cardTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
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
  timeAgo: {
    fontWeight: '400',
    color: colors.neutral.grayishBlue,
    // textAlign: 'left',
  },
  cardBottomRow: {
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
    width: 50,
    marginLeft: 30,
  },
  onPostActionButtonIcon: {
    marginRight: 5,
  },
  onPostActionText: {
    fontWeight: '700',
  },
  commentsList: {
    flex: 1,
    height: '100%',
    marginBottom: 10,
  },
  commentText: {
    width: '100%',
    marginTop: 20,
    textAlign: 'left',
    // fontSize: 16,
    fontWeight: '400',
    color: colors.neutral.grayishBlue,
  },
  replyAtUsername: {
    fontWeight: '700',
    color: colors.primary.moderateBlue,
    // marginRight: 10,
  },
  replyContainer: {
    // marginVertical: 5,
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
  // replyButtonText: {
  //   // marginLeft: 5,
  //   color: primaryColors.moderateBlue,
  //   fontWeight: '700',
  //   // fontSize: 16,
  // },
  inputContainer: {
    // alignSelf: 'flex-end',
    // height: 200,
    // marginBottom: 0,
  },
  input: {
    // flex: 1,
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // fontSize: 16,
    // marginRight: 10,
    textAlignVertical: 'top',
    // padding: 20,
  },
  sendButton: {
    height: 60,
    width: 120,
    backgroundColor: colors.primary.moderateBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: colors.neutral.white,
    fontSize: 20,
    fontWeight: '700',
  },
});

export default MainScreen;
