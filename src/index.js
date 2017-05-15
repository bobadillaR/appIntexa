import React, { Component } from 'react';
import { View, StyleSheet, BackAndroid } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import Firebase from 'firebase';
import Orientation from 'react-native-orientation';

import Metrics from './components/metrics';
import Platform from './utils/platform';

import Toolbar from './components/utils/toolbar/';
import TabIcon from './components/utils/tab-icon';
import Camera from './components/utils/camera';

import Intro from './components/start&User/intro';
import Login from './components/start&User/login';
// import NewUser from './components/start&User/newUser';
import EditUser from './components/start&User/editUser';
// import Team from './components/start&User/team';

import LinkProject from './components/project/linkProject';
import EditProyect from './components/project/editProyect';

import Main from './components/main';
import newProtocolo from './components/main/newProtocolo';
import Seguimiento from './components/main/seguimiento';
import Config from './components/main/config';

import Protocolo from './components/protocolo';

export default class Routing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      loading: false,
      connected: false,
      user: '',
    };
    const config = {
      apiKey: 'AIzaSyCoyO4KxBOqlDCpre07Z7KcPwBfVSPPisg',
      authDomain: 'usuarios-intexa.firebaseapp.com',
      databaseURL: 'https://usuarios-intexa.firebaseio.com',
      storageBucket: 'usuarios-intexa.appspot.com',
      messagingSenderId: '441493656293',
    };
    Firebase.initializeApp(config);
  }

  componentDidMount() {
    if (Platform.Android && !this.state.mounted) {
      BackAndroid.addEventListener('hardwareBackPress', this.goBack);
    }
    Orientation.lockToPortrait();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    // Orientation.removeOrientationListener(this._orientationDidChange);
  }

  goBack() {
    try {
      Actions.pop();
    } catch (err) {
      BackAndroid.exitApp();
    }
    return true;
  }

  render() {
    const noSwipe = {
      panHandlers: null,
    };

    const navbar = {
      navBar: Toolbar,
    };

    const tab = {
      // ...padding,
      ...navbar,
      icon: TabIcon,
      sceneStyle: { paddingBottom: Metrics.NAVBAR_HEIGHT },
    };

    const noBack = {
      ...noSwipe,
      renderLeftButton: () => <View />,
    };
    // TODO: agregar seccion datos #main
    return (
      <Router>
        <Scene key="root">
          <Scene key="intro" hideNavBar initial component={Intro} />
          <Scene key="login" hideNavBar component={Login} />
          {/* <Scene key="newUser" hideNavBar type="replace" component={NewUser} /> */}
          <Scene key="editUser" hideNavBar component={EditUser} />
          <Scene key="editProyect" component={EditProyect} />
          <Scene key="linkProject" hideNavBar type="replace" component={LinkProject} />
          <Scene key="protocolo" component={Protocolo} />
          <Scene key="camera" component={Camera} />
          {/* <Scene key="team" component={Team} /> */}
          <Scene key="main" hideNavBar tabBarStyle={styles.tabbar} component={Main}{...noBack} >
            {/* <Scene
              key="Seguimiento" title="Seguimiento" tabBarStyle={styles.tabbar} hideNavBar
              image="tasks" component={Seguimiento} {...tab}
            />
            <Scene
              key="nuevo" title="Nuevo Protocolo" tabBarStyle={styles.tabbar} hideNavBar
              image="edit" component={newProtocolo} {...tab}
            />
            <Scene
              key="config" title="Configuración" tabBarStyle={styles.tabbar} hideNavBar
              image="gears" component={Config} {...tab}
            /> */}
          </Scene>
        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  tabbar: {
    borderTopWidth: 0.5,
    borderTopColor: 'grey',
    backgroundColor: '#F9F9F9',
    paddingBottom: 0,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  title: {
    color: 'white',
  },
});
