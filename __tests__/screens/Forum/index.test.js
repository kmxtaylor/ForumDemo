import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Forum from 'screens/Forum';
import { currentUser } from '/../assets/data/data.json';

const TIMEOUT = { timeout: 20000 };

describe('Forum functionality', () => {

  // test if can add comment
  test('comment adding correctly', async () =>  {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;

    // get elements relevant to test
    const input = getByTestId('input');
    const commentsList = getByTestId('comments-list');
    const sendButton = getByTestId('submit-button');

    // execute adding comment
    const COMMENT_TEXT = 'test comment';
    fireEvent.changeText(input, COMMENT_TEXT);
    fireEvent.press(sendButton);

    // check comment added
    const [ lastComment ] = commentsList.props.data.slice(-1);
    expect(lastComment.content).toBe(COMMENT_TEXT);
  });


  // test if can reply to comment
  test('reply correctly', async () =>  {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;
    
    // Get elements relevant to test
    const input = getByTestId('input');
    const commentsList = getByTestId('comments-list');
    const sendButton = getByTestId('submit-button');

    // access the reply button on the first comment
    const [ firstComment ] = commentsList.props.data;
    replyButton = getByTestId(`reply-button-${firstComment.id}`);

    // execute replying to 1st comment
    fireEvent.press(replyButton);

    const REPLY_TEXT = 'test comment';
    fireEvent.changeText(input, REPLY_TEXT);
    fireEvent.press(sendButton);

    // check reply added
    const [ firstCommentReply ] = commentsList.props.data[0].replies;
    expect(firstCommentReply.content).toBe(REPLY_TEXT);
  });


  // test if can reply to (another user's) reply
  test('reply to reply correctly', async () =>  {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;
    
    // Get elements relevant to test
    const input = getByTestId('input');
    const commentsList = getByTestId('comments-list');
    const sendButton = getByTestId('submit-button');

    // get the reply button for the first reply from a DIFFERENT user
    let replyableReply, parentCommentIdx;

    let commentsCopy = commentsList.props.data;
    for (let idx = 0; idx < commentsCopy.length; idx++) {
      replyableReply = commentsCopy[idx].replies?.find(
        reply => reply?.user?.username !== currentUser.username
      );
      if (replyableReply) {
        parentCommentIdx = idx;
        break;
      }
    }

    const replyButton = getByTestId(`reply-button-${replyableReply.id}`);

    // execute replying to target reply
    fireEvent.press(replyButton);

    const REPLY_TEXT = 'test comment';
    fireEvent.changeText(input, REPLY_TEXT);
    fireEvent.press(sendButton);

    // check reply added
    const [ replyToReply ] = commentsList.props.data[parentCommentIdx].replies.slice(-1);
    expect(replyToReply.content).toBe(REPLY_TEXT);
  });
  

  // test of cancel reply mode
  test('cancel reply mode correctly', async () => {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;
    
    // get elements relevant to test
    const input = getByTestId('input');
    const commentsList = getByTestId('comments-list');
    
    // access the reply button on the first comment
    const [ firstComment ] = commentsList.props.data;
    replyButton = getByTestId(`reply-button-${firstComment.id}`);
    
    // execute replying to 1st comment
    fireEvent.press(replyButton);
  
    // get cancel reply button and execute it
    const cancelReplyButton = getByTestId(`cancel-reply-button-${firstComment.id}`);
    fireEvent.press(cancelReplyButton);
  
    // check that reply mode has been exited
    expect(input.props.value).toBe('');
    expect(input.props.placeholder).toBe('Type a comment...');
  });


  // test to edit the user's own comment
  test('edit comment correctly', async () => {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;

    // get elements relevant to test
    const input = getByTestId('input');
    const commentsList = getByTestId('comments-list');
    const sendButton = getByTestId('submit-button');

    // create two test users
    const TEST_USER_1 = { id: 1, username: 'test_user_1' };
    const TEST_USER_2 = { id: 2, username: 'test_user_2' };

    // add a comment from TEST_USER_1
    const COMMENT_TEXT = 'test comment from test_user_1';
    fireEvent.changeText(input, COMMENT_TEXT);
    fireEvent.press(sendButton);

    // add a comment from TEST_USER_2
    const COMMENT_TEXT_2 = 'test comment from test_user_2';
    fireEvent.changeText(input, COMMENT_TEXT_2);
    fireEvent.press(sendButton);

    // access the edit button on the first comment
    const [ firstComment ] = commentsList.props.data.filter(comment => comment.user.id === TEST_USER_1.id);
    const editButton = firstComment ? getByTestId('edit-button-${firstComment.id}') : undefined;

    // execute editing 1st comment
    if (editButton) {
      fireEvent.press(editButton);
      const EDITED_COMMENT_TEXT = 'edited comment';
      fireEvent.changeText(input, EDITED_COMMENT_TEXT);
      fireEvent.press(sendButton);

      // checks the comment was edited
      const [ editedComment ] = commentsList.props.data.filter(comment => comment.id === firstComment.id);
      expect(editedComment.content).toBe(EDITED_COMMENT_TEXT);
    }

    // user 1 should not be able to edit user 2's comment
    const [ secondComment ] = commentsList.props.data.filter(comment => comment.user.id === TEST_USER_2.id);
    const editButton2 = secondComment ? getByTestId('edit-button-${secondComment.id}') : undefined;
    expect(editButton2).toBe(undefined);
  });


  // test to edit the user's own comment but delete's input text and tries to save changes
  test('edit comment correctly without deleting input text', async () => {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;
  
    // get elements relevant to test
    const input = getByTestId('input');
    const commentsList = getByTestId('comments-list');
    const sendButton = getByTestId('submit-button');
  
    // create a test user
    const TEST_USER_1 = { id: 1, username: 'test_user_1' };
  
    // add a comment from TEST_USER_1
    const COMMENT_TEXT = 'test comment from test_user_1';
    fireEvent.changeText(input, COMMENT_TEXT);
    fireEvent.press(sendButton);
  
    // access the edit button on the comment
    const [ comment ] = commentsList.props.data.filter(comment => comment.user.id === TEST_USER_1.id);
    const editButton = comment ? getByTestId('edit-button-${comment.id}') : undefined;
  
    // execute editing comment
    if (editButton) {
      // test editing with empty input
      fireEvent.press(editButton);
      fireEvent.changeText(input, '');
      fireEvent.press(sendButton);
  
      // check that the alert was displayed and the comment was not deleted
      const [ updatedComment ] = commentsList.props.data.filter(comment => comment.id === comment.id);
      expect(updatedComment.content).toBe(EDITED_COMMENT_TEXT);
      expect(alert).toHaveBeenCalledWith("You can't leave an empty comment -- maybe delete your comment instead");
    }
  });


  // test to delete the user's own comment
  test('delete comment correctly', async () => {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum currentUser={{ id: 4 }} />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;

    // get elements relevant to test
    const commentsList = getByTestId('comments-list');

    // access the delete button on the first comment (from the current user)
    const [ firstComment ] = commentsList.props.data;
    const deleteButton = firstComment.userId === 1 ? getByTestId('delete-button-${firstComment.id}') : undefined;
    
    // execute deleting 1st comment
    if (deleteButton) {
      fireEvent.press(deleteButton);
      // check that the comment was deleted
      const [ deletedComment ] = commentsList.props.data.filter(comment => comment.id === firstComment.id);
      expect(deletedComment).toBe(undefined);
    }
    // check comment deleted if it belonged to the current user
    const updatedCommentsList = getByTestId('comments-list');
    expect(updatedCommentsList.props.data.length).toBe(deleteButton ? commentsList.props.data.length - 1 : commentsList.props.data.length);
  });


  // test to cancel deleting comment (from the current user)
  test('cancel deleting comment', async () => {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum currentUser={{ id: 4 }} />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;
  
    // get elements relevant to test
    const commentsList = getByTestId('comments-list');
    const [ firstComment ] = commentsList.props.data;
    const deleteButton = firstComment.userId === 1 ? getByTestId('delete-button-${firstComment.id}') : undefined;
  
    // execute deleting 1st comment
    if (deleteButton) {
      fireEvent.press(deleteButton);
      
      // find cancel button in modal and press it
      const cancelButton = getByTestId('cancel-delete-button');
      fireEvent.press(cancelButton);
  
      // check that the comments list is the same length as before
      const updatedCommentsList = getByTestId('comments-list');
      expect(updatedCommentsList.props.data.length).toBe(commentsList.props.data.length);
     
      // check that the comment still exists in the list of comments
      const [ comment ] = updatedCommentsList.props.data.filter(comment => comment.id === firstComment.id);
      expect(comment).toBeTruthy(); // comment still exists and is not undefined/null/empty
    }
  });

  
  // test to up vote a comment and check that the score increases by 1
  test('upvoting a comment increases its score', async () => {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;
  
    // get up vote button and score element
    const upVoteButton = getByTestId(`upvote-button-1`);
    const scoreElement = getByTestId(`votes-1`);
    const originalScore = Number(scoreElement.props.children);
  
    // simulate button press on upvote button
    fireEvent.press(upVoteButton);
  
    // check that the score has increased by 1
    const updatedScore = Number(scoreElement.props.children);
    expect(updatedScore).toBe(originalScore + 1);
  });


  // test to down vote a comment and check that the score decreases by 1
  test('down-voting a comment decreases its score', async () => {
    // render screen
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;
  
    // get down vote button and score element
    const downVoteButton = getByTestId(`downvote-button-1`);
    const scoreElement = getByTestId(`votes-1`);
    const originalScore = Number(scoreElement.props.children);
  
    // simulate button press on down vote button
    fireEvent.press(downVoteButton);
  
    // check that the score has decreased by 1
    const updatedScore = Number(scoreElement.props.children);
    expect(updatedScore).toBe(originalScore - 1);
  });

});
