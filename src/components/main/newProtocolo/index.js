import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, Alert } from 'react-native';

import moment from 'moment';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import ModalPicker from 'react-native-modal-picker';
import { Colors } from '../../styles';
import Hr from 'react-native-hr';
// import Firebase from 'firebase';

export default class NewProtocolo extends Component {

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
      loading: false,
      textInputValue: '',
      categoria: '',
      numeroEspecialidad: 0,
      numeroPartida: 0,
      partida: '',
      descripcion: '',
      especialidad: '',
      ito: '',
      idPartida: '0',
      idEspecialidad: '0',
      idDescripcion: '0',
      responsable: '',
      responsableCargo: '',
      responsableNombre: '',
      validadorResponsable: false,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount() {
    this.setState({ loading: true });
    this.fetchData();
  }

  fetchData() {
    let listaProtocolos = {};
    const especialidad = {};
    if (typeof this.props.dataProyect.listaProtocolos !== 'undefined') {
      listaProtocolos = this.props.dataProyect.listaProtocolos;
      let partida = {};
      let descripcion = {};
      let especialidadKey = 0;
      let partidaKey = 0;
      Object.keys(listaProtocolos).forEach(key => {
        const protocolosKey = key.split('-');
        if (especialidadKey !== protocolosKey[0]) {
          partida = {};
          descripcion = {};
          especialidadKey = protocolosKey[0];
        }
        if (partidaKey !== protocolosKey[1]) {
          descripcion = {};
          partidaKey = protocolosKey[1];
        }
        descripcion[protocolosKey[2]] = listaProtocolos[key];
        descripcion[protocolosKey[2]].nombre = listaProtocolos[key].descripcion;
        partida[protocolosKey[1]] = descripcion;
        partida[protocolosKey[1]].nombre = listaProtocolos[key].partida;
        especialidad[protocolosKey[0]] = partida;
        especialidad[protocolosKey[0]].nombre = listaProtocolos[key].especialidad;
      });
    }
    const { itosName, dataProyect } = this.props;
    let itoList = [];
    itoList.push({ key: -1, section: true, label: 'ITO' });
    itoList = itosName && itosName.map(ito => {
      const result = {
        key: ito,
        label: ito,
      };
      return result;
    });
    const responsableList = [];
    responsableList.push({ key: -1, section: true, label: 'Responsable' });
    responsableList.push({ key: dataProyect.jefeTerreno, label: dataProyect.jefeTerreno });
    responsableList.push({ key: dataProyect.jefeObra, label: dataProyect.jefeObra });
    responsableList.push({ key: 'otro', label: 'otro' });
    const dataEspecialidad = [];
    const dataPartida = [];
    const dataDescripcion = [];
    dataEspecialidad.push({ key: -1, section: true, label: 'Especialidad' });
    Object.keys(especialidad).forEach(key => {
      if (key !== 'nombre') {
        dataEspecialidad.push({
          key: key.split('-')[0],
          label: especialidad[key].nombre,
        });
      }
    });
    // const { dataUser } = this.props;
    // console.log(dataUser);
    // if (dataUser.tipo === 'ITO') {
    //   console.log(dataUser.nombre);
    //   this.setState({ ito: { key: dataUser.nombre, label: dataUser.nombre } });
    // }
    this.setState({ loading: false, listaProtocolos: especialidad, itoList, responsableList, dataEspecialidad, dataPartida, dataDescripcion });
  }

  createProtocolo() {
    const { idEspecialidad, idPartida, partida, especialidad, descripcion, ito, responsable, validadorResponsable, idDescripcion, responsableCargo, responsableNombre } = this.state;
    console.log(responsableNombre, responsableCargo);
    const { dataProyect, proyectId } = this.props;
    if (idPartida !== '0' && idEspecialidad !== '0' && idDescripcion !== '0' && ito) {
      Actions.protocolo({
        dataKeys: [idEspecialidad, idPartida, idDescripcion],
        responsable: validadorResponsable ? { nombre: responsableNombre, cargo: responsableCargo } : responsable,
        validadorResponsable,
        ito: ito.label,
        descripcion,
        especialidad,
        partida,
        dataProyect,
        proyectId,
        nombre: descripcion,
      });
      this.setState({ idDescripcion: '0', idEspecialidad: '0', idPartida: '0', ito: '', descripcion: '', especialidad: '', partida: '', dataProyect });
    } else {
      Alert.alert(
        'Agregue todos los campos necesarios',
        'No puede quedar ninguno en rojo',
        [
          { text: 'Aceptar', style: 'cancel' },
        ]
      );
    }
  }

  renderDataPicker(type, option) {
    const { idEspecialidad, listaProtocolos } = this.state;
    const { dataProyect } = this.props;
    if (dataProyect.listaProtocolos && listaProtocolos) {
      if (type === '1') {
        const dataPartida = [];
        dataPartida.push({ key: -1, section: true, label: 'Partida' });
        Object.keys(listaProtocolos[option.key]).forEach(key => {
          if (key !== 'nombre') {
            dataPartida.push({
              key,
              label: listaProtocolos[option.key][key].nombre,
            });
          }
        });
        this.setState({ especialidad: option.label, idEspecialidad: option.key, descripcion: '', idDescripcion: '0', isPartida: '0', partida: '', dataPartida, dataDescripcion: [] });
      } else if (type === '2' && idEspecialidad !== '0') {
        const dataDescripcion = [];
        dataDescripcion.push({ key: -1, section: true, label: 'Descripción' });
        Object.keys(listaProtocolos[idEspecialidad][option.key]).forEach(key => {
          if (key !== 'nombre') {
            dataDescripcion.push({
              key,
              label: listaProtocolos[idEspecialidad][option.key][key].nombre,
            });
          }
        });
        this.setState({ partida: option.label, idPartida: option.key, descripcion: '', idDescripcion: '0', dataDescripcion });
      } else {
        this.setState({ descripcion: option.label, idDescripcion: option.key });
      }
    }
  }

  render() {
    const { loading, partida, especialidad, descripcion, itoList, ito, responsableList, responsable, validadorResponsable, responsableCargo, responsableNombre, dataEspecialidad, dataPartida, dataDescripcion } = this.state;
    const time = moment().format('D-MM-YYYY');
    console.log(this.props.proyectId);
    console.log(responsableNombre);
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Crear Protocolo</Text>
        <Hr lineColor="#b3b3b3" />
        <ScrollView style={styles.content}>
          <Hr lineColor="#b3b3b3" text="Lista de Protocolos" textColor={Colors.MAIN} />
          <FormLabel>Especialidad</FormLabel>
          <ModalPicker
            data={dataEspecialidad}
            initValue="Seleccione una especialidad"
            onChange={option => this.renderDataPicker('1', option)}
            value={especialidad}
            cancelText="Cancelar"
            optionTextStyle={{ color: Colors.MAIN }}
            selectTextStyle={{ color: especialidad === '' ? 'red' : 'black' }}
          />
          <FormLabel>Partida</FormLabel>
          <ModalPicker
            data={dataPartida}
            initValue="Seleccione una partida"
            onChange={option => this.renderDataPicker('2', option)}
            value={partida}
            cancelText="Cancelar"
            optionTextStyle={{ color: Colors.MAIN }}
            selectTextStyle={{ color: partida === '' ? 'red' : 'black' }}
          />
          <FormLabel>Descripción</FormLabel>
          <ModalPicker
            data={dataDescripcion}
            initValue="Seleccione una descripción"
            style={styles.input}
            onChange={option => this.renderDataPicker('3', option)}
            value={descripcion}
            cancelText="Cancelar"
            optionTextStyle={{ color: Colors.MAIN }}
            selectTextStyle={{ color: descripcion === '' ? 'red' : 'black' }}
          />
          <Hr lineColor="#b3b3b3" text="Profesionales" textColor={Colors.MAIN} style={{ paddingTop: 5 }} />
          <FormLabel>ITO</FormLabel>
          <ModalPicker
            data={itoList}
            initValue="Seleccione un ITO"
            onChange={itoValue => this.setState({ ito: itoValue })}
            value={ito}
            cancelText="Cancelar"
            selectTextStyle={{ color: ito === '' ? 'red' : 'black' }}
            optionTextStyle={{ color: Colors.MAIN }}
          />
          <FormLabel>Responsable</FormLabel>
          <ModalPicker
            optionTextStyle={{ color: Colors.MAIN }}
            data={responsableList}
            initValue="Seleccione un Responsable"
            onChange={responsableValue => this.setState({ responsable: responsableValue.label, validadorResponsable: responsableValue.label === 'otro' })}
            value={responsable}
            cancelText="Cancelar"
            // selectTextStyle={{ color: responsable === '' ? 'red' : 'black' }}
          />
          {validadorResponsable &&
            <View>
              <FormLabel>Agregue el nombre</FormLabel>
              <FormInput
                selectionColor={Colors.MAIN}
                underlineColorAndroid={Colors.MAIN}
                value={responsableNombre}
                onChangeText={nombre => this.setState({ responsableNombre: nombre })}
              />
              <FormLabel>Agregue el cargo</FormLabel>
              <FormInput
                selectionColor={Colors.MAIN}
                underlineColorAndroid={Colors.MAIN}
                value={responsableCargo}
                onChangeText={cargo => this.setState({ responsableCargo: cargo })}
              />
            </View>
          }
          <Hr lineColor="#b3b3b3" text={`Fecha de creación ${time}`} textColor={Colors.MAIN} style={{ marginTop: 10, marginBottom: 10 }} />
          <Button
            raised
            small
            onPress={() => this.createProtocolo()}
            title="Crear Protocolo"
            backgroundColor={Colors.MAIN}
            buttonStyle={{ marginTop: 10 }}
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    // flexDirection: 'column', // row, column
    // flexWrap: 'nowrap' // wrap, nowrap
    // alignItems: 'flex-start', // flex-start, flex-end, center, stretch
    // justifyContent: 'space-around', // flex-start, flex-end, center, space-between, space-around
    // alignSelf: 'auto', // auto, flex-start, flex-end, center, stretch
    // position: 'relative', // absolute, relative
    // backgroundColor: 'white',
    // margin: 0,
    // padding: 0,
    // right: 0,
    // top: 0,
    // left: 0,
    // bottom: 0,
  },
  content: {
    margin: 10,
    marginBottom: 0,
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
  row: {
    flexDirection: 'row',
  },
  subtitle: {
    fontSize: 18,
    width: Dimensions.get('window').width * 0.3,
  },
  input: {
    // fontSize: 18,
    marginBottom: 10,
  },
  inputComment: {
    fontSize: 18,
    flex: 1,
    marginLeft: 2,
    // height: Dimensions.get('window').height * 0.1,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.WHITE,
    padding: 20,
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.5,
    backgroundColor: Colors.MAIN,
    borderRadius: 7,
  },
  buttonDisable: {
    padding: 20,
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.5,
    backgroundColor: Colors.GRAY,
    borderRadius: 7,
  },
  header: {
    color: Colors.MAIN,
    alignItems: 'center',
    padding: 15,
    fontSize: 20,
    flexDirection: 'column',
  },
});
