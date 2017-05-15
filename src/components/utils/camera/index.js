import React, { Component, PropTypes } from 'react';
import { Dimensions, StyleSheet, Image, View, StatusBar, Alert } from 'react-native';
import Camera from 'react-native-camera';
import { Icon, Grid, Col, FormLabel } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Orientation from 'react-native-orientation';
import Firebase from 'firebase';

import { Colors } from '../../styles';

// TODO: agregar icono de camara y volver #camara
// TODO: Al tomar una foto esta se previsualiz en tamaño completo, esta incluye los botones volver, guardar y tomar otra #camara
// TODO: 2 opcionestomar imagen o obtener de imagenes del celular #camara

export default class Camara extends Component {

  static propTypes = {
    user: PropTypes.object,
    dataProject: PropTypes.object,
    dataUser: PropTypes.object,
    protocoloId: PropTypes.integer,
    proyectId: PropTypes.integer,
  }

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
    };
  }

  componentDidMount() {
    Orientation.unlockAllOrientations();
    StatusBar.setHidden(true);
  }

  componentWillUnmount() {
    StatusBar.setHidden(false);
    Orientation.lockToPortrait();
  }

  takePicture() {
    this.camera.capture()
    .then((data) => {
      console.log(data.path.split('/'));
      console.log(data.path.split('/').length);
      console.log(data.path.split('/')[data.path.split('/').length - 1]);
      this.setState({ img: data, preview: true });
    })
    .catch(() =>
      Alert.alert(
        'Lo lamentamos pero la imagen no fue tomada',
        [
          { text: 'Aceptar' },
        ]
      ));
  }

  savePicture() {
    // const { proyectId, protocoloId } = this.props;
    // const file = img.path.split('/')[img.path.split('/').length - 1];
    // const metadata = { contentType: 'image/jpeg' };
    // // Listen for state changes, errors, and completion of the upload.
    // const uploadTask = Firebase.storage().ref().child(`images/${proyectId}/${protocoloId}`)
    // .put(file, metadata);
    // uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    //   snapshot => {
    //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     Alert.alert(
    //       `Subiendo un ${progress}% completado.`,
    //       progress === 100 && [{ text: 'Aceptar', onPress: () => this.setState({ preview: false }) }]
    //     );
    //   }, () => {
    //     Alert.alert(
    //       'Ha ocurrido un error al subir la imagen.',
    //       [{ text: 'Aceptar' }]
    //     );
    //   });
  }

  render() {
    const { preview, img } = this.state;
    // console.log(img && img.path);
    // console.log(this.props.proyectId, this.props.protocoloId);
    return (
      preview ?
        <View style={{ flex: 1 }}>
          <FormLabel labelStyle={{ fontSize: 20 }}>Previsualización</FormLabel>
          <Image source={{ uri: img.path }} style={{ width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').height * 0.8, justifyContent: 'center', alignSelf: 'center', marginTop: 10, marginBottom: 10, borderRadius: 5 }} />
          <Grid style={{ backgroundColor: '#333333', flex: 1, alignItems: 'flex-end' }}>
            <Col>
              <Icon
                name="reply"
                color={Colors.MAIN}
                onPress={() => this.setState({ preview: false })}
                size={50}
                style={{ margin: 50 }}
              />
            </Col>
            <Col>
              <Icon
                name="file-download"
                color={Colors.MAIN}
                onPress={() => Alert.alert(
                    'Acción disponible en nuevas actualizaciones',
                    'Actualmente no es posible guardar imagenes en el servidor',
                  [
                    { text: 'Aceptar', onPress: () => this.setState({ preview: false }) },
                  ]
                )}
                size={50}
                style={{ margin: 50 }}
              />
            </Col>
          </Grid>
        </View>
        :
        <View style={styles.container}>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            orientation={"portrait"}
          >
            <Grid style={{ flex: 1, alignItems: 'flex-end', marginBottom: 40 }}>
              <Col>
                <Icon
                  name="reply"
                  color={Colors.MAIN}
                  onPress={() => Actions.pop()}
                  size={50}
                  style={{ margin: 50 }}
                />
              </Col>
              <Col>
                <Icon
                  name="camera"
                  color={Colors.MAIN}
                  onPress={() => this.takePicture()}
                  size={50}
                  style={{ margin: 50 }}
                />
              </Col>
              <Col></Col>
            </Grid>
          </Camera>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
});
