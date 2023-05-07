
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';

const TIMEOUT = { timeout: 20000 };

describe('Overall app', () => {
  // test if the app renders correctly without crashing: jest-expo is required
  test('should render the app screen', async () => {
    let renderedApp;
    await waitFor(() => {
        renderedApp = render(<App />);
      });
    const { getByTestId } = renderedApp;
    const appScreen = getByTestId('app-screen');
  
    expect(appScreen).toBeDefined();
  });
  // test('renders correctly', async () =>  {
  //   const { getByTestId } = render(<App />);
  //   let asyncContent;

  //   await waitFor(() => {
  //     asyncContent = getByTestId('app-screen');
  //   }, TIMEOUT);

  //   expect(asyncContent).toBeDefined();
  // });
});