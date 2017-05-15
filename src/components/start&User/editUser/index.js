import React, { PropTypes, Component } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import Firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import Hr from 'react-native-hr';

import { Button, FormLabel, FormInput } from 'react-native-elements';
import { Colors } from '../../styles';

/*
  Component life-cycle:
  https://facebook.github.io/react/docs/component-specs.html
 */

 // TODO: arreglar vista a solo cambiar clave #editUser

export default class EditUser extends Component {

  static propTypes = {
    user: PropTypes.object,
    dataProject: PropTypes.object,
    dataUser: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.displayName,
      modalName: false,
      modalPassword: false,
      userChange: false,
      password: '',
      confirmPassword: '',
      actualPassword: '',
    };
  }

  changePassword() {
    const { password, confirmPassword, actualPassword } = this.state;
    const { user } = this.props;
    const credential = Firebase.auth.EmailAuthProvider.credential(user.email, actualPassword);
    // console.log(credential);
    if (password === confirmPassword && password.length > 6) {
      user.reauthenticate(credential).then(() => {
        Firebase.auth().currentUser.updatePassword(password).then(() => (
          Alert.alert(
            'Contraseña reestablecida correctamente',
            'Recuerde iniciar sesion con su nueva conraseña',
            [
              { text: 'Aceptar', onPress: () => Actions.pop },
            ]
          )), error => {
          this.setState({ error });
        });
      }, error => {
        this.setState({ error });
      });
    } else if (password.length < 6) {
      this.setState({ error: 'Las contraseñas debe ser de mas de seis digitos' });
    } else {
      this.setState({ error: 'Las contraseñas ingresadas no son iguales' });
    }
  }

  render() {
    const { name, actualPassword, password, confirmPassword } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Edita tu perfil {name}</Text>
        <Hr lineColor="#b3b3b3" />
        <View style={styles.container}>
          <FormLabel labelStyle={{ fontSize: 16 }} >Ingrese su contraseña actual</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ actualPassword: text })}
            selectionColor={Colors.MAIN}
            underlineColorAndroid={Colors.MAIN}
            secureTextEntry
            value={actualPassword}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >Ingrese su nueva contraseña</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ password: text })}
            selectionColor={Colors.MAIN}
            underlineColorAndroid={Colors.MAIN}
            secureTextEntry
            value={password}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >Repita su contraseña</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ confirmPassword: text })}
            selectionColor={Colors.MAIN}
            underlineColorAndroid={Colors.MAIN}
            secureTextEntry
            value={confirmPassword}
          />
          <Button
            raised
            iconRight
            icon={{ name: 'key', type: 'font-awesome' }}
            onPress={() => this.changePassword()}
            title="Cambiar Contraseña"
            backgroundColor={Colors.MAIN}
            buttonStyle={{ marginBottom: 5 }}
          />
          <Button
            raised
            iconRight
            icon={{ name: 'reply', type: 'font-awesome' }}
            onPress={() => Actions.pop()}
            title="Volver"
            backgroundColor={Colors.MAIN}
          />
          <Text style={{ textAlign: 'center' }}>{this.state.error}</Text>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  buttonText: {
    fontSize: 20,
    color: 'gray',
    margin: 25,
    // color: Colors.GRIS,
  },
  header: {
    color: Colors.MAIN,
    alignItems: 'center',
    padding: 15,
    fontSize: 20,
    flexDirection: 'column',
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
  twoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
