import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

type RootStackParamList = {
  Main: undefined;
  Registration: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function MainHeaderComponent() {
  const navigation = useNavigation<NavigationProp>();

  const handleSignInPress = () => {
    navigation.navigate('Registration');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../../resources/icons/au icon xs.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      {/* Header Title */}
      <Text style={styles.title}>
        Achievement Unlocked
      </Text>
      
      {/* Sign In Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignInPress}>
        <FontAwesomeIcon 
          icon={faRightToBracket} 
          size={18} 
          color="#0F1620" 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F1620',
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'left',
    marginLeft: 12,
  },
  button: {
    backgroundColor: '#fac31e',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
