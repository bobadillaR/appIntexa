import React, { PropTypes, Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Alert, ScrollView } from 'react-native';
import Firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { List, ListItem, Card, Button } from 'react-native-elements';
import Hr from 'react-native-hr';

import Loading from '../../utils/loading';

import Logo from '../../img/Logo.png';
import noProyectImg from '../../img/noProyect.jpg';
import { Colors } from '../../styles';

/*
  Component life-cycle:
  https://facebook.github.io/react/docs/component-specs.html
 */

export default class LinkProject extends Component {

  static propTypes = {
    user: PropTypes.object,
    dataUser: PropTypes.object,
    protocolo: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      error: '',
      dataProyect: [],
      dataProyectKeys: [],
      selected: '',
      noProyect: true,
      loading: true,
    };

    // ES6 bindings
    // See: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    // See: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md#es6-classes
  }

  componentWillMount() {
    const { dataUser } = this.props;
    if (dataUser.tipo === 'Administrador') {
      this.loadAdmin();
    } else {
      this.reload();
    }
  }

  componentWillReceiveProps() {
  }

  loadAdmin() {
    Firebase.database().ref('proyects/').on('value', snapshot => {
      const dataProyect = [];
      const dataProyectKeys = [];
      for (const [key, value] of Object.entries(snapshot.val())) {
        dataProyect.push(value);
        dataProyectKeys.push(key);
      }
      this.setState({ dataProyect, loading: false, haveProyect: true, dataProyectKeys });
    });
  }

  reload() {
    const { user } = this.props;
    this.setState({ loading: true });
    Firebase.database().ref(`users/${user.uid}`).on('value', userFirebase => {
      const dataUser = userFirebase.val();
      if (dataUser.proyecto && dataUser.proyecto.length > 0) {
        const dataProyect = [];
        const dataProyectKeys = [];
        dataUser.proyecto.forEach((element, key) => (
          Firebase.database().ref(`proyects/${element}`).on('value', snapshot => {
            dataProyect.push(snapshot.val());
            dataProyectKeys.push(dataUser.proyecto[key]);
            this.setState({ dataProyect, loading: false, haveProyect: true, dataProyectKeys });
          })
        ));
      } else {
        Alert.alert(
          `Lo lamentamos ${dataUser.nombre.split(' ')[0]} pero actualmente no tienes proyectos`,
          'Habla con tu jefe de proyectos para que te vincule a uno.',
          [
            { text: 'Aceptar' },
          ]

        );
      }
      this.setState({ loading: false });
    });
  }

  logOut() {
    Firebase.auth().signOut().then(() => {
      Actions.login();
    }
      , error => {
      this.setState({ error });
    });
  }

  clickProyect(proyecto, key) {
    const { dataUser, user } = this.props;
    const { dataProyectKeys } = this.state;
    Actions.main({ user, dataUser, proyectId: dataProyectKeys[key] });
  }

  render() {
    const { dataUser } = this.props;
    const { dataProyect, haveProyect, loading } = this.state;
    if (loading) {
      return (<Loading style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }} />);
    } else {
      return (
        haveProyect && dataProyect.length > 0 ?
          <View style={styles.container}>
            <Image
              source={Logo}
              style={styles.logoApp}
            />
            <Hr lineColor="#b3b3b3" />
            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 0, marginTop: 5, color: Colors.MAIN }}>Selecciona un proyecto</Text>
            <ScrollView>
              <List>
                {
                  dataProyect.map((item, i) => (
                    <ListItem
                      key={i}
                      style={{ paddingTop: 0 }}
                      title={item.nombre}
                      leftIcon={{ name: 'label-outline', color: Colors.MAIN }}
                      onPress={() => this.clickProyect(item, i)}
                    />
                  ))
                }
              </List>
            </ScrollView>
            <Button
              raised
              iconRight
              icon={{ name: 'input' }}
              backgroundColor={Colors.MAIN}
              fontFamily="Lato"
              buttonStyle={{ borderRadius: 0, marginLeft: 10, marginRight: 10, marginBottom: 10 }}
              title="Cerrar sesión"
              onPress={() => this.logOut()}
            />
          </View>
          :
          <View style={styles.container}>
            <Card
              title={`${dataUser.nombre} no tienes proyectos - ${dataUser.cargo}`}
              image={noProyectImg}
              // style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}
            >
              <Text style={{ marginBottom: 10 }}>
                {dataUser.tipo === 'ITO' ?
                  'Habla con tu Jefe de Proyectos para que te asigne uno en la aplicación WEB'
                  : dataUser.tipo === 'Jefe' ?
                    'Crea un proyecto o bien pidele a un Administrador que te vincule a uno'
                    :
                    'Crea proyectos en la aplicación WEB'
                }
              </Text>
              <Button
                icon={{ name: 'autorenew' }}
                small
                iconRight
                raised
                backgroundColor={Colors.MAIN}
                fontFamily="Lato"
                buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10 }}
                title="Recargar Proyectos"
                onPress={() => this.reload()}
              />
              <Button
                raised
                small
                iconRight
                icon={{ name: 'input' }}
                backgroundColor={Colors.MAIN}
                fontFamily="Lato"
                buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                title="Cerrar sesión"
                onPress={() => this.logOut()}
              />
            </Card>
          </View>
        );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // row, column
    // // flexWrap: 'nowrap' // wrap, nowrap
    // alignItems: 'center', // flex-start, flex-end, center, stretch
    // alignSelf: 'center', // auto, flex-start, flex-end, center, stretch
    justifyContent: 'space-between', // flex-start, flex-end, center, space-between, space-around
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
