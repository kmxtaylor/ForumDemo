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

    // expect(input).toBeDefined();
    // expect(commentsList).toBeDefined();

    // execute adding comment
    const COMMENT_TEXT = 'test comment';
    fireEvent.changeText(input, COMMENT_TEXT);
    fireEvent.press(sendButton);

    // check comment added
    // console.log(commentsList.props);
    const [ lastComment ] = commentsList.props.data.slice(-1);
    // const [ lastComment ] = commentsList.props.data.reverse();

    expect(lastComment.content).toBe(COMMENT_TEXT);
  });

  /* test if can reply to comment */
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
    // console.log(replyButton);

    // execute replying to 1st comment
    fireEvent.press(replyButton);

    const REPLY_TEXT = 'test comment';
    fireEvent.changeText(input, REPLY_TEXT);
    fireEvent.press(sendButton);

    // check reply added
    // console.log(commentsList.props.data);
    const [ firstCommentReply ] = commentsList.props.data[0].replies;

    expect(firstCommentReply.content).toBe(REPLY_TEXT);
  });

  /* test if can reply to (another user's) reply */
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
    // console.log(JSON.stringify(commentsList.props.data.entries(), null, 2));
    // console.log(commentsList.props.data);
    // for (const [comment, idx] of commentsList.props.data.entries()) {
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
    // console.log(replyableReply);
    const replyButton = getByTestId(`reply-button-${replyableReply.id}`);

    // execute replying to target reply
    fireEvent.press(replyButton);

    const REPLY_TEXT = 'test comment';
    fireEvent.changeText(input, REPLY_TEXT);
    fireEvent.press(sendButton);

    // check reply added
    // console.log(commentsList.props.data[parentCommentIdx]);
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
    
    // Get elements relevant to test
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

  // edit comment
  test('edit comment correctly', async () => {
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
    
    // access the edit button on the first comment
    const [ firstComment ] = commentsList.props.data;
    const editButton = getByTestId(`edit-button-${firstComment.id}`);
    
    // execute editing 1st comment
    fireEvent.press(editButton);
    const EDIT_TEXT = 'edited comment';
    fireEvent.changeText(input, EDIT_TEXT);
    fireEvent.press(sendButton);
    
    // check comment edited
    const [ editedComment ] = commentsList.props.data;
    expect(editedComment.content).toBe(EDIT_TEXT);
  
  });

  // delete comment
  test('delete comment correctly', async () => {
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
    
    // access the delete button on the first comment
    const [ firstComment ] = commentsList.props.data;
    const deleteButton = getByTestId(`delete-button-${firstComment.id}`);
    
    // execute deleting 1st comment
    fireEvent.press(deleteButton);
    
    // check comment deleted
    expect(commentsList.props.data.length).toBe(0);
  
  });
  

});
