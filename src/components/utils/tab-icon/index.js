import React, { PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import StyleSheet from 'react-native-debug-stylesheet';

import { Colors } from '../../styles';


const TabIcon = (props) => {
  const color = props.selected ? Colors.MAIN : Colors.DISABLED;
  return (
    <View style={styles.container}>
      <Icon style={styles.icons} name={props.image} size={22} color={color} />
      <Text style={[styles.text, { color }]}>{props.title}</Text>
    </View>
  );
};

TabIcon.defaultProps = {
  title: 'Tab',
  image: 'rocket',
  selected: false,
};

TabIcon.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  selected: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 1,
    paddingBottom: 0,
  },
  icons: {
    margin: 1,
  },
  text: {
    fontSize: 12,
  },
});

export default TabIcon;
