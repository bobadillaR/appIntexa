import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
// import Firebase from 'firebase';
import { Colors } from '../../styles';
import { SearchBar, List, ListItem, FormLabel } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

// TODO: upload new release, change last update protocolo

export default class Seguimiento extends Component {

  static propTypes = {
    user: PropTypes.object,
    dataUser: PropTypes.object,
    dataProyect: PropTypes.object,
    itosName: PropTypes.array,
    proyectId: PropTypes.integer,
  }


  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };

    // ES6 bindings
    // See: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    // See: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md#es6-classes
  }

  viewProtocolo(protocolo, i) {
    const { dataProyect, proyectId } = this.props;
    console.log(i);
    Actions.protocolo({
      dataKeys: protocolo.dataKeys,
      responsable: protocolo.responsable,
      validadorResponsable: protocolo.validadorResponsable,
      ito: protocolo.ito,
      descripcion: protocolo.responsable,
      especialidad: protocolo.especialidad,
      partida: protocolo.partida,
      dataProyect,
      proyectId,
      nombre: protocolo.descripcion,
      lastValue: protocolo.lastValue,
      protocoloKey: i,
    });
  }

  render() {
    const { search } = this.state;
    const { dataProyect } = this.props;
    // console.log(dataProyect.protocolo[0]);
    return (
      <View style={styles.container}>
        <SearchBar
          lightTheme
          onChangeText={text => this.setState({ search: text })}
          placeholder="Busca tu protocolo ..."
        />
        <ScrollView>
          <FormLabel labelStyle={{ fontSize: 20, marginBottom: -15 }}>Lista de protocolos</FormLabel>
          <List containerStyle={{ marginBottom: 20 }}>
            {dataProyect && dataProyect.protocolo && dataProyect.protocolo.map((element, i) =>
              <ListItem
                key={i}
                style={{ paddingTop: 0 }}
                title={`${element.descripcion} - ${element.lastValue}`}
                leftIcon={{ name: 'label-outline', color: Colors.MAIN }}
                // title={dataProyect.protocolo[i]}
                onPress={() => this.viewProtocolo(element, i)}
              />
            )}
          </List>
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
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
  input: {
    width: Dimensions.get('window').width * 0.8,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'center', // auto, flex-start, flex-end, center, stretch
    // borderRadius: 20,
    // marginVertical: 10,
    color: Colors.WHITE,
  },
  nav: {
    justifyContent: 'space-around', // auto, flex-start, flex-end, center, stretch
    padding: 5,
    height: 50,
    alignItems: 'center', // flex-start, flex-end, center, stretch
    backgroundColor: Colors.MAIN,
    flexDirection: 'row', // row, column
  },
  icon: {
    // alignSelf: 'flex-end', // auto, flex-start, flex-end, center, stretch

    // backgroundColor: 'rgba(0,0,0,0.2)',
  },
  titleProtocolo: {
    fontSize: 20,
    padding: 10,
    color: Colors.MAIN,
  },
  row: {
    flexDirection: 'row', // row, column
  },
  protocoloView: {
    flexDirection: 'row', // row, column
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.MAIN,
  },
  protocolos: {
    padding: 5,
  },
});
