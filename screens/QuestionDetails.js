import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { Card, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { collection, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import GoBack from '../components/GoBack';

export default function QuestionDetails({ route }) {
  const { questionId } = route.params;
  const [question, setQuestion] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const questionDoc = await getDoc(doc(db, 'disputedQuestions', questionId));
        if (questionDoc.exists()) {
          const questionData = questionDoc.data();
          setQuestion(questionData);
          setComments(questionData.comments || []);
        }
      } catch (error) {
        console.error('Error fetching question details: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [questionId]);

  const handleAddComment = async () => {
    const newComment = {
      user: currentUser.displayName,
      userId: currentUser.uid,
      comment,
      timestamp: new Date().toISOString(),
    };
    try {
      const questionRef = doc(db, 'disputedQuestions', questionId);
      await updateDoc(questionRef, {
        comments: arrayUnion(newComment),
      });
      setComments([...comments, newComment]);
      setComment('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 300 }} size="large" color="#0000ff" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <GoBack />
          <Card style={[styles.card, {marginTop : 120}]}>
            <Card.Content>
              {question.questionText ? (
                <Text style={styles.question}>{question.questionText}</Text>
              ) : (
                <Image source={{ uri: question.questionImage }} style={styles.questionImage} resizeMode="contain" />
              )}
              {question.questionText && question.options.map((option, index) => (
                <Text key={index} style={styles.option}>{option}</Text>
              ))}
              <Text style={styles.correctAnswer}>Doğru Cevap: {question.correctAnswer}</Text>
              <Text style={{ fontSize: 14, marginTop: 10 }}>{question.discussionReason}</Text>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: 5 }}>Ekleyen: {question.userName}</Text>
              <Text style={{ fontSize: 12, color: 'grey', marginTop: 5 }}>Eklenme Tarihi: {new Date(question.timestamp).toLocaleString()}</Text>
            </Card.Content>
          </Card>
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Kullanıcı Yorumları</Text>
            <FlatList
              data={comments}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Text style={styles.commentUser}>{item.user}:</Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.inputContainer}>
        <TextInput
          label="Yorum Yap"
          placeholder="Yorumunuzu yazın..."
          value={comment}
          onChangeText={setComment}
          multiline
          style={styles.textInput}
          onSubmitEditing={handleAddComment}
        />
        <Button mode="contained" onPress={handleAddComment} style={styles.button}>Gönder</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionImage: {
    width: '100%',
    height: 250,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  option: {
    fontSize: 16,
    marginVertical: 4,
  },
  correctAnswer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 16,
  },
  commentsSection: {
    flex: 1,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  commentText: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  textInput: {
    flex: 1,
    borderTopLeftRadius: 20,
  },
  button: {
    alignSelf: 'center',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 9,
  },
});