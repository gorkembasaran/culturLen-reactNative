import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import GoBack from '../components/GoBack';

export default function NewsDetailPage({ route }) {
  const { newsId } = route.params;
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const newsDoc = await getDoc(doc(db, 'news', newsId));
        if (newsDoc.exists()) {
          setNews(newsDoc.data());
        }
      } catch (error) {
        console.error('Error fetching news detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  if (loading) {
    return <ActivityIndicator style={{marginTop : 300}} size="large" color="#0000ff" />;
  }

  if (!news) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Haber bulunamadı.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GoBack />
      <Text style={styles.title}>{news.title}</Text>
      {news.imageUrl && (
        <Image source={{ uri: news.imageUrl }} style={styles.image} />
      )}
      <Text style={styles.content}>{news.content}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems : 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom : 20
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});