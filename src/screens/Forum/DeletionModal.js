import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';

import MyText from 'components/MyText';
import MyButton from 'components/MyButton';
import MyCard from 'components/MyCard';

import colors from '../../../assets/colors';

const deletionModal = ({
  isModalVisible, cancelDeletePost, confirmDeletePost
}) => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={isModalVisible}
    >
      <View style={styles.modalOverlay}>
        <MyCard>
          <View style={styles.modalContent}>
            <View>
              <MyText style={styles.modalTitleText}>Delete comment</MyText>
            </View>
            <View>
              <MyText style={styles.modalBodyText}> 
                Are you sure you want to delete this comment?
                This will remove the comment and can't be undone.
              </MyText>
            </View>
            
            <View style={styles.modalButtonContainer}>
              {/* marginRight & marginLeft is used to help with button spacing */}
              <MyButton
                  onPress={cancelDeletePost} 
                  style={[styles.modalButton, {backgroundColor: colors.neutral.grayishBlue}]}>
                  <MyText style={styles.modalButtonText}>NO, CANCEL</MyText>
              </MyButton>
              
              <MyButton
                onPress={confirmDeletePost} 
                style={[styles.modalButton, {backgroundColor: colors.primary.softRed}]}>  
                <MyText style={styles.modalButtonText}>YES, DELETE</MyText>
              </MyButton>
            </View>
          </View>
        </MyCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal styles 
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 50% opacity black background
    padding: 15,
  },
  // Pop-up modal container
  modalContent: {
    width: '100%',
    // padding: 15,
    padding: 10,
    // padding: 5,
    rowGap: 15,
  },
  // Modal header
  modalTitleText: {
    fontSize: 20,
    fontWeight: 500,
    // marginBottom: 20,
    textAlign: 'left',
  },
  // Modal text (body)
  modalBodyText: {
    fontSize: 16, // style guide says 16px for body/paragraph
    fontWeight: 400,
    // letterSpacing: 0.5,
    lineHeight: 24,
    textAlign: 'left',
    color: colors.neutral.grayishBlue,
    // marginBottom: 15,
  },
  // Modal buttons container
  modalButtonContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  // Modal buttons (Cancel and Delete)
  modalButton: {
    // width: 133,
    width: '48%',
    height: 45,
    borderRadius: 8,
    // marginHorizontal: 6,
  },
  // Modal button text
  modalButtonText: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.neutral.white,
  },
});

export default deletionModal;
