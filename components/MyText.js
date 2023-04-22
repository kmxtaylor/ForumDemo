import { Text } from 'react-native';
import PropTypes from 'prop-types';

/**
 * Custom stylized Text
 */
const MyText = ({ weight, style, children, ...rest }) => {
  let font;
  switch (weight) {
    case 400:
      font = 'Rubik_400Regular';
      break;
    case 500:
      font = 'Rubik_500Medium';
      break;
    case 700:
      font = 'Rubik_700Bold';
      break;
  }

  return (
    <Text
      style={[
        {
          fontFamily: font || 'Rubik_400Regular',
          fontSize: style?.fontSize || 16, // requested default: 16
        },
        style
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

MyText.propTypes = {
  weight: PropTypes.oneOf([400, 500, 700]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
};

export default MyText;