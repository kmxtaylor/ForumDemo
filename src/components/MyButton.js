import { Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

/**
 * Custom button
 */
const MyButton = ({ style, onPress, children, ...rest }) => {

  return (
    <Pressable
      style={[
        styles.btn,
        style,
      ]}
      onPress={onPress}
      {...rest}
    >
      {children}
    </Pressable>
  );
};

MyButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
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