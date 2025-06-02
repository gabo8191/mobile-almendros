// Mock para @expo/vector-icons
// Crea componentes mock que renderizen como Text con el nombre del icono

const React = require('react');
const { Text } = require('react-native');

const createMockIcon = (iconSetName) => {
  const MockIcon = ({ name, size, color, ...props }) => {
    return React.createElement(Text, {
      ...props,
      children: name || iconSetName,
      testID: `icon-${name || iconSetName}`,
      style: [{ fontSize: size || 24 }, color && { color }, props.style],
    });
  };

  MockIcon.displayName = `Mock${iconSetName}Icon`;
  return MockIcon;
};

module.exports = {
  AntDesign: createMockIcon('AntDesign'),
  Entypo: createMockIcon('Entypo'),
  EvilIcons: createMockIcon('EvilIcons'),
  Feather: createMockIcon('Feather'),
  FontAwesome: createMockIcon('FontAwesome'),
  FontAwesome5: createMockIcon('FontAwesome5'),
  Fontisto: createMockIcon('Fontisto'),
  Foundation: createMockIcon('Foundation'),
  Ionicons: createMockIcon('Ionicons'),
  MaterialCommunityIcons: createMockIcon('MaterialCommunityIcons'),
  MaterialIcons: createMockIcon('MaterialIcons'),
  Octicons: createMockIcon('Octicons'),
  SimpleLineIcons: createMockIcon('SimpleLineIcons'),
  Zocial: createMockIcon('Zocial'),
};
