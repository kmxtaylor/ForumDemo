import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Forum from 'screens/Forum';
import App from '/';

const TIMEOUT = { timeout: 20000 };

describe('Forum functionality', () => {
  // test if reply functionality works correctly
  test('renders correctly', async () =>  {
    const { getByTestId } = render(<Forum />);
    let input, commentsList;

    await waitFor(() => {
      input = getByTestId('input');
      commentsList = getByTestId('comments-list');
    }, TIMEOUT);

    expect(input).toBeDefined();
    expect(commentsList).toBeDefined();
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
