import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const TabBar = ({ state, descriptors, navigation }) => {
    const primaryColor = '#F79300';
    const greyColor = '#737373';

    const icons = {
        index: (props) => <AntDesign name="home" size={26} color={props.color} />,
        history: (props) => <MaterialIcons name="history" size={26} color={props.color} />,
        profile: (props) => <AntDesign name="user" size={26} color={props.color} />,
        login: (props) => <AntDesign name="user" size={26} color={props.color} />,
        Karyawan: (props) => <AntDesign name="user" size={26} color={props.color} />
    };
    
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
               if (route.name === 'karyawan') return null;
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title || route.name;
                const isFocused = state.index === index;

                if (['_sitemap', '+not-found'].includes(route.name)) return null;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.name}
                        style={styles.tabBarItem}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    >
                        {icons[route.name] && icons[route.name]({
                            color: isFocused ? primaryColor : greyColor
                        })}
                        <Text style={{ 
                            color: isFocused ? primaryColor : greyColor,
                            fontSize: 11
                        }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
    tabBarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    }
});

export default TabBar;
