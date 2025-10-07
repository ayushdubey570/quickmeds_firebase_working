import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Avatar = ({ name, size = 60 }) => {
  const getInitials = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size / 2 }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#4c669f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Avatar;