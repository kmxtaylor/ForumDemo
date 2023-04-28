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
import IconDelete from '../components/svgs/IconDelete';
import IconEdit from '../components/svgs/IconEdit';
import IconMinus from '../components/svgs/IconMinus';
import IconPlus from '../components/svgs/IconPlus';
import IconReply from '../components/svgs/IconReply';

import data from '../assets/data/data.json';
import requiredAvatars from '../assets/images/avatars';

const MainScreen = () => {
  const [comments, setComments] = useState([]);

  const [postText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');

  const addComment = () => {
    if (postText !== '') {
      setComments([...comments, { text: postText, replies: [] }]);
      setCommentText('');
    }
  };

  const addReply = (index) => {
    if (replyText !== '') {
      let updatedComments = [...comments];
      updatedComments[index].replies.push(replyText);
      setComments(updatedComments);
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
          <MyText style={[styles.onPostActionText, { color: primaryColors.softRed }]}
          >Delete</MyText>
        </MyButton>
        <MyButton
          style={styles.onPostActionButton}
          // style={styles.editButton}
          onPress={() => editPost(item)}
        >
          <IconEdit style={styles.onPostActionButtonIcon} />
          <MyText style={[styles.onPostActionText, { color: primaryColors.moderateBlue }]}
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

  const renderPost = ({ item, index }) => (
    <View style={[styles.myCard, styles.commentContainer]}>
      {/* Will probably refactor comment/reply card to its own container so can be easily used for both comments & replies */}
      <View style={styles.cardTopRow}>
        <Image
          style={styles.avatar}
          source={requiredAvatars['juliusomo']}
        />
        <MyText style={styles.postAuthor}>Name</MyText>
        <YouTag author={'juliusomo'} />
        <MyText style={styles.timeAgo}># days ago</MyText>
      </View>
      <MyText style={styles.commentText}>
        <MyText style={styles.replyAtUsername}>@username</MyText>{' ' + item.text} {/* source username from reply obj */}
      </MyText>
      <View style={styles.cardBottomRow}>
        <View style={styles.vote}> {/* add testId=“vote_”+commentId+"_"+replyId */}
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
        {/* add testId=“button_”+commentId+”_”+replyId */}
        <MyButton style={styles.onPostActionButton} onPress={() => addReply(index)}>
          <IconReply style={styles.onPostActionButtonIcon} />
          <MyText
            style={[styles.onPostActionText, { color: primaryColors.moderateBlue }]}
          >Reply</MyText>
        </MyButton>
      </View>
    </View>
  );

  return (
    <>
      {/* <View style={styles.mainScreen}> */}
      {/* FlatList is scrollable element */}
      <FlatList
        style={styles.commentsList}
        data={comments}
        renderItem={renderPost}
        keyExtractor={(item, index) => index.toString()}
        testID='commentsList'
      />

      <View style={[styles.myCard, styles.inputContainer]}>
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
      </View>
      {/* </View> */}
    </>
  );
};

/* Colors */
const primaryColors = {
  moderateBlue: 'hsl(238, 40%, 52%)',
  softRed: 'hsl(358, 79%, 66%)',
  lightGrayishBlue: 'hsl(239, 57%, 85%)',
  paleRed: 'hsl(357, 100%, 86%)',
};

const neutralColors = {
  darkBlue: 'hsl(212, 24%, 26%)',
  grayishBlue: 'hsl(211, 10%, 45%)',
  lightGray: 'hsl(223, 19%, 93%)',
  veryLightGray: 'hsl(228, 33%, 97%)',
  white: 'hsl(0, 0%, 100%)',
};

/* Styles */
const styles = StyleSheet.create({
  // mainScreen: {
  //   flex: 1,
  //   // height: '100%',
  //   alignItems: 'space-between',
  //   justifyContent: 'space-between',
  // },
  myCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 15,
    // marginBottom: 5,
    backgroundColor: neutralColors.white,
    borderRadius: 10,
    // borderWidth: 1,
  },
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
    color: primaryColors.darkBlue,
  },
  youTag: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginRight: 10,
    borderRadius: 2,
    backgroundColor: primaryColors.moderateBlue,
    color: neutralColors.white,
    fontWeight: '500',
    fontSize: 13,
  },
  timeAgo: {
    fontWeight: '400',
    color: neutralColors.grayishBlue,
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
    backgroundColor: neutralColors.veryLightGray,
    borderRadius: 10,
  },
  voteText: {
    fontWeight: '700',
    color: primaryColors.moderateBlue,
  },
  // voteControl: {
  //   // color: neutralColors.lightGray,
  //   color: neutralColors.grayishBlue, // not sure if this is right but not better option
  //   fontSize: 20,
  // },
  // voteCount: {
  //   color: primaryColors.moderateBlue,
  // },
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
  commentContainer: {
    // backgroundColor: '#fff',
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  commentText: {
    width: '100%',
    marginTop: 20,
    textAlign: 'left',
    // fontSize: 16,
    fontWeight: '400',
    color: neutralColors.grayishBlue,
  },
  replyAtUsername: {
    fontWeight: '700',
    color: primaryColors.moderateBlue,
    // marginRight: 10,
  },
  replyContainer: {
    // marginVertical: 5,
  },
  replyText: {
    // fontSize: 16,
    fontWeight: '500',
    color: neutralColors.grayishBlue,
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
    borderColor: neutralColors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    // fontSize: 16,
  },
  replyButton: {
    backgroundColor: neutralColors.white,
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
    borderColor: neutralColors.lightGray,
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
    backgroundColor: primaryColors.moderateBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: neutralColors.white,
    fontSize: 20,
    fontWeight: '700',
  },
});

export default MainScreen;
