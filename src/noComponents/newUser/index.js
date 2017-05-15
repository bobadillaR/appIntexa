import React, { PropTypes, Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Alert } from 'react-native';
import Firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

import Logo from '../../img/Logo.png';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import { Colors } from '../../styles';

/*
  Component life-cycle:
  https://facebook.github.io/react/docs/component-specs.html
 */

  // TODO: carga muchas veces la vista #newUser

export default class NewUser extends Component {

  static propTypes = {
    user: PropTypes.object,
    dataUser: PropTypes.object,
  }


  constructor(props) {
    super(props);
    this.state = {
      name: '',
      error: '',
    };

    // ES6 bindings
    // See: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    // See: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md#es6-classes

    this.newProjectButton = this.newProjectButton.bind(this);
    this.linkButton = this.linkButton.bind(this);
  }

  logOut() {
    Firebase.auth().signOut().then(() => {
      Actions.login();
    }, error => {
      this.setState({ error });
    });
  }

  newProjectButton() {
    const { name } = this.state;
    const { user, dataUser } = this.props;
    if (!dataUser) {
      if (name) {
        user.updateProfile({
          displayName: name,
          // photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(() => {
          Firebase.database().ref(`/users/${user.uid}`).set({
            proyect: '',
          });
          Actions.newProject({ user, dataUser });
        }, (error) => {
          // An error happened.
          this.setState({ error });
        });
      } else {
        this.setState({ error: 'Add your name to continue' });
      }
    } else {
      Actions.newProject({ user, dataUser });
    }
  }

  linkButton() {
    const { user, dataUser } = this.props;
    Actions.linkProject({ user, dataUser });
  }

  render() {
    const { user } = this.props;
    return (
      <View style={styles.container}>
        {/* <Image
          source={Logo}
          style={styles.logoApp}
        />
        {user && user.displayName ?
          <Text style={styles.nombre}>Bienvenido {user.displayName}</Text>
          :
          <View>
            <FormLabel labelStyle={{ fontSize: 16 }} >Ingrese su nombre</FormLabel>
            <FormInput
              onChangeText={text => this.setState({ name: text })}
              selectionColor={Colors.MAIN}
              underlineColorAndroid={Colors.MAIN}
            />
          </View>
        }
        <Text style={{ textAlign: 'center' }}>Selecciona una opción para comenzar tu proyecto</Text>
        <Button
          raised
          onPress={() => this.newProjectButton()}
          title="Crear nuevo proyecto"
          backgroundColor={Colors.MAIN}
        />
        <Button
          raised
          onPress={() => this.linkButton()}
          title="Vincular a proyecto existente"
          backgroundColor={Colors.MAIN}
        />
        <Text style={{ textAlign: 'center' }}>{this.state.error}</Text>
        <Button
          backgroundColor={Colors.MAIN}
          small
          iconRight
          onPress={() =>
            Alert.alert(
              'Esta seguro que desea desconectarse de su usuario',
              `Su usuario actual es ${user.displayName}`,
              [
                { text: 'Aceptar', onPress: () => this.logOut() },
                { text: 'Cancelar', style: 'cancel' },
              ]
            )
          }
          icon={{ name: 'input' }}
          title="Cerrar sesión"
        /> */}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around', // flex-start, flex-end, center, space-between, space-around
    // flexDirection: 'row', // row, column
    // // flexWrap: 'nowrap' // wrap, nowrap
    // alignItems: 'center', // flex-start, flex-end, center, stretch
    // alignSelf: 'center', // auto, flex-start, flex-end, center, stretch
    // // position: 'relative', // absolute, relative
    // // backgroundImage: 'purple',
    // // margin: 0,
    // // padding: 0,
    // // right: 0,
    // // top: 0,
    // // left: 0,
    // // bottom: 0,
  },
  logoApp: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.2,
    resizeMode: 'contain',
    alignSelf: 'center', // auto, flex-start, flex-end, center, stretch
  },
  buttonText: {
    fontSize: 20,
    color: 'gray',
    margin: 25,
    // color: Colors.GRIS,
  },
  backgroundImage: {
    // flex: 1,
    paddingVertical: 30,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
  volver: {
    alignSelf: 'center',
    margin: 10,
    color: Colors.MAIN,
    fontSize: 15,
  },
  nombre: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 15,
  },
});
