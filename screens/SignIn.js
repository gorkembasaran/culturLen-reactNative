import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Subheading } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default function SigninPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth()

  const handleSignin = async () => {
    setIsLoading(true)
    setError('')
    try{
        await signInWithEmailAndPassword(auth, email,password);
        setIsLoading(false)
        navigation.navigate('Main')
    }catch(error){
        setIsLoading(false);
        setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
        {!!error && (
        <Subheading style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>
          Hatalı giriş!
        </Subheading>
      )}
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleSignin} style={styles.button}>
        <Text style={styles.buttonTitle}>
            Giriş Yap
        </Text>
      </Button>
      <Button mode="contained" onPress={()=>navigation.navigate('SignUp')} style={[styles.button, styles.nav]}>
        <Text style={styles.buttonTitle}>
            Henüz bir hesabın yok mu ?
        </Text>
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
    color : 'darkblue'
  },
  input: {
    marginBottom: 16,
    color : 'black'
  },
  button: {
    marginTop: 16,
    paddingVertical : 6,
    borderRadius : 6,
  },
  buttonTitle : {
    color : 'white',
    fontSize : 14,
    fontWeight : 'bold'
  },
  nav: {
    backgroundColor : 'darkblue'
  }
});