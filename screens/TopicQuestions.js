import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import GoBack from '../components/GoBack';

export default function TopicQuestions() {
  const [questions, setQuestions] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputedQuestions = async () => {
      try {
        const disputedQuestionsCollection = collection(db, 'disputedQuestions');
        const disputedQuestionsSnapshot = await getDocs(disputedQuestionsCollection);
        const disputedQuestionsList = disputedQuestionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort questions by timestamp in descending order
        const sortedQuestions = disputedQuestionsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setQuestions(sortedQuestions);
      } catch (error) {
        console.error('Error fetching disputed questions: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputedQuestions();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 300 }} size="large" color="#0000ff" />;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('QuestionDetails', { questionId: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.question}>{item.discussionReason}</Text>
          <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <GoBack />
      <View style={{marginTop : 60}}>
        <FlatList
          data={questions}
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
    margin: 10,
  },
  question: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
  }
});