import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import ButtonContent from '../components/ButtonContent';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function SubjectsPage({ route }) {
  const { courseId } = route.params; // Burada route.params.courseId olarak düzeltin
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!courseId) {
        console.error('courseId parametresi eksik');
        return;
      }
      try {
        const subjectsCollection = collection(db, `courses/${courseId}/subjects`);
        const subjectSnapshot = await getDocs(subjectsCollection);
        const subjectsList = subjectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubjects(subjectsList);
      }catch(error){
        console.error('Error fetching :', error)
      }finally{
        setLoading(false)
      }

      
    };

    fetchSubjects();
  }, [courseId]);

  if (loading) {
    return <ActivityIndicator style={{marginTop : 300}} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bir konu seç ve soru çözmeye başla!</Text>
      {subjects.map(subject => (
        <ButtonContent
          key={subject.id}
          title={subject.name}
          navigateLink='ExamPage'
          params={{ courseId, subjectId: subject.id }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: 20,
    textAlign: 'center',
  },
});