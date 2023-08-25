import React, {ReactNode} from 'react';
import {KeyboardAvoidingView, SafeAreaView, ScrollView} from 'react-native';
import globalStyles from 'styles/globalStyles';

interface IScrollableContainerProps {
  children: ReactNode;
  floatingComponent?: React.ReactNode;
  keyboardAvoidingViewBehaviour?: 'padding' | 'height' | 'position';
}

const ScrollableContainer: React.FC<IScrollableContainerProps> = ({
  children,
  ...props
}) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={props.keyboardAvoidingViewBehaviour}
        style={globalStyles.container}>
        <ScrollView
          {...props}
          contentContainerStyle={globalStyles.growContainer}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScrollableContainer;
