import { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
// import PropTypes from 'prop-types';

import MyButton from '../components/MyButton';
import MyText from '../components/MyText';

const MainScreen = () => {
  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');

  const addComment = () => {
    if (commentText !== '') {
      setComments([...comments, { text: commentText, replies: [] }]);
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

  const renderActionButtons = ({item}) => {
    if (item?.author === 'you') {
      return (
        <>
          <MyButton>
            <MyText>Delete</MyText>
          </MyButton>
          <MyButton>
            <MyText>Edit</MyText>
          </MyButton>
        </>
      ); 
    }
    else {
      <MyButton>
        <MyText>Reply!</MyText>
      </MyButton>
    }
  }
      

  const renderPost = ({ item, index }) => (
    <View style={[styles.myCard, styles.commentContainer]}>
      {/* Will probably refactor comment/reply card to its own container so can be easily used for both comments & replies */}
      <View style={styles.cardTopRow}>
        <MyText style={styles.img}>Photo</MyText>
        <MyText style={styles.postAuthor}>Name</MyText>
        <MyText style={styles.itsYou}>you</MyText>
        {/* ^ indicator for whether it's you, but idk how to display conditionally */}
        <MyText style={styles.timeAgo}># days ago</MyText>
      </View>
      <MyText style={styles.commentText}>
        <MyText style={styles.replyAtUsername}>@username</MyText>{' ' + item.text}
      </MyText>
      <View style={styles.cardBottomRow}>
        <View style={styles.vote}>
          <MyButton><MyText style={[styles.voteText, styles.voteControl]}>+</MyText></MyButton>
          <MyText style={[styles.voteText, styles.voteCount]}>#</MyText>
          <MyButton><MyText style={[styles.voteText, styles.voteControl]}>-</MyText></MyButton>
        </View>
        <View style={styles.actionButtons}>
          {/* this isn't appearing yet */}
          {(item) => renderActionButtons(item)}
          <MyText>Action Buttons</MyText>
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
          style={styles.replyButton}
          onPress={() => addReply(index)}
        >
          <MyText style={styles.replyButtonText}>Reply</MyText>
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
      />

      <View style={[styles.myCard, styles.inputContainer]}>
        <TextInput
          style={styles.input}
          value={commentText}
          onChangeText={setCommentText}
          placeholder='Add a comment...'
          onSubmitEditing={addComment}
          multiline={true}
          // maxLength={}
        />
        <View style={styles.cardBottomRow}>
          <MyText>Photo</MyText>
          <MyButton style={styles.addButton} onPress={addComment}>
            <MyText style={styles.addButtonText}>+</MyText>
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
  img: {
    marginRight: 10,
  },
  postAuthor: {
    fontWeight: '700',
    marginRight: 10,
  },
  itsYou: {
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
    fontWeight: '500',
    color: neutralColors.grayishBlue,
    // textAlign: 'left',
  },
  cardBottomRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  vote: {
    flexDirection: 'row',
    height: 40,
    width: 100,
    justifyContent: 'space-around',
    backgroundColor: neutralColors.veryLightGray,
    borderRadius: 10,
  },
  voteText: {
    fontWeight: '700',
    padding: 5,
    marginTop: 0,
  },
  voteControl: {
    // color: neutralColors.lightGray,
    color: neutralColors.grayishBlue, // not sure if this is right but not better option
    fontSize: 20,
  },
  voteCount: {
    color: primaryColors.moderateBlue,
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
    fontWeight: '500',
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
    color: '#666',
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
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    // fontSize: 16,
  },
  replyButton: {
    backgroundColor: '#3F51B5',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    fontWeight: '700',
  },
  replyButtonText: {
    color: '#fff',
    // fontSize: 16,
  },
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
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // fontSize: 16,
    // marginRight: 10,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#3F51B5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default MainScreen;
