import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import colors from '/../assets/colors';

/**
 * Custom card container
 */
const MyCard = ({ style, children, ...rest }) => {
  return (
    <View style={[styles.myCard, style]} {...rest}>
      {children}
    </View>
  );
};

MyCard.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node.isRequired,
};

/* Static styles */
const styles = StyleSheet.create({
  myCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    // borderWidth: 0.5,
    borderColor: colors.neutral.lightGray
  },
});

export default MyCard;