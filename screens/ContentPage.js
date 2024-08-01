import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Touchable, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import ButtonContent from '../components/ButtonContent';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import GoBack from '../components/GoBack';

export default function ContentPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation()

  useEffect(() => {
    const fetchCourses = async () => {
      try{
        const coursesCollection = collection(db, 'courses');
        const courseSnapshot = await getDocs(coursesCollection);
        const coursesList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesList);
      }catch(error){
        console.error('Error fecthing :', error)
      }finally{
        setLoading(false)
      }
    };
    
    fetchCourses();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{marginTop : 300}} size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GoBack />
      <Text style={styles.title}>Ders İçerik Seçimi</Text>
      {courses.map(course => (
        <ButtonContent
          key={course.id}
          title={course.name}
          navigateLink='SubjectsPage'
          params={{ courseId: course.id }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
});