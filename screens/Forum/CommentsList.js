import { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  Modal,
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
import { accessibilityStateKeys } from '@testing-library/react-native/build/helpers/accessiblity';

const CommentsList = ({
  comments, replyTargetIdxs, setReplyTargetIdxs, style, ...rest
}) => {
  
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
          <MyText style={{fontWeight: '700', color: colors.primary.softRed}}
          >Delete</MyText>
        </MyButton>
        <MyButton
          style={styles.onPostActionButton}
          // style={styles.editButton}
          onPress={() => editPost(item)}
        >
          <IconEdit style={styles.onPostActionButtonIcon} />
          <MyText style={{fontWeight: '700', color: colors.primary.moderateBlue}}
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
  };

  const ReplyControls = ({ postObj, commentGroupIdx, replyIdx }) => {
    
    if (
      replyTargetIdxs?.reply === replyIdx
      && replyTargetIdxs?.commentGroup === commentGroupIdx
    ) {
      return (
        <MyButton
          style={styles.onPostActionButton}
          onPress={() => setReplyTargetIdxs(null)} // NO_TARGET
          // testID="`cancelReplyButton_${commentId}_${replyId}`"
        >
          <MyText
            style={{fontWeight: '700', color: colors.primary.softRed}}
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
  };

  const tempUsername = 'juliusomo';

  const Post = ({
    postType = 'comment', postObj, commentGroupIdx, replyIdx = null, ...rest
  }) => {
    return (
      <MyCard key={commentGroupIdx} {...rest}>
        <View style={styles.cardTopRow}>
          <Image
            style={styles.avatar}
            source={avatars[postObj.user.username || tempUsername]}
          />
          <MyText style={styles.postAuthor}>{postObj.user.username}</MyText>
          {/* <YouTag postAuthor={postObj.user.username || tempUsername} /> */}
          {
            (postObj.user.username || tempUsername) === data.currentUser.username
            ? <MyText style={styles.youTag}>you</MyText>
            : null
          }
          <MyText style={styles.createdAt}>{postObj.createdAt}</MyText>
        </View>
        <MyText style={styles.postText}>
          { postType === 'reply' && (
              <MyText style={styles.replyAtTag}>
                @{postObj.user.username || tempUsername}
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
            <IconPlus />
            <MyText style={styles.voteText}>{postObj.score}</MyText>
            <IconMinus />
          </View>
          <View style={styles.onPostActionButtonsView}>
            <ActionButtons />
          </View>
          {/* temp container, will delete after integrating other user data */}
          <View style={styles.replyInputContainer}>
            <ReplyControls
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
    fontFamily: 'Rubik_500Medium',
    marginRight: 164,
    marginBottom: 20,
    color: colors.red,
  },
  // Modal text (body)
  modalText: {
    fontSize: 17,
    fontFamily: 'Rubik_400Regular',
    textAlign: 'left',
    marginRight: 10,
    marginBottom: 20,
    letterSpacing: 0.8,
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
