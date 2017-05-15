import React from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import Spinner from 'react-native-spinkit';

import { Colors } from '../../styles';


const Loading = (props) => (
  <Spinner
    style={styles.spinner}
    {...props}
  />
);

Loading.propTypes = Spinner.propTypes;
Loading.defaultProps = {
  type: 'ThreeBounce',
  size: 100,
  color: Colors.MAIN,
  isVisible: true,
};

export default Loading;

export const Refresh = (props) => (
  <RefreshControl
    tintColor={Colors.MAIN}
    colors={[Colors.MAIN]}
    progressBackgroundColor={Colors.WHITE}
    {...props}
  />
);

Refresh.propTypes = RefreshControl.propTypes;

const styles = StyleSheet.create({
  spinner: {

  },
});
