import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Avatar = ({ name, size = 60 }) => {
  const getInitials = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)']}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
    >
      {initials ? (
        <Text style={[styles.avatarText, { fontSize: size / 2 }]}>{initials}</Text>
      ) : (
        <Feather name="user" size={size / 2} color="#5d4037" />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  avatar: {
    
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    color: '#5d4037',
    fontWeight: 'bold',
  },
});

export default Avatar;
