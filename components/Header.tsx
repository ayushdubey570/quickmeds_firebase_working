import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showProfile }) => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {showProfile && (
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
            <Image
              source={{ uri: "https://i.imgur.com/8i2j8zL.png" }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default Header;
