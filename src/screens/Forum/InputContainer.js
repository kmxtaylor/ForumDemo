import {
  View,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import MyText from 'components/MyText';
import MyButton from 'components/MyButton';
import MyCard from 'components/MyCard';

import colors from '/../assets/colors';
import data from '/../assets/data/data.json';
import { avatars, avatarStyles } from '/../assets/images/avatars';

const InputContainer = ({
  displayedVal, 
  handleKeyPress, 
  handleSendPost, 
  handleSaveEdits, 
  placeholder, 
  editingMode, 
  textInputRef,
  ...rest 
}) => {

  return (
    <MyCard
      style={styles.inputContainer}
      {...rest}
    >
      <TextInput
        style={styles.input}
        value={displayedVal}
        onChangeText={handleKeyPress}
        placeholder={placeholder}
        multiline={true}
        testID='input'
        ref={textInputRef}
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
           <MyText
            style={styles.sendButtonText}
            testID='submit-button'
            >{editingMode ? 'SAVE' : 'SEND'}
          </MyText>
        </MyButton>
      </View>
    </MyCard>
  );
};

const styles = StyleSheet.create({
  ...avatarStyles,
  inputContainer: {
    marginBottom: 0,
  },
  input: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: 'top',
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
    height: 50,
    width: 110,
    backgroundColor: colors.primary.moderateBlue,
    textAlign: 'center',
    borderRadius: 10,
  },
  sendButtonText: {
    color: colors.neutral.white,
    fontSize: 20,
    fontWeight: '700',
  },
});

InputContainer.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  displayedVal: PropTypes.string,
  handleKeyPress: PropTypes.func,
  handleSendPost: PropTypes.func,
  handleSaveEdits: PropTypes.func, 
  placeholder: PropTypes.string,
  editingMode: PropTypes.bool,
  textInputRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

export default InputContainer;
