import { Tabs } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            transform: [{ translateY: -30 }],
        }}
        onPress={onPress}
    >
        <View style={{
            width: 70,
            height: 70,
            flexDirection: 'row',           
            borderRadius: 35,
            backgroundColor: '#4c669f',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 10,
        }}>
            {children}
        </View>
    </TouchableOpacity>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D66E5A',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 25,
            right: 25,
            elevation: 0,
            backgroundColor: '#ffffff',
            borderRadius: 30,
            height: 70,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            borderTopWidth: 0,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 5,
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-medicine"
        options={{
            tabBarLabel: '',
            tabBarIcon: () => (
                <Feather name="plus" size={30} color="#FFFFFF" />
            ),
            tabBarButton: (props) => (
                <CustomTabBarButton {...props} />
            ),
        }}
       />
        <Tabs.Screen
            name="reports"
            options={{
                tabBarLabel: 'Reports',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="bar-chart-2" size={size} color={color} />
                ),
            }}
        />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="help"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="aboutus"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="privacypolicy"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="termsandconditions"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
