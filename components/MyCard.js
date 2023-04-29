import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import colors from '../assets/colors';

/**
 * Custom card container
 */
const MyCard = ({ style, children, ...rest }) => {
  return (
    <View
      style={[styles.myCard, style]}
      {...rest}
    >
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
    marginTop: 15,
    backgroundColor: colors.neutral.white,
    borderRadius: 10,
    
    borderWidth: 1,
    borderColor: colors.neutral.lightGray
  },
  // cardActionsRow: {
  //   height: 50,
  //   width: '100%',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginTop: 20,
  // },
});

export default MyCard;