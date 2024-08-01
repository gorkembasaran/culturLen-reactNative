import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; 

export const saveUserDataToFirestore = async (userId, solvedQuestions, correctAnswers) => {
  try {
    await setDoc(doc(db, "users", userId), {
      solvedQuestions: solvedQuestions,
      correctAnswers: correctAnswers
    }, { merge: true });
    console.log('Veri Firestore\'a kaydedildi');
  } catch (e) {
    console.error('Veri Firestore\'a kaydedilemedi:', e);
  }
}

export const getUserDataFromFirestore = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Kullanıcı verisi bulunamadı");
      return null;
    }
  } catch (e) {
    console.error('Veri Firestore\'dan çekilemedi:', e);
    return null;
  }
}

export const updateUserStats = async (userId, newSolvedQuestions, newCorrectAnswers) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      solvedQuestions: newSolvedQuestions,
      correctAnswers: newCorrectAnswers
    });
    console.log('Kullanıcı istatistikleri güncellendi');
  } catch (e) {
    console.error('Kullanıcı istatistikleri güncellenemedi:', e);
  }
}