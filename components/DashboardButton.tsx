import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';

interface DashboardButtonProps {
  icon: string;
  label: string;
  count: number;
  onPress?: () => void;
}

export default function DashboardButton({ icon, label, count, onPress }: DashboardButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
      <Card style={styles.card} elevation={3}>
        <Card.Content style={styles.content}>
          <Avatar.Icon icon={icon} size={36} style={styles.icon} />
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.count}>{count}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '45%',
    marginVertical: 10,
  },
  card: {
    height: 140,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: 10,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    backgroundColor: '#0891b2',
    color: '#0891b2',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '900',
    color: '#333',
  },
  count: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#666',
    fontSize: 16,
  },
});
