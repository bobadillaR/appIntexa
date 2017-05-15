import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView } from 'react-native';
import { Colors } from '../../styles';
import Loading from '../../utils/loading';
import Firebase from 'firebase';
import { Button } from 'react-native-elements';
import Hr from 'react-native-hr';
import { Actions } from 'react-native-router-flux';

// TODO: agregar cantidad de protocolos #Config

export default class Config extends Component {

  static propTypes = {
    user: PropTypes.object,
    dataUser: PropTypes.object,
    dataProyect: PropTypes.object,
    jefeProyectoName: PropTypes.string,
    itosName: PropTypes.array,
    proyectId: PropTypes.integer,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    Firebase.auth().signOut().then(() => {
      Actions.login();
    }
      , error => {
      this.setState({ error });
    });
  }

  render() {
    const { loading } = this.state;
    const { user, dataUser, dataProyect, jefeProyectoName, itosName, proyectId } = this.props;
    if (loading) {
      return (<View style={styles.loading}><Loading /></View>);
    }
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Configuración</Text>
        <Hr lineColor="#b3b3b3" />
        <ScrollView style={styles.body}>
          <Hr lineColor="#b3b3b3" text="Información de Usuario" textColor={Colors.MAIN} />
          <View style={styles.row}>
            <Text>Nombre</Text>
            <Text>{dataUser.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text>Mail</Text>
            <Text>{dataUser.email}</Text>
          </View>
          <Button
            raised
            small
            iconRight
            icon={{ name: 'key', type: 'font-awesome' }}
            onPress={() => Actions.editUser({ user, dataUser, dataProyect })}
            title="Cambiar contraseña"
            // backgroundColor={Colors.MAIN}
            buttonStyle={{ paddingVertical: 5 }}
          />
          <Hr lineColor="#b3b3b3" text="Información Proyecto" textColor={Colors.MAIN} />
          <View style={styles.row}>
            <Text>Proyecto</Text>
            <Text>{dataProyect && dataProyect.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text>Mandante</Text>
            <Text>{dataProyect && dataProyect.mandante}</Text>
          </View>
          <View style={styles.row}>
            <Text>Jefe de Proyecto</Text>
            <Text>{jefeProyectoName && jefeProyectoName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ alignSelf: 'flex-start' }}>ITO(s)</Text>
            <View>
              {itosName && itosName.map(ito => <Text style={{ textAlign: 'right' }}>{ito}</Text>)}
            </View>
          </View>
          <Button
            raised
            small
            iconRight
            icon={{ name: 'edit', type: 'font-awesome' }}
            onPress={() => Actions.editProyect({ user, dataUser, dataProyect, proyectId })}
            title="Editar Proyecto"
            buttonStyle={{ paddingVertical: 5 }}
          />
          <Hr lineColor="#b3b3b3" text="Información Protocolos" textColor={Colors.MAIN} />
          <Text>Cantidad de Protocolos</Text>
          <Text>Protocolos Finalizados</Text>
          <Text>Protocolos Rechazados</Text>
          <Text>Protocolos en Curso</Text>
          <Hr lineColor="#b3b3b3" />
          {(dataUser.tipo === 'Administrador' || dataUser.proyecto.length > 1) &&
            <Button
              backgroundColor={Colors.MAIN}
              small
              iconRight
              onPress={() => Actions.linkProject({ user, dataUser })}
              icon={{ name: 'list' }}
              title="Ver mis otros Proyectos"
              buttonStyle={{ marginBottom: 5, marginTop: 5 }}
            />
          }
          <Button
            backgroundColor={Colors.MAIN}
            buttonStyle={{ marginBottom: 5, marginTop: 5 }}
            small
            iconRight
            onPress={() =>
              Alert.alert(
                '¿ Está seguro que desea desconectarse de su usuario ?',
                `Su usuario actual es ${dataUser.nombre}`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Aceptar', onPress: () => this.logOut() },
                ]
              )
            }
            icon={{ name: 'exit-to-app' }}
            title="Cerrar sesión"
          />
        </ScrollView>
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
const SIZE = 140;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  header: {
    color: Colors.MAIN,
    alignItems: 'center',
    padding: 15,
    fontSize: 20,
    flexDirection: 'column',
  },
  body: {
    padding: 10,
    marginBottom: 0,
  },
  image: {
     // justifyContent: 'center',
     // margin: 20,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 8,
    margin: 7,
    borderColor: Colors.WHITE,
  },
  name: {
    fontSize: 22,
    fontWeight: '200',
    backgroundColor: 'transparent',
  },
  email: {
    fontSize: 12,
    fontWeight: '100',
    color: 'grey',
    backgroundColor: 'transparent',
  },
  row: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loading: {
    justifyContent: 'center',
  },
});
