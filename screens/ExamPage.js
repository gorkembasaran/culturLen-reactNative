import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function ExamPage({ route, navigation }) {
  const { courseId, subjectId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [discussionReason, setDiscussionReason] = useState('');

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsCollection = collection(db, `courses/${courseId}/subjects/${subjectId}/questions`);
        const questionSnapshot = await getDocs(questionsCollection);
        let questionsList = questionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        questionsList = shuffleArray(questionsList).slice(0, 20); // 20 tane karışık soru seç
        setQuestions(questionsList);
      } catch (error) {
        console.error('Error fetching: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId, subjectId]);

  const handleOptionPress = (option) => {
    if (isAnswered) return;

    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    setSelectedOption(option);
    setIsAnswered(true);

    setResults([...results, { questionId: questions[currentQuestionIndex].id, isCorrect }]);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigation.navigate('ResultsPage', { results });
    }
  };

  const handleDiscussQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    try {
      await addDoc(collection(db, 'disputedQuestions'), {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        questionText: currentQuestion.questionText || '',
        questionImage: currentQuestion.questionImage || '',
        correctAnswer: currentQuestion.correctAnswer,
        options: currentQuestion.options,
        discussionReason,
        comments: [],
        timestamp: new Date().toISOString()
      });
      setModalVisible(false);
      setDiscussionReason('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 300 }} size="large" color="#0000ff" />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      {currentQuestion.questionImage && (
        <Image source={{ uri: currentQuestion.questionImage }} style={styles.questionImage} resizeMode="contain" />
      )}
      {currentQuestion.questionText && (
        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
      )}
      {currentQuestion.options.map((option, index) => {
        let backgroundColor = '#eaede6';
        if (isAnswered) {
          if (option === currentQuestion.correctAnswer) {
            backgroundColor = '#d6f0c7';
          } else if (option === selectedOption) {
            backgroundColor = '#edbcbb';
          }
        }

        return (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, { backgroundColor }]}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}
      {isAnswered && (
        <Button mode="contained" onPress={handleNextQuestion} style={styles.nextButton}>
          Devam Et
        </Button>
      )}
      <Button mode="outlined" onPress={() => setModalVisible(true)} style={styles.discussButton}>
        <Text style={styles.discussText}>
          Tartışmaya aç
        </Text>
      </Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Tartışmaya Açma Sebebi</Text>
          <TextInput
            label="Sebep"
            value={discussionReason}
            onChangeText={setDiscussionReason}
            style={styles.textInput}
            multiline
          />
          <Button mode="contained" onPress={handleDiscussQuestion} style={styles.submitButton}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Ekle</Text>
          </Button>
          <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.cancelButton}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>İptal</Text>
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    flex: 1,
  },
  questionImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5a5c58',
  },
  optionButton: {
    marginVertical: 5,
    borderColor: 'green',
    borderWidth: 0.2,
    borderRadius: 6,
    padding: 10,
    width: '100%',
  },
  optionText: {
    fontSize: 14,
    color: '#5a5c58',
  },
  nextButton: {
    marginTop: 20,
  },
  discussButton: {
    marginTop: 20,
    borderColor: '#634344',
    borderWidth: 0.5,
    padding: 3,
    backgroundColor: '#de4b50'
  },
  discussText: {
    color: 'white'
  },
  modalView: {
    marginTop: 200,
    marginHorizontal: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    width: 250,
    height: 100,
    marginBottom: 20,
    borderWidth: 0.4,
    borderRadius: 10
  },
  submitButton: {
    marginBottom: 10,
    padding: 1,
  },
  cancelButton: {
    borderColor: '#634344',
    borderWidth: 0.5,
    padding: 1,
    backgroundColor: '#de4b50'
  },
});