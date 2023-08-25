import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollViewProps,
  SafeAreaView,
  ViewProps,
} from 'react-native';
import globalStyles from 'styles/globalStyles';
import ScrollableContainer from './ScrollableContainer';

type IBaseContainerProps = {
  scrollable?: boolean;
  scrollProps?: ScrollViewProps;
  keyboardAvoidingViewBehaviour?: 'padding' | 'height' | 'position';
} & ViewProps;

const BaseContainer = (props: IBaseContainerProps) => {
  const {scrollable, scrollProps, children, keyboardAvoidingViewBehaviour} =
    props;
  if (scrollable) {
    return (
      <ScrollableContainer
        {...scrollProps}
        keyboardAvoidingViewBehaviour={
          keyboardAvoidingViewBehaviour ?? Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
        {children}
      </ScrollableContainer>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={[globalStyles.container]}
        behavior={
          keyboardAvoidingViewBehaviour ?? Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

BaseContainer.defaultProps = {
  scrollable: false,
};

export default BaseContainer;
