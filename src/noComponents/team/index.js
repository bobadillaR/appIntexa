import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
// import renderIf from 'render-if';
import { Actions } from 'react-native-router-flux';

import { Colors } from '../../styles';

/*
  Component life-cycle:
  https://facebook.github.io/react/docs/component-specs.html
 */


export default class Team extends Component {

  static get defaultProps() {
    return {
      message: 'Template',
    };
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    // ES6 bindings
    // See: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    // See: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md#es6-classes
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Equipo</Text>
        <Text style={styles.subHeaderTitle}>Itos</Text>
        <View style={styles.innerContainer}>
          <View style={styles.row}>
            <View style={styles.name}>
              <Text style={styles.tableHeader}>Nombre</Text>
              <Text>Juan Molina</Text>
              <Text>Felipe Bobadilla</Text>
            </View>
            <View style={styles.name}>
              <Text style={styles.tableHeader}>Mail</Text>
              <Text>jimolina@uc.cl</Text>
              <Text>fabobadi@uc.cl</Text>
            </View>
            <View style={styles.name}>
              <Text style={styles.tableHeader}>Estado</Text>
              <Text>Creador</Text>
              <Text>Editor</Text>
            </View>
          </View>
          <View>
            <View style={styles.row}>
              <Button
                style={styles.buttonText}
                containerStyle={styles.button}
                // styleDisabled={{ backgroundColor: Colors.GRAY }}
                // disabled={nombre === '' || categoria === '' || especialidad === ''}
                // onPress={creating ? this.signUp : this.signIn}
                onPress={() => Actions.pop()}
              >
                Agregar[+]
                {/* {connecting ? 'Connecting...' : (creating ? 'Registrar' : 'Ingresar')} */}
              </Button>
              <Button
                style={styles.buttonText}
                containerStyle={styles.button}
                // styleDisabled={{ backgroundColor: Colors.GRAY }}
                // disabled={nombre === '' || categoria === '' || especialidad === ''}
                // onPress={creating ? this.signUp : this.signIn}
                onPress={() => Actions.pop()}
              >
                Editar
                {/* {connecting ? 'Connecting...' : (creating ? 'Registrar' : 'Ingresar')} */}
              </Button>
            </View>
          </View>
          <Button
            style={styles.buttonText}
            containerStyle={styles.button}
            // styleDisabled={{ backgroundColor: Colors.GRAY }}
            // disabled={nombre === '' || categoria === '' || especialidad === ''}
            // onPress={creating ? this.signUp : this.signIn}
            onPress={() => Actions.pop()}
          >
            Volver
            {/* {connecting ? 'Connecting...' : (creating ? 'Registrar' : 'Ingresar')} */}
          </Button>
        </View>
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
    // flexDirection: 'column', // row, column
    // flexWrap: 'nowrap' // wrap, nowrap
    // alignItems: 'center', // flex-start, flex-end, center, stretch
    // alignSelf: 'auto', // auto, flex-start, flex-end, center, stretch
    // justifyContent: 'center', // flex-start, flex-end, center, space-between, space-around
    // position: 'relative', // absolute, relative
    // backgroundColor: 'white',
    // margin: 0,
    // padding: 0,
    // right: 0,
    // top: 0,
    // left: 0,
    // bottom: 0,
  },
  innerContainer: {
    flex: 1,
    // flexDirection: 'column', // row, column
    // flexWrap: 'nowrap' // wrap, nowrap
    alignItems: 'center', // flex-start, flex-end, center, stretch
    // alignSelf: 'auto', // auto, flex-start, flex-end, center, stretch
    justifyContent: 'space-around', // flex-start, flex-end, center, space-between, space-around
    // position: 'relative', // absolute, relative
    // backgroundColor: 'white',
    // margin: 0,
    // padding: 0,
    // right: 0,
    // top: 0,
    // left: 0,
    // bottom: 0,
  },
  title: {
    alignSelf: 'center', // auto, flex-start, flex-end, center, stretch
    fontSize: 22,
    backgroundColor: Colors.MAIN,
    width: Dimensions.get('window').width,
    // flex: 1,
    flexDirection: 'row', // row, column
    color: Colors.WHITE,
    padding: 10,
  },
  subHeaderTitle: {
    fontSize: 22,
    color: Colors.GRIS,
    padding: 5,
    alignSelf: 'center',
    // textDecorationLine: 'underline',
  },
  buttonText: {
    fontSize: 18,
    color: Colors.WHITE,
  },
  button: {
    padding: 10,
    marginBottom: 10,
    margin: 20,
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.3,
    backgroundColor: Colors.MAIN,
    borderRadius: 7,
  },
  name: {
    padding: 20,
    // width: Dimensions.get('window').width * 0.5,
  },
  email: {
    padding: 20,
    width: Dimensions.get('window').width * 0.5,
  },
  row: {
    flexDirection: 'row', // row, column
    justifyContent: 'space-around',
  },
  tableHeader: {
    fontSize: 20,
    color: Colors.GRIS,
    borderBottomColor: Colors.GRIS,
    borderBottomWidth: 1,
  },
});
