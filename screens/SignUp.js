import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Subheading } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { saveUserDataToFirestore } from '../operations/firestoreOperations';
import { AuthContext } from '../context/auth-context';

export default function SignupPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth();
  const { signUp } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState({})

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signUp({
        email : email,
        password : password,
        name : name,
        surname : surname
      })
      
      setLoading(false);
      navigation.navigate('Main');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      {!!error && (
        <Subheading style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>
          {error}
        </Subheading>
      )}
      <TextInput
        label="Ad"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
      />
      <TextInput
        label="Soyad"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
        autoCapitalize="words"
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
      />
      <TextInput
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button mode="contained" onPress={handleSignup} style={styles.button} loading={loading}>
        <Text style={styles.buttonTitle}>Kayıt Ol</Text>
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('SignIn')} style={[styles.button, styles.nav]}>
        <Text style={styles.buttonTitle}>Zaten hesabın var mı?</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nav: {
    backgroundColor: 'darkblue',
  },
});