import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import renderIf from 'render-if';

/*
  Component life-cycle:
  https://facebook.github.io/react/docs/component-specs.html
 */

export default class Template extends Component {

  static get defaultProps() {
    return {
      message: 'Template',
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      array: ['zero', 'one', 'two'],
      something: true,
    };

    // ES6 bindings
    // See: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    // See: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md#es6-classes
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ something: !this.state.something });
  }

  render() {
    return (
      <View style={styles.container}>

        <Text>{this.props.message}</Text>

        {/* Map array to text components */}
        {this.state.array.map((item, i) => (
          <Text key={i}>{item}</Text>
        ))}

        {/* <Button onPress={this.handleClick}>Press me</Button> */}

        {/* Conditional rendenring (https://github.com/ajwhite/render-if) */}
        {renderIf(this.state.something)(() => (
          <Text>This is rendered if 'something' is true</Text>
        ))}

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
    alignItems: 'center', // flex-start, flex-end, center, stretch
    // alignSelf: 'auto', // auto, flex-start, flex-end, center, stretch
    justifyContent: 'center', // flex-start, flex-end, center, space-between, space-around
    // position: 'relative', // absolute, relative
    // backgroundColor: 'white',
    // margin: 0,
    // padding: 0,
    // right: 0,
    // top: 0,
    // left: 0,
    // bottom: 0,
  },
});
