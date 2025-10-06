
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Switch, Animated } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";

export default function AddMedicineScreen() {
    const router = useRouter();
    const [medicineName, setMedicineName] = useState("");
    const [dosage, setDosage] = useState("");
    const [time, setTime] = useState("");
    const [isDaily, setIsDaily] = useState(true);

    const isFormValid = medicineName.trim() !== '' && dosage.trim() !== '' && time.trim() !== '';

    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const formRowStyle = (delay) => ({
        opacity: anim,
        transform: [
            {
                translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                })
            }
        ],
        transitionDelay: `${delay}ms`
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Medicine</Text>
            </View>

            <View style={styles.formContainer}>
                <Animated.View style={formRowStyle(0)}>
                    <View style={styles.inputRow}>
                        <FontAwesome5 name="pills" size={20} color="#ADB5BD" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Medicine Name"
                            value={medicineName}
                            onChangeText={setMedicineName}
                            placeholderTextColor="#ADB5BD"
                        />
                    </View>
                </Animated.View>

                <Animated.View style={formRowStyle(100)}>
                    <View style={styles.inputRow}>
                        <FontAwesome5 name="prescription-bottle" size={20} color="#ADB5BD" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Dosage (e.g., 500mg)"
                            value={dosage}
                            onChangeText={setDosage}
                            placeholderTextColor="#ADB5BD"
                        />
                    </View>
                </Animated.View>

                <Animated.View style={formRowStyle(200)}>
                    <View style={styles.inputRow}>
                        <FontAwesome5 name="clock" size={20} color="#ADB5BD" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Time (e.g., 8:00 AM)"
                            value={time}
                            onChangeText={setTime}
                            placeholderTextColor="#ADB5BD"
                        />
                    </View>
                </Animated.View>

                <Animated.View style={formRowStyle(300)}>
                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Take Daily</Text>
                        <Switch
                            value={isDaily}
                            onValueChange={setIsDaily}
                            trackColor={{ false: "#CED4DA", true: "#a8c4ff" }}
                            thumbColor={isDaily ? "#4c669f" : "#f4f3f4"}
                        />
                    </View>
                </Animated.View>

                <TouchableOpacity 
                    style={[styles.addButton, {backgroundColor: isFormValid ? '#4c669f' : '#a8c4ff'}]}
                    disabled={!isFormValid}
                    onPress={() => { /* Handle adding medicine logic */ }}
                >
                    <Text style={styles.addButtonText}>Add Medicine</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#4c669f',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    backButton: {
        marginRight: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    formContainer: {
        padding: 30,
        flex: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 20,
        paddingHorizontal: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputIcon: {
        marginRight: 15,
    },
    input: {
        flex: 1,
        height: 55,
        fontSize: 16,
        color: '#343A40',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    switchLabel: {
        fontSize: 18,
        color: '#495057',
        fontWeight: '500',
    },
    addButton: {
        borderRadius: 15,
        padding: 18,
        alignItems: 'center',
        marginTop: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
