import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import MainScreen from '../screens/MainScreen';

describe('Whole app', () => {
  // test if the app renders correctly
  test('should render the app screen', async () => {
    let renderedComponent;
    await waitFor(() => {
      renderedComponent = render(<App />);
    });
    const { getByTestId } = renderedComponent;
    const appScreen = getByTestId('app-screen');

    expect(appScreen).toBeDefined();
  });
});

describe('MainScreen', () => {

  test('should ...', async () => {
    let renderedComponent;
    await waitFor(() => {
      renderedComponent = render(<MainScreen />);
    });
    const { getByTestId } = renderedComponent;
    const input = getByTestId('input');
    const commentsList = getByTestId('commentsList');

    // ... do stuff
  });

  // ... other tests

});