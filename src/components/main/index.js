import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, Dimensions, ListView } from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements'
import NewProtocolo from './newProtocolo';
import Seguimiento from './seguimiento';
import Config from './config';
import Firebase from 'firebase';
var ScrollableTabView = require('react-native-scrollable-tab-view');


import { Colors } from './../styles';

export default class Main extends Component {

  static propTypes = {
    user: PropTypes.object,
    dataUser: PropTypes.object,
    itosName: PropTypes.array,
    proyectId: PropTypes.integer,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Seguimiento',
      dataProyect: {},
    };
  }

  componentWillMount() {
    const { proyectId } = this.props;
    Firebase.database().ref(`proyects/${proyectId}`).on('value', snapshot => {
      const proyecto = snapshot.val();
      if (proyecto.jefeProyecto !== '') {
        Firebase.database().ref(`/users/${proyecto.jefeProyecto}`).on('value', jefeProyectoValue => this.setState({ jefeProyectoName: jefeProyectoValue.val().nombre }));
      }
      if (proyecto.ito) {
        const itosName = [];
        proyecto.ito.forEach(itoKey => Firebase.database().ref(`/users/${itoKey}`).on('value', itoValue => {
          itosName.push(itoValue.val().nombre);
          this.setState({ itosName });
        }));
      }
      this.setState({ dataProyect: proyecto });
    });
  }

  render() {
    const { selectedTab, dataProyect, jefeProyectoName, itosName } = this.state;
    const { user, dataUser, proyectId } = this.props;
    return (
      <Tabs
        tabBarStyle={styles.tabbar}
        tabBarShadowStyle={{ color: 'red' }}
      >
        <Tab
          titleStyle={{ fontSize: 12, marginTop: -5 }}
          selectedTitleStyle={{ fontWeight: 'bold', fontSize: 12, marginTop: -5, color: Colors.MAIN }}
          selected={selectedTab === 'Seguimiento'}
          title={'Seguimiento'}
          // titleStyle={{ backgroundColor: Colors.MAIN }}
          renderIcon={() => <Icon containerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }} color={'#5e6977'} name="storage" size={30} />}
          renderSelectedIcon={() => <Icon color={Colors.MAIN} name="storage" size={33} />}
          onPress={() => this.setState({ selectedTab: 'Seguimiento' })}
        >
          <Seguimiento dataProyect={dataProyect} dataUser={dataUser} proyectId={proyectId} />
        </Tab>
        <Tab
          titleStyle={{ fontSize: 12, marginTop: -5 }}
          selectedTitleStyle={{ fontWeight: 'bold', fontSize: 12, marginTop: -5, color: Colors.MAIN }}
          selected={selectedTab === 'Protocolo'}
          title={'Protocolo'}
          renderIcon={() => <Icon containerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }} color={'#5e6977'} name="clipboard" type="font-awesome" size={30} />}
          renderSelectedIcon={() => <Icon color={Colors.MAIN} name="clipboard" type="font-awesome" size={33} />}
          onPress={() => this.setState({ selectedTab: 'Protocolo' })}
        >
          <NewProtocolo dataProyect={dataProyect} dataUser={dataUser} jefeProyectoName={jefeProyectoName} itosName={itosName} proyectId={proyectId} />
        </Tab>
        <Tab
          titleStyle={{ fontSize: 12, marginTop: -5 }}
          selectedTitleStyle={{ fontWeight: 'bold', fontSize: 12, marginTop: -5, color: Colors.MAIN }}
          selected={selectedTab === 'Configuración'}
          title={'Configuración'}
          renderIcon={() => <Icon containerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }} color={'#5e6977'} name="gears" type="font-awesome" size={30} />}
          renderSelectedIcon={() => <Icon color={Colors.MAIN} name="gears" type="font-awesome" size={33} />}
          onPress={() => this.setState({ selectedTab: 'Configuración' })}
        >
          <Config dataProyect={dataProyect} dataUser={dataUser} jefeProyectoName={jefeProyectoName} itosName={itosName} user={user} proyectId={proyectId} />
        </Tab>

      </Tabs>
    );
  }
}


const styles = {
  container: {

  },
  tabbar: {
    borderTopWidth: 0.5,
    borderTopColor: 'grey',
    backgroundColor: '#F9F9F9',
    paddingBottom: 0,
  },
};
