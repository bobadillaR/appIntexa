import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Alert, TextInput } from 'react-native';
import { Colors } from './../styles';
import { Icon, FormLabel, FormInput, CheckBox, Grid, Col, Text, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Firebase from 'firebase';
import Hr from 'react-native-hr';
import ModalPicker from 'react-native-modal-picker';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

export default class Protocolo extends Component {

  static propTypes = {
    user: PropTypes.object,
    dataUser: PropTypes.object,
    dataProyect: PropTypes.object,
    jefeProyectoName: PropTypes.string,
    itosName: PropTypes.array,
    dataKeys: PropTypes.array,
    responsable: PropTypes.object,
    ito: PropTypes.string,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    especialidad: PropTypes.string,
    partida: PropTypes.string,
    protocoloKey: PropTypes.integer,
    proyectId: PropTypes.integer,
    validadorResponsable: PropTypes.bool,
    lastValue: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  componentWillMount() {
    const { dataKeys, dataProyect, lastValue } = this.props;
    Firebase.database().ref(`protocolos/${dataKeys[0]}-${dataKeys[1]}-${dataKeys[2]}`).on('value', protocoloValue => {
      const protocoloItems = protocoloValue.val();
      let { protocoloKey } = this.props;
      let protocolo = {};
      if (protocoloKey || protocoloKey === 0) {
        protocolo = dataProyect.protocolo[protocoloKey][lastValue];
      } else {
        protocoloKey = dataProyect.protocolo ? dataProyect.protocolo.length : 0;
        protocolo = protocoloItems.map(item => (
          { tipo: item.tipo, valor: (item.tipo === 3 || item.tipo === 13) ? 0 : '', comentario: '' }
        ));
      }
      this.setState({ protocolo, protocoloKey, protocoloItems });
    });
  }


  saveProtocolo() {
    // this.setState({ loading: true });
    const { protocolo, protocoloKey } = this.state;
    const { proyectId, ito, responsable, descripcion, partida, especialidad, dataKeys, validadorResponsable } = this.props;
    const newProtocoloKey = this.props.protocoloKey;
    const protocoloData = {};
    protocoloData.fecha = moment().format('D-MM-YYYY_hh:mm');
    protocoloData.ito = ito;
    protocoloData.responsable = responsable;
    protocoloData.descripcion = descripcion;
    protocoloData.partida = partida;
    protocoloData.especialidad = especialidad;
    protocoloData.estado = 'aprobado';
    protocoloData.dataKeys = dataKeys;
    protocoloData.lastValue = moment().format('D-MM-YYYY_hh:mm');
    protocoloData.validadorResponsable = validadorResponsable;
    protocolo.forEach(element => {
      if (element.tipo === 3) {
        if (element.valor === 2) {
          protocoloData.estado = 'rechazado';
        }
        if (element.valor === 0 && protocolo.estado !== 'rechazado') {
          protocoloData.estado = 'pendiente';
        }
      }
    });
    if (newProtocoloKey || newProtocoloKey === 0) {
      Firebase.database().ref(`proyects/${proyectId}/protocolo/${protocoloKey}`).update({ lastValue: protocoloData.lastValue, estado: protocoloData.estado })
      .then(Firebase.database().ref(`proyects/${proyectId}/protocolo/${newProtocoloKey}/${protocoloData.fecha}`).update(protocolo)
      .then(Actions.pop()));
    } else {
      Firebase.database().ref(`proyects/${proyectId}/protocolo/${protocoloKey}`).set(protocoloData)
      .then(Firebase.database().ref(`proyects/${proyectId}/protocolo/${protocoloKey}/${protocoloData.fecha}`).set(protocolo)
      .then(Actions.pop()));
    }
  }

  renderItems(protocoloItems) {
    let checkboxCount = 0;
    let modal = [];
    let modalCount = 0;
    const { protocolo } = this.state;
    const toRender = protocolo && protocolo.length > 0 && protocoloItems && protocoloItems.map((item, key) => {
      if (item.tipo === 1) {
        return (
          <Hr lineColor="#b3b3b3" text={item.nombre} textColor={Colors.MAIN} style={{ marginTop: 10 }} />
        );
      }
      if (item.tipo === 2) {
        return (
          <View>
            <FormLabel>{item.nombre}</FormLabel>
            <FormInput
              onChangeText={text => {
                protocolo[key].valor = text;
                this.setState({ protocolo });
              }}
              value={protocolo[key].valor}
              selectionColor={Colors.MAIN}
              underlineColorAndroid={Colors.MAIN}
            />
          </View>
        );
      }
      if (item.tipo === 3) {
        checkboxCount++;
        return (
          <View>
            <Grid style={{ minHeight: 45 }}>
              <Col size={9} style={{ textAlign: 'center' }}>
                <FormLabel>{item.nombre}</FormLabel>
              </Col>
              <Col size={1}>
                <CheckBox
                  checkedIcon={
                    protocolo[key].valor === 0 ? 'circle' :
                    protocolo[key].valor === 1 ? 'check-circle' :
                    protocolo[key].valor === 2 ? 'times-circle' : 'minus-circle'
                  }
                  checkedColor={
                    protocolo[key].valor === 0 ? '#E2E1E3' :
                    protocolo[key].valor === 1 ? '#9BCC5F' :
                    protocolo[key].valor === 2 ? '#e50000' : '#b3b3b3'
                  }
                  center
                  checked
                  onPress={() => {
                    protocolo[key].valor = (protocolo[key].valor + 1) % 4;
                    this.setState({ protocolo });
                  }}
                />
              </Col>
            </Grid>
            <Hr lineColor="#b3b3b3" />
          </View>
          );
      }
      if (item.tipo === 4) {
        modal.push({ key: item.nombre, label: item.nombre });
      }
      if (item.tipo === 5) {
        modal.push({ key: item.nombre, label: item.nombre });
        const modalAux = modal;
        modal = [];
        modalCount++;
        return (
          <View>
            <ModalPicker
              data={modalAux}
              initValue="Seleccione..."
              // style={styles.input}
              onChange={option => {
                protocolo[key].valor = option.label;
                this.setState({ protocolo });
              }}
              value={protocolo[key].valor}
              cancelText="Cancelar"
              optionTextStyle={{ color: Colors.MAIN }}
              selectTextStyle={{ color: protocolo[key].valor === '' ? 'red' : 'black' }}
            />
            {protocolo[key].valor === 'Otro (indicar)' &&
              <View>
                <FormLabel>Agregue otro</FormLabel>
                <FormInput
                  selectionColor={Colors.MAIN}
                  underlineColorAndroid={Colors.MAIN}
                  value={protocolo[key].comentario}
                  onChangeText={value => {
                    protocolo[key].comentario = value;
                    this.setState({ protocolo });
                  }}
                />
              </View>
            }
          </View>
        );
      }
      if (item.tipo === 6) {
        Alert.alert(
          'Protocolo no disponible',
          `${item.nombre}`,
          [
            { text: 'Aceptar', onPress: () => Actions.pop() },
          ]
        );
      }
      if (item.tipo === 7) {
        return (
          <Grid>
            <Col>
              <FormLabel>{item.nombre}</FormLabel>
              <DatePicker
                date={protocolo[key].valor}
                style={{ width: Dimensions.get('window').width }}
                mode="date"
                placeholder="seleccione una fecha"
                format="DD-MM-YYYY"
                minDate="01-01-17"
                confirmBtnText="Aceptar"
                cancelBtnText="Cancelar"
                onDateChange={date => {
                  protocolo[key].valor = date;
                  this.setState({ protocolo });
                }}
              />
            </Col>
          </Grid>
        );
      }
      if (item.tipo === 9) {
        return (
          <View>
            <FormLabel>{item.nombre}</FormLabel>
            <FormInput
              keyboardType={'numeric'}
              onChangeText={text => {
                protocolo[key].valor = text;
                this.setState({ protocolo });
              }}
              value={protocolo[key].valor}
              selectionColor={Colors.MAIN}
              underlineColorAndroid={Colors.MAIN}
            />
          </View>
        );
      }
      if (item.tipo === 10) {
        return (<Text h4>{item.nombre}</Text>);
      }
      if (item.tipo === 12) {
        return (
          <View>
            <FormLabel>{item.nombre}</FormLabel>
            <TextInput
              underlineColorAndroid={Colors.MAIN}
              multiline
              onChangeText={text => {
                protocolo[key].valor = text;
                this.setState({ protocolo });
              }}
              value={protocolo[key].valor}
            />
          </View>
        );
      }
      if (item.tipo === 13) {
        return (
          <View>
            <FormLabel>{item.nombre}</FormLabel>
            <Grid>
              <Col size={9}>
                <FormInput
                  onChangeText={text => {
                    protocolo[key].comentario = text;
                    this.setState({ protocolo });
                  }}
                  selectionColor={Colors.MAIN}
                  underlineColorAndroid={Colors.MAIN}
                  value={protocolo[key].comentario}
                />
              </Col>
              <Col size={1}>
                <CheckBox
                  checkedIcon={
                    protocolo[key].valor === 0 ? 'circle' :
                    protocolo[key].valor === 1 ? 'check-circle' :
                    protocolo[key].valor === 2 ? 'times-circle' : 'minus-circle'
                  }
                  checkedColor={
                    protocolo[key].valor === 0 ? '#E2E1E3' :
                    protocolo[key].valor === 1 ? '#9BCC5F' :
                    protocolo[key].valor === 2 ? '#e50000' : '#b3b3b3'
                  }
                  center
                  checked
                  onPress={() => {
                    protocolo[key].valor = (protocolo[key].valor + 1) % 4;
                    this.setState({ protocolo });
                  }}
                />
              </Col>
            </Grid>
          </View>
        );
      }
      return null;
    });
    return (toRender);
  }

  render() {
    const { protocoloItems, modalVisible, protocoloKey } = this.state;
    const { ito, validadorResponsable, responsable, proyectId } = this.props;
    // console.log(responsable);
    return (
      <View style={styles.container} onPress={() => this.setState({ modalVisible: false })}>
        <View style={styles.title}>
          <Col size={9}>
            <Text style={styles.superTitle}>{this.props.nombre}</Text>
          </Col>
          <Col size={1}>
            <Icon
              name={'bars'}
              type="font-awesome"
              color="white"
              size={30}
              onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}
            />
          </Col>
        </View>
        {modalVisible &&
          <View style={{ backgroundColor: '#ededed', padding: 20 }}>
            <FormLabel>Opciones</FormLabel>
            {/* <Button
              raised
              small
              iconRight
              onPress={() => Actions.camera({ proyectId, protocoloId: protocoloKey })}
              title="Tomar Fotografía"
              icon={{ name: 'add-a-photo' }}
              backgroundColor={Colors.MAIN}
              buttonStyle={{ marginTop: 10 }}
            />
            <Button
              raised
              iconRight
              small
              // onPress={() => }
              title="Ver Imágenes"
              icon={{ name: 'collections' }}
              backgroundColor={Colors.MAIN}
              buttonStyle={{ marginTop: 10 }}
            /> */}
            <Button
              raised
              small
              onPress={() => this.saveProtocolo()}
              iconRight
              title="Guardar Protocolo"
              icon={{ name: 'floppy-o', type: 'font-awesome' }}
              backgroundColor={Colors.MAIN}
              buttonStyle={{ marginTop: 10 }}
            />
            <Button
              raised
              small
              onPress={() => Actions.pop()}
              title="Volver"
              iconRight
              icon={{ name: 'reply' }}
              backgroundColor={Colors.MAIN}
              buttonStyle={{ marginTop: 10 }}
            />
          </View>}
        <ScrollView style={styles.ScrollView}>
          <Hr lineColor="#b3b3b3" text={`Fecha de creación ${moment().format('D-MM-YYYY')}`} textColor={Colors.MAIN} style={{ marginTop: 10, marginBottom: 10 }} />
          <FormLabel>{`ITO: ${ito}`}</FormLabel>
          <FormLabel>{validadorResponsable ? `Responsable: ${responsable.nombre}` : `Responsable: ${responsable}`}</FormLabel>
          {protocoloItems && this.renderItems(protocoloItems)}
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
  },
  ScrollView: {
    padding: 5,
    // marginBottom: 20,
    // flex: 1,
    // flexDirection: 'column', // row, column
    // flexWrap: 'nowrap' // wrap, nowrap
    // alignItems: 'center', // flex-start, flex-end, center, stretch
    // alignSelf: 'auto', // auto, flex-start, flex-end, center, stretch
    // justifyContent: 'space-around', // flex-start, flex-end, center, space-between, space-around
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
    // alignSelf: 'center', // auto, flex-start, flex-end, center, stretch
    backgroundColor: Colors.MAIN,
    width: Dimensions.get('window').width,
    // justifyContent: 'space-between', // flex-start, flex-end, center, space-between, space-around
    // flex: 1,
    flexDirection: 'row', // row, column
    padding: 10,
  },
  superTitle: {
    fontSize: 22,
    color: 'white',
  },
  tableText: {
    width: Dimensions.get('window').width * 0.55,
    fontSize: 20,
  },
  optionaTable: {
    width: Dimensions.get('window').width * 0.15,
    textAlign: 'center',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row', // row, column
  },
});
