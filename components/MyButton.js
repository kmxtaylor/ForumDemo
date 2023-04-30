import { Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

/**
 * Custom button
 */
const MyButton = ({ style, onPress, children, ...rest }) => {

  // const [bgColor, setBgColor] = useState(colorGroups[btnColor].main);

  return (
    <Pressable
      style={[
        styles.btn,
        // {
        //   backgroundColor: bgColor,
        //   borderBottomColor: colorGroups[btnColor]?.shadow ?? colorGroups.tan.shadow,
        // },
        style,
      ]}
      onPress={onPress}
      // onPressIn={() => setBgColor(colorGroups[btnColor].shadow)}
      // onPressOut={() => setBgColor(colorGroups[btnColor].main)}
      {...rest}
    >
      {children}
    </Pressable>
  );
};

MyButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  // onPress: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

/* Static styles */
const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyButton;