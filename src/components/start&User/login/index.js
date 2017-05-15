import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Alert } from 'react-native';
import renderIf from 'render-if';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

import Logo from '../../img/Logo.png';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import { Colors } from '../../styles';
import Loading from '../../utils/loading';

/*
  Component life-cycle:
  https://facebook.github.io/react/docs/component-specs.html
 */

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      connecting: false,
      modal: false,
      wrong: false,
      loading: false,
    };
    this.logIn = this.logIn.bind(this);
    this.recovery = this.recovery.bind(this);
  }

  logIn() {
    // this.setState({ loading: true });
    const { email, password } = this.state;
    Firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
      Firebase.database().ref(`users/${user.uid}`).on('value', userFirebase => {
        const dataUser = userFirebase.val();
        if (dataUser && dataUser.proyecto && dataUser.proyecto.length >= 0) {
          Actions.linkProject({ user, dataUser });
        } else {
          Alert.alert(
            `Lo lamentamos ${dataUser.nombre} pero actualmente no tienes proyectos`,
            'Habla con tu jefe de proyectos para que te vincule a uno.',
            [
              { text: 'Aceptar' },
            ]
          );
        }
      });
    }, error => {
      this.setState({ error, loading: false });
    });
  }
          //  else (dataUser.proyecto.length === 1) {
          //   Firebase.database().ref(`/projects/${dataUser.proyect}`).on('value', projectFirebase => {
          //     const dataProject = projectFirebase.val();
          //     Actions.main({ user, dataUser, dataProject });
          //   }, error => {
          //     this.setState({ error, loading: false });
          //   });
          // }
    //     } else {
    //       Actions.newUser({ user, dataUser });
    //     }
    //   }, error => {
    //     this.setState({ error, loading: false });
    //   });
    // }, error => {
    //   this.setState({ error, loading: false });

  recovery() {
    const { email } = this.state;
    Firebase.auth().sendPasswordResetEmail(email).then(() => {
      Alert.alert(
        'Mail Enviado',
        `Se ha enviado un mail a ${email}`,
        [
          { text: 'Aceptar' },
        ]);
    }, error => {
      this.setState({ error });
      Alert.alert(
        'Agrega tu mail en MAIL DE USUARIO',
        `${error}`,
        [
          { text: 'Aceptar' },
        ]);
    });
  }

  render() {
    const { error, loading } = this.state;
    return (
      <View style={styles.container}>
        <Image
          source={Logo}
          style={styles.logoApp}
        />
        <FormLabel labelStyle={{ fontSize: 16 }}>Mail de Usuario</FormLabel>
        <FormInput
          ref={'mailInput'}
          textInputRef={'mailInput'}
          onChangeText={text => this.setState({ email: text })}
          selectionColor={Colors.MAIN}
          underlineColorAndroid={Colors.MAIN}
          onSubmitEditing={() => this.refs.passwordInput.focus()}
        />
        <FormLabel labelStyle={{ fontSize: 16 }}>Contraseña</FormLabel>
        <FormInput
          ref={'passwordInput'}
          textInputRef={'passwordInput'}
          secureTextEntry
          selectionColor={Colors.MAIN}
          underlineColorAndroid={Colors.MAIN}
          onChangeText={text => this.setState({ password: text })}
          onSubmitEditing={() => this.setState({ loading: true }, this.logIn())}
        />
        {renderIf(loading)(() =>
          <View style={{ alignItems: 'center' }} >
            <Loading />
          </View>
        )}
        {renderIf(error)(() =>
          <Text style={styles.error}>{error.message}</Text>
        )}
        <Button
          raised
          iconRight
          icon={{ name: 'input' }}
          onPress={() => this.setState({ loading: true }, this.logIn())}
          title="Ingresar"
          backgroundColor={Colors.MAIN}
          buttonStyle={{ marginBottom: 20, marginTop: 20 }}
        />
        <Button
          raised
          small
          iconRight
          icon={{ name: 'key', type: 'font-awesome' }}
          onPress={() => this.recovery()}
          title="Recuperar contraseña"
          backgroundColor={Colors.MAIN}
          buttonStyle={{ marginBottom: 20 }}
        />
        <Button
          raised
          small
          iconRight
          icon={{ name: 'supervisor-account' }}
          onPress={() =>
            Alert.alert(
              'Esta es una aplicación interna de Intexa',
              'Si eres un/a profesional Intexa, solicita tu ingreso enviando un mail a intexa@grupointexa.com',
              [
                { text: 'Aceptar' },
              ]
            )
          }
          title="Solicitar acceso"
          backgroundColor={Colors.MAIN}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  logoApp: {
    alignSelf: 'center', // auto, flex-start, flex-end, center, stretch
    width: Dimensions.get('window').width * 0.8,
    // height: Dimensions.get('window').width * 0.8,
    resizeMode: 'contain',
  },
  link: {
    textAlign: 'center',
    marginVertical: 10,
  },
  modalButton: {
    marginTop: 10,
    color: Colors.MAIN,
  },
  error: {
    textAlign: 'center',
  },
});
