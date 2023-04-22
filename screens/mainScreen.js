import { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
// import PropTypes from 'prop-types';

// import MyButton from '../components/MyButton';
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

  const renderItem = ({ item, index }) => (
    <View style={styles.commentContainer}>
      <MyText weight={500} style={styles.commentText}>{item.text}</MyText>

      <View style={styles.replyContainer}>
        {item.replies.map((reply, i) => (
          <MyText key={i} weight={500} style={styles.replyText}>
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
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => addReply(index)}
        >
          <MyText weight={700} style={styles.replyButtonText}>Reply</MyText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        style={styles.commentsList}
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={commentText}
          onChangeText={setCommentText}
          placeholder='Add a comment'
          onSubmitEditing={addComment}
        />
        <TouchableOpacity style={styles.addButton} onPress={addComment}>
          <MyText weight={700} style={styles.addButtonText}>+</MyText>
        </TouchableOpacity>
      </View>
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
  White: 'hsl(0, 0%, 100%)',
};

/* Styles */
const styles = StyleSheet.create({
  commentsList: {
    flex: 1,
    marginBottom: 10,
  },
  commentContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentText: {
    // fontSize: 16,
  },
  replyContainer: {
    marginVertical: 5,
  },
  replyText: {
    // fontSize: 16,
    color: '#666',
    marginVertical: 2,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
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
  },
  replyButtonText: {
    color: '#fff',
    // fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // fontSize: 16,
    marginRight: 10,
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
  },
});

export default MainScreen;
