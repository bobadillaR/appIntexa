import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';

import Firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';

import Loading from '../../utils/loading';

import Logo from '../../img/Logo.png';

export default class Intro extends Component {

  static get PropTypes() {
    return {
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      timer: false,
      error: '',
      animation: true,
    };
    this.checkUser = this.checkUser.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.setState({ timer: true }, this.checkUser()), 1500);
  }

  checkUser() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Firebase.database().ref(`users/${user.uid}`).on('value', userFirebase => {
          const dataUser = userFirebase.val();
          Actions.linkProject({ user, dataUser });
        }, error => {
          this.setState({ error });
        });
      } else {
        this.setState({ animation: false, timer: false });
        setTimeout(() => Actions.login(), 1000);
      }
    });
  }

  render() {
    const { timer, error, animation } = this.state;
    return (
      <View style={styles.container}>
        <Animatable.Image
          source={Logo}
          animation={animation ? 'fadeInUp' : 'zoomOut'}
          style={styles.image}
        />
        {timer ? <Loading /> : null}
        {error ? <Text>{error}</Text> : null}
      </View>
    );
  }
}

/*
  See: https://facebook.github.io/react/docs/reusable-components.html#prop-validation
 */
// TemplateComponent.propTypes = {
//   message: React.PropTypes.string,
// };

/*
  See: https://facebook.github.io/react-native/docs/flexbox.html
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // row, column
    // flexWrap: 'nowrap' // wrap, nowrap
    alignItems: 'center', // flex-start, flex-end, center, stretch
    // alignSelf: 'auto', // auto, flex-start, flex-end, center, stretch
    justifyContent: 'space-around', // flex-start, flex-end, center, space-between, space-around
    // position: 'relative', // absolute, relative
    // backgroundColor: 'white',
    // padding: 120,
    // padding: 0,
    // right: 0,
    // top: 0,
    // left: 0,
    // bottom: 0,
    // paddingLeft: 20,
  },
  image: {
    // flex: 1,
    width: Dimensions.get('window').width * 0.8,
    // height: Dimensions.get('window').width * 0.8,
    resizeMode: 'contain',
  },
  loading: {

  },
});
