import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import Firebase from 'firebase';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import renderIf from 'render-if';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import ModalPicker from 'react-native-modal-picker';
import DatePicker from 'react-native-datepicker';

import { Colors } from '../../styles';

const dataRegion = [
   { key: 0, section: true, label: 'Región' },
   { key: 'Metropolitana', label: 'Metropolitana' },
   { key: 'XV Arica y Parinacota', label: 'XV Arica y Parinacota' },
   { key: 'I Tarapacá', label: 'I Tarapacá' },
   { key: 'II Antofagasta', label: 'II Antofagasta' },
   { key: 'III Atacama', label: 'III Atacama' },
   { key: 'IV Coquimbo', label: 'IV Coquimbo' },
   { key: 'V Valparaíso', label: 'V Valparaíso' },
   { key: 'VI OHiggins', label: 'VI OHiggins' },
   { key: 'VII Maule', label: 'VII Maule' },
   { key: 'VIII Biobío', label: 'VIII Biobío' },
   { key: 'IX La Araucanía', label: 'IX La Araucanía' },
   { key: 'XIV Los Ríos', label: 'XIV Los Ríos' },
   { key: 'X Los Lagos', label: 'X Los Lagos' },
   { key: 'XI Aysén', label: 'XI Aysén' },
   { key: 'XII Magallanes y Antártica', label: 'XII Magallanes y Antártica' },
];

export default class editProyect extends Component {

  static propTypes = {
    user: PropTypes.object,
    dataProyect: PropTypes.object,
    dataUser: PropTypes.object,
    proyectId: PropTypes.integer,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      proyecto: '',
      mandante: '',
      comuna: '',
      centro: '',
      region: '',
      subgerente: '',
      jefeProyecto: '',
      servicio: '',
      administrador: '',
      jefeTerreno: '',
      jefeObra: '',
      otro: '',
      error: '',
    };
  }

  componentWillMount() {
    const { dataProyect } = this.props;
    this.setState({ loading: true, nombre: dataProyect.nombre, centro: dataProyect.centro, comuna: dataProyect.comuna,
      region: dataProyect.region, administrador: dataProyect.administrador, jefeObra: dataProyect.jefeObra, jefeTerreno: dataProyect.jefeTerreno,
      constructora: dataProyect.constructora, fechaInicio: dataProyect.fechaInicio, fechaTermino: dataProyect.fechaTermino, mandante: dataProyect.mandante,
     });
  }

  onEditProyect() {
    const { nombre, mandante, comuna, constructora, region, centro, fechaInicio, fechaTermino, jefeTerreno, administrador, jefeObra } = this.state;
    const { proyectId } = this.props;
    if (nombre !== '' && mandante !== '') {
      Firebase.database().ref(`/proyects/${proyectId}`).update({
        mandante,
        nombre,
        region,
        comuna,
        centro,
        constructora,
        fechaInicio,
        fechaTermino,
        administrador,
        jefeTerreno,
        jefeObra,
      }, () => Actions.pop());
    } else {
      this.setState({ error: 'Es necesario que el proyecto tenga nombre y mandante.' });
    }
  }

  render() {
    let { dataProyect } = this.props;
    const { error, mandante, nombre, region, comuna, centro, jefeTerreno, jefeObra, administrador, constructora, fechaInicio, fechaTermino } = this.state;
    let edit = true;
    if (!dataProyect) {
      dataProyect = this.state;
      edit = false;
    }
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Icon name="chevron-left" size={30} color="white" onPress={() => Actions.pop()} />
          <Text style={styles.superTitle}>Proyecto: {nombre}</Text>
        </View>
        <ScrollView>
          <FormLabel labelStyle={{ fontSize: 16 }} >Mandante</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ mandante: text })}
            value={mandante}
            selectionColor={Colors.MAIN}
            underlineColorAndroid={Colors.MAIN}
            onSubmitEditing={() => this.refs.proyecto.focus()}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >proyecto</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ nombre: text })}
            selectionColor={Colors.MAIN}
            value={nombre}
            underlineColorAndroid={Colors.MAIN}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >constructora</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ constructora: text })}
            selectionColor={Colors.MAIN}
            value={constructora}
            underlineColorAndroid={Colors.MAIN}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >region</FormLabel>
          <ModalPicker
            data={dataRegion}
            value={region}
            onChange={data => this.setState({ region: data.label })}
            selectTextStyle={{ color: Colors.GRIS }}
            optionTextStyle={{ color: Colors.MAIN }}
            cancelText="Cancelar"
            initValue={region}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >comuna</FormLabel>
          <FormInput
            value={comuna}
            onChangeText={text => this.setState({ comuna: text })}
            selectionColor={Colors.MAIN}
            underlineColorAndroid={Colors.MAIN}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >centro de costos</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ centro: text })}
            value={centro}
            selectionColor={Colors.MAIN}
            underlineColorAndroid={Colors.MAIN}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >Fecha de Inicio</FormLabel>
          <DatePicker
            date={fechaInicio}
            style={{ width: Dimensions.get('window').width }}
            mode="date"
            placeholder="seleccione una fecha"
            format="DD-MM-YYYY"
            // minDate="01-01-17"
            confirmBtnText="Aceptar"
            cancelBtnText="Cancelar"
            onDateChange={date => this.setState({ fechaInicio: date })}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >Fecha de Termino</FormLabel>
          <DatePicker
            date={fechaTermino}
            style={{ width: Dimensions.get('window').width }}
            mode="date"
            placeholder="seleccione una fecha"
            format="DD-MM-YYYY"
            minDate="01-01-17"
            confirmBtnText="Aceptar"
            cancelBtnText="Cancelar"
            onDateChange={date => this.setState({ fechaTermino: date })}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >Administrador</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ administrador: text })}
            value={administrador}
            returnKeyType="next"
            selectionColor={Colors.MAIN}
            underlineColorAndroid={Colors.MAIN}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >Jefe Terreno</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ jefeTerreno: text })}
            value={jefeTerreno}
            returnKeyType="next"
            selectionColor={Colors.MAIN}
            underlineColorAndroid={Colors.MAIN}
          />
          <FormLabel labelStyle={{ fontSize: 16 }} >Jefe Obra</FormLabel>
          <FormInput
            onChangeText={text => this.setState({ jefeObra: text })}
            value={jefeObra}
            returnKeyType="next"
            selectionColor={Colors.MAIN}
            underlineColorAndroid={Colors.MAIN}
          />
        </ScrollView>
        <Button
          onPress={() => this.onEditProyect()}
          small
          raised
          style={styles.input}
          title={edit ? 'Actualizar Proyecto' : 'Crear Proyecto'}
          backgroundColor={Colors.MAIN}
          buttonStyle={{ marginBottom: 10 }}
        />
        {renderIf(error)(() =>
          <Text style={styles.error}>{error}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column', // row, column
    // flexWrap: 'nowrap' // wrap, nowrap
    // alignItems: 'flex-start', // flex-start, flex-end, center, stretch
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
    marginLeft: 20,
    fontSize: 22,
    color: Colors.WHITE,
  },
});
