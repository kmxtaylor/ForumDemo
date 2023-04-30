import {
  View,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import MyText from '../../components/MyText';
import MyButton from '../../components/MyButton';
import MyCard from '../../components/MyCard';

import colors from '../../assets/colors';
import data from '../../assets/data/data.json';
import { avatars, avatarStyles } from '../../assets/images/avatars';

const InputContainer = ({
  displayedVal, handleKeyPress, handleSendPost, handleSaveEdits, placeholder, editingMode, style, ...rest 
}) => {
  return (
    <MyCard
      style={style}
      {...rest}
    >
      <TextInput
        style={styles.input}
        value={displayedVal}
        onChangeText={handleKeyPress}
        placeholder={placeholder}
        multiline={true}
        // maxLength={}
        testID='input'
      />
      <View style={styles.cardActionsRow}>
        <Image
          style={styles.avatar}
          source={avatars[data.currentUser.username]}
        />
        <MyButton
          style={styles.sendButton}
          onPress={editingMode ? handleSaveEdits : handleSendPost}
        >
          <MyText style={styles.sendButtonText}>{editingMode ? 'SAVE' : 'SEND'}</MyText>
        </MyButton>
      </View>
    </MyCard>
  );
};

InputContainer.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  typedVal: PropTypes.string,
  handleTyping: PropTypes.func,
  handleSendPost: PropTypes.func,
};

const styles = StyleSheet.create({
  ...avatarStyles,
  input: {
    // flex: 1,
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // fontSize: 16,
    // marginRight: 10,
    textAlignVertical: 'top',
    // padding: 20,
  },
  cardActionsRow: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  sendButton: {
    height: 60,
    width: 120,
    backgroundColor: colors.primary.moderateBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: colors.neutral.white,
    fontSize: 20,
    fontWeight: '700',
  },
});

export default InputContainer;
