import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getUserDataFromFirestore } from '../operations/firestoreOperations';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function Profil() {
  const [user, setUser] = useState({});
  const [solvedQuestions, setSolvedQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userDiscussions, setUserDiscussions] = useState([]);
  const auth = getAuth();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const fetchUserData = async (uid) => {
    try {
      const data = await getUserDataFromFirestore(uid);
      if (data) {
        setSolvedQuestions(data.solvedQuestions || 0);
        setCorrectAnswers(data.correctAnswers || 0);
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const fetchUserDiscussions = async (uid) => {
    try {
      const q = query(collection(db, 'disputedQuestions'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const discussionsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserDiscussions(discussionsList);
    } catch (error) {
      console.error('Error fetching disputed questions: ', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
          id: currentUser.uid
        });

        fetchUserData(currentUser.uid);
        fetchUserDiscussions(currentUser.uid);
      }
    }
  }, [isFocused]);

  const signOutHandler = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Sign out error: ', error);
    }
  };

  const renderDiscussionItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('QuestionDetails', { questionId: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>{item.discussionReason}</Paragraph>
          <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title
          title={user.displayName}
          subtitle={user.email}
          left={(props) => <Avatar.Icon {...props} icon="account" />}
        />
        <Card.Content>
          <Title>Başarı Durumu:</Title>
          <Paragraph>Çözülen Soru Sayısı: {solvedQuestions}</Paragraph>
          <Paragraph>Doğru Cevap Sayısı: {correctAnswers}</Paragraph>
          <Paragraph>Başarı Oranı: %{solvedQuestions === 0 ? '0' : ((correctAnswers / solvedQuestions) * 100).toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.discussionsCard}>
        <Card.Title style={{marginLeft : 10, marginTop : 5}} title="Açılan Tartışmalar" />
        <Card.Content style={styles.discussionsContent}>
          <FlatList
            data={userDiscussions}
            renderItem={renderDiscussionItem}
            keyExtractor={item => item.id}
          />
        </Card.Content>
      </Card>
      <Button style={styles.signOut} onPress={signOutHandler}>
        <Text style={styles.titleSignOut}>Çıkış Yap</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  signOut: {
    marginTop: 20,
    backgroundColor: 'darkblue',
  },
  titleSignOut: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  discussionsCard: {
    marginTop: 20,
    maxHeight : 400,
  },
  discussionsContent: {
    height: 300
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 8
  },
  date: {
    fontSize: 12,
    color: 'gray',
  }
});