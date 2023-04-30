import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';

import MyText from '../../components/MyText';
import MyButton from '../../components/MyButton';
import MyCard from '../../components/MyCard';

import colors from '../../assets/colors';

const deletionModal = ({
  isModalVisible, cancelDeletePost, confirmDeletePost
}) => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={isModalVisible}
    >
      <View style={styles.modal}>
        <MyCard style={styles.modalContent}>
          
          <MyText style={styles.modalTitle}>Delete comment</MyText>
          
          <MyText style={styles.modalText}> 
            Are you sure you want to delete this comment?
            This will remove the comment and can't be undone.
          </MyText>
          
          <View style={styles.modalButtonContainer}>
          
            {/* marginRight & marginLeft is used to help with button spacing */}
            <MyButton
                onPress={cancelDeletePost} 
                style={[styles.modalButton, {backgroundColor: colors.neutral.grayishBlue}, {marginLeft: 15}]}>
                <MyText style={styles.modalButtonText}>NO, CANCEL</MyText>
            </MyButton>
            
            <MyButton
              onPress={confirmDeletePost} 
              style={[styles.modalButton, {backgroundColor: colors.primary.softRed, marginRight: 15}]}>  
              <MyText style={styles.modalButtonText}>YES, DELETE</MyText>
            </MyButton>
            
          </View>
        </MyCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal styles 
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 50% opacity black background   
  },
  // Pop-up modal container
  modalContent: {
    height: 227,
    width: 380,
    //padding: 20,
    backgroundColor:'hsl(0, 0%, 100%)',
    borderRadius: 6,
  },
  // Modal header
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Rubik_500Medium',
    marginRight: 164,
    marginBottom: 20,
    color: colors.red,
  },
  // Modal text (body)
  modalText: {
    fontSize: 17,
    fontFamily: 'Rubik_400Regular',
    textAlign: 'left',
    marginRight: 10,
    marginBottom: 20,
    letterSpacing: 0.8,
    color: ' hsl(211, 10%, 45%)' // Grayish blue text
  },
  // Modal buttons container
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  // Modal buttons (Cancel and Delete)
  modalButton: {
    width: 150,
    height: 50,
    marginHorizontal: 8, //margin between buttons
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  // Modal button text
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Rubik_500Medium',
    color: "hsl(0, 0%, 100%)"
  },
});

export default deletionModal;
