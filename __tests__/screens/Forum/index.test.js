import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Forum from 'screens/Forum';
import App from '/';

const TIMEOUT = { timeout: 20000 };

describe('Forum functionality', () => {
  // test if can add comment
  test('comment adding correctly', async () =>  {
    const { getByTestId } = render(<Forum />);
    let input, commentsList, sendButton;

    await waitFor(() => {
      // access all testIDs here
      input = getByTestId('input');
      commentsList = getByTestId('comments-list');
      sendButton = getByTestId('submit-button');
    }, TIMEOUT);

    expect(input).toBeDefined();
    expect(commentsList).toBeDefined();

    const TEST_COMMENT_TEXT = 'test comment';
    fireEvent.changeText(input, TEST_COMMENT_TEXT);
    fireEvent.press(sendButton);

    // console.log(commentsList.props);
    const [ lastComment ] = commentsList.props.data.slice(-1);
    // const [ lastComment ] = commentsList.props.data.reverse();

    expect(lastComment.content).toBe(TEST_COMMENT_TEXT);
  });

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

  
});
