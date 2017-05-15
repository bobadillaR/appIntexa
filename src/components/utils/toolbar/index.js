/* eslint arrow-body-style:0 new-cap:0 */

import React, { PropTypes } from 'react';

import { StyleSheet, ToolbarAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, NavBar } from 'react-native-router-flux';

import { Colors } from '../../styles';
import Metrics from '../../metrics';
import Platform from '../../../utils/platform';

const TITLE_COLOR = 'white';

export const Android = ({
    title,
    subtitle,
    backButtonImage,
    noElevation,
    onRight,
    rightTitle,
    onLeft,
    leftTitle,
    ...props,
  }) => {
  const actions = [];
  const left = leftTitle && onLeft;
  const right = rightTitle && onRight;
  if (left) actions.push({ title: leftTitle, show: 'always' });
  if (right) actions.push({ title: rightTitle, show: 'always' });

  const elevation = { elevation: noElevation ? 0 : 4 };
  const back = {
    navIconName: backButtonImage ? 'chevron-left' : undefined,
    onIconClicked: backButtonImage ? Actions.pop : undefined,
  };

  return (
    <Icon.ToolbarAndroid
      style={[styles.toolbar, elevation]}
      iconColor="white"
      actions={actions}
      title={title}
      subtitle={subtitle}
      titleColor={TITLE_COLOR}
      onActionSelected={position => {
        if (position === 0 && left) onLeft();
        else if (right) onRight();
      }}
      {...back}
    />
  );
};

export const iOS = ({ noElevation, navigationBarStyle, ...props }) => {
  const custom = {
    borderBottomWidth: noElevation ? 0 : 0.5,
  };
  return <NavBar navigationBarStyle={{ ...navigationBarStyle, ...custom }} {...props} />;
};

const Toolbar = (props) => (Platform.Android ? Android(props) : iOS(props));

Android.propTypes = {
  ...NavBar.propTypes,
  noElevation: PropTypes.bool,
  subtitle: PropTypes.string,
};
iOS.propTypes = NavBar.propTypes;
Toolbar.propTypes = { ...iOS.propTypes, ...Android.propTypes };

export default Toolbar;

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    top: 0,
    height: Metrics.NAVBAR_HEIGHT,
    right: 0,
    left: 0,
    backgroundColor: Colors.MAIN,
    // width: Metrics.DEVICE_WIDTH,
  },
});
