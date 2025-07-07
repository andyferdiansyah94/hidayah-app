import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const AppBar = ({ title, backgroundColor = '#f5f5f5', textColor = '#333', fontSize = 20 }) => {
  return (
    <View style={[styles.appBar, { backgroundColor }]}>
      <Text style={[styles.appBarTitle, { color: textColor, fontSize }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBarTitle: {
    fontWeight: 'bold',
  },
});

export default AppBar;