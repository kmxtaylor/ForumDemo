import { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
// import PropTypes from 'prop-types';

import MyButton from '../../components/MyButton';
import MyText from '../../components/MyText';
import MyCard from '../../components/MyCard';
import IconDelete from '../../components/svgs/IconDelete';
import IconEdit from '../../components/svgs/IconEdit';
import IconMinus from '../../components/svgs/IconMinus';
import IconPlus from '../../components/svgs/IconPlus';
import IconReply from '../../components/svgs/IconReply';
import InputContainer from './InputContainer';

import colors from '../../assets/colors';
import data from '../../assets/data/data.json';
import { avatars, avatarStyles } from '../../assets/images/avatars';
import { accessibilityStateKeys } from '@testing-library/react-native/build/helpers/accessiblity';

const CommentsList = ({ 
  setComments, // won't need to pass in after I change reply functionality
  comments, style, ...rest }) => {

  const [replyText, setReplyText] = useState('');

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
  
  // useState for modal visibility and comment to delete.
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentToDelete, setcommentToDelete] = useState(null);
  
  // Function to delete post and open modal to confirm delete post
  const deletePost = (item) => {
    setcommentToDelete(item);
    setIsModalVisible(true);
  };
  
  // Function to confirm and delete post.
  // Closes modal after delete post is confirmed
  const confirmDeletePost = () => {
    setComments(currComments => {
      const newComments = [...currComments];
      newComments.splice(commentToDelete, 1);
      return newComments;
    });
    setIsModalVisible(false);
  };
  
  // function to cancel delete post
  // Closes modal after delete post is cancelled
  const cancelDeletePost = () => {
    setIsModalVisible(false);
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
        
        {/* Modal for Delete Confirmation*/}
        <Modal
          animationType='fade'
          transparent={true}
          visible={isModalVisible}
        >
          <View style={styles.modal}>
            <MyCard style={styles.modalContent}>
             
              <MyText style={styles.modalTitle}>Delete comment</MyText>
             
              <MyText style={styles.modalText}> 
                Are you sure you want to delete this comment?
                This will remove the comment and can't be undone.
              </MyText>
             
              <View style={styles.modalButtonContainer}>
             
                {/* marginRight & marginLeft is used to help with button spacing */}
                <MyButton
                    onPress={cancelDeletePost} 
                      style={[styles.modalButton, {backgroundColor:'hsl(211, 10%, 45%)'}, {marginLeft: 15}]}>
                    <MyText style={styles.modalButtonText}>NO, CANCEL</MyText>
                </MyButton>
                
                <MyButton
                  onPress={confirmDeletePost} 
                    style={[styles.modalButton, {backgroundColor: 'hsl(358, 79%, 66%)',}, {marginRight: 15}]}>  
                  <MyText style={styles.modalButtonText}>YES, DELETE</MyText>
                </MyButton>
                
              </View>
            </MyCard>
          </View>
        </Modal>
      </>
    );
    // }
    // else {
    //   <MyButton>
    //     <MyText>Reply!</MyText>
    //   </MyButton>
    // }
    // See below for actual reply button design
  };

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
          source={avatars[item.username || tempUsername]}
        />
        <MyText style={styles.postAuthor}>Name</MyText>
        <YouTag author={item.username || tempUsername} />
        <MyText style={styles.timeAgo}># days ago</MyText>
      </View>
      <MyText style={styles.commentText}>
        <MyText style={styles.replyAtUsername}>@{item.username || tempUsername}</MyText>{' ' + item.text}
      </MyText>
      <View style={styles.cardActionsRow}>
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

      <MyCard style={styles.replyContainer}>
        {item.replies.map((reply, i) => (
          <MyText key={i} style={styles.replyText}>
            {reply}
          </MyText>
        ))}
      </MyCard>

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
    <FlatList // scrollable
      style={styles.commentsList}
      data={comments}
      renderItem={renderPost}
      keyExtractor={(item, index) => index.toString()}
      testID='commentsList'
    />
  );
};

/* Styles */
const styles = StyleSheet.create({
  ...avatarStyles,
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
  timeAgo: {
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

  // Modal styles 
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 50% opacity black background   
  },
  // Pop-up modal container
  modalContent: {
    height: 227,
    width: 380,
    //padding: 20,
    backgroundColor:'hsl(0, 0%, 100%)',
    borderRadius: 6,
  },
  // Modal header
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Rubik_700Bold',
    marginRight: 161,
    marginBottom: 20,
    color: colors.red,
  },
  // Modal text (body)
  modalText: {
    fontSize: 16,
    fontFamily: 'Rubik_400Regular',
    textAlign: 'left',
    marginLeft: 13.6,
    marginBottom: 20,
    color: ' hsl(211, 10%, 45%)' // Grayish blue text
  },
  // Modal buttons container
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  // Modal buttons (Cancel and Delete)
  modalButton: {
    width: 150,
    height: 50,
    marginHorizontal: 8, //margin between buttons
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  // Modal button text
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Rubik_500Medium',
    color: "hsl(0, 0%, 100%)"
  },
});

export default CommentsList;
