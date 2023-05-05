import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Forum from 'screens/Forum';
import App from '/';

const TIMEOUT = { timeout: 20000 };

describe('Forum functionality', () => {
  // test('renders correctly - from app', async () =>  {
  //   const { getByTestId } = render(<App />);
  //   let input, commentsList;

  //   await waitFor(() => {
  //     input = getByTestId('input');
  //     commentsList = getByTestId('comments-list');
  //   }, TIMEOUT);

  //   expect(input).toBeDefined();
  //   expect(commentsList).toBeDefined();
  // });

  // test if can add comment
  test('comment adding correctly', async () =>  {
    let renderedScreen;
    await waitFor(() => {
      renderedScreen = render(<Forum />);
    }, TIMEOUT);
    const { getByTestId } = renderedScreen;

    const input = getByTestId('input');
    const commentsList = getByTestId('comments-list');
    const sendButton = getByTestId('submit-button');

    // expect(input).toBeDefined();
    // expect(commentsList).toBeDefined();

    const COMMENT_TEXT = 'test comment';
    fireEvent.changeText(input, COMMENT_TEXT);
    fireEvent.press(sendButton);

    console.log(commentsList.props);
    const [ lastComment ] = commentsList.props.data.slice(-1);
    // const [ lastComment ] = commentsList.props.data.reverse();

    expect(lastComment.content).toBe(COMMENT_TEXT);
  });
  // test('comment adding correctly', async () =>  {
  //   const { getByTestId } = render(<Forum />);
  //   let input, commentsList, sendButton;

  //   await waitFor(() => {
  //     // access all testIDs here
  //     input = getByTestId('input');
  //     commentsList = getByTestId('comments-list');
  //     sendButton = getByTestId('submit-button');
  //   }, TIMEOUT);

  //   // expect(input).toBeDefined();
  //   // expect(commentsList).toBeDefined();

  //   const COMMENT_TEXT = 'test comment';
  //   fireEvent.changeText(input, COMMENT_TEXT);
  //   fireEvent.press(sendButton);

  //   console.log(commentsList.props);
  //   const [ lastComment ] = commentsList.props.data.slice(-1);
  //   // const [ lastComment ] = commentsList.props.data.reverse();

  //   expect(lastComment.content).toBe(COMMENT_TEXT);
  // });

  /* test if can reply to comment */
  // test('reply correctly', async () =>  {
  //   let renderedScreen;
  //   await waitFor(() => {
  //     renderedScreen = render(<Forum />);
  //   }, TIMEOUT);
  //   const { getByTestId, getByType } = renderedScreen;
    
  //   const input = getByTestId('input');
  //   const commentsList = getByTestId('comments-list');
  //   // const [ firstComment ] = commentsList.props.data;
  //   // replyButton = getByTestId(`reply-button-${firstComment.id}`);
  //   const replyButton = getByType(commentsList[0], 'Button');
  //   console.log(replyButton);
  //   const sendButton = getByTestId('submit-button');

  //   // expect(input).toBeDefined();
  //   // expect(commentsList).toBeDefined();

  //   // access the reply button on the first comment
  //   fireEvent.press(replyButton);

  //   const REPLY_TEXT = 'test comment';
  //   fireEvent.changeText(input, REPLY_TEXT);
  //   fireEvent.press(sendButton);

  //   // console.log(commentsList.props);
  //   const [ firstComment ] = commentsList.props.data;

  //   expect(firstComment.content).toBe(REPLY_TEXT);
  // });

  // test if can reply to reply 


});
