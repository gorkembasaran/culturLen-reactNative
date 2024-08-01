import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import GoBack from '../components/GoBack';

export default function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, 'news'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const newsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNewsData(newsList);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Detaylar', { newsId: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{marginTop : 300}} size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <GoBack />
      <View style={{marginTop : 60}}>
        <FlatList
          data={newsData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    margin: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
});