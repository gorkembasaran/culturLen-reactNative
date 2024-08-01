import { StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomePage from './screens/HomePage';
import ContentPage from './screens/ContentPage';
import Profil from './screens/Profil';
import SubjectsPage from './screens/SubjectsPage'
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import ExamPage from './screens/ExamPage';
import NewsPage from './screens/NewsPage';
import NewsDetailPage from './screens/NewsDetailPage';
import TopicQuestions from './screens/TopicQuestions';
import QuestionDetails from './screens/QuestionDetails';
import SignupPage from './screens/SignUp';
import SigninPage from './screens/SignIn';
import { auth } from './firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import ResultsPage from './screens/ResultsPage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext, AuthContextProvider } from './context/auth-context';


const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: 'green',
    accent: 'yellow',
  },
};

const TabsNavigator = () => {
  const navigation = useNavigation()

  useEffect(()=> {
    const uns = auth.onAuthStateChanged((user)=> {
      if(!user){
        navigation.navigate('SignUp')
      }
    })
    return () => uns()
  },[navigation])
  return (
    <SafeAreaProvider >
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Anasayfa') {
              iconName = 'home';
            } else if (route.name === 'İçerikler') {
              iconName = 'albums';
            } else if (route.name === 'Profil') {
              iconName = 'person-circle';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: '#b2baa6',
        })}
      >
        <Tabs.Screen name="Anasayfa" component={HomePage} options={{headerShown : false}} />
        <Tabs.Screen name="İçerikler" component={ContentPage} options={{title : 'Dersler' , headerShown : false}} />
        <Tabs.Screen name="Profil" component={Profil} options={{headerShown : false}} />
      </Tabs.Navigator>
    </SafeAreaProvider>
  );
};


export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const uns = auth.onAuthStateChanged((user)=>{
      setUser(user);
      if (initializing) setInitializing(false)
    });
    return ()=> uns()
  }, [])

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <AuthContextProvider>
            <Stack.Navigator>
              {user ? (
                <>
                  <Stack.Screen name='Main' component={TabsNavigator}
                  options={{ headerShown: false , title : 'Anasayfa'}}
                  />
                  <Stack.Screen name='SubjectsPage' component={SubjectsPage} options={{title : 'Konular'}} />
                  <Stack.Screen name='ExamPage' component={ExamPage} options={{title : 'Soru', headerShown : false}} />
                  <Stack.Screen name='ContentPage' component={ContentPage} options={{title : 'Dersler', headerShown : false}} />
                  <Stack.Screen name='Haberler' component={NewsPage} options={{headerShown : false}} />
                  <Stack.Screen name='Detaylar' component={NewsDetailPage} options={{headerShown : false}} />
                  <Stack.Screen name='Topic' component={TopicQuestions} options={{headerShown : false}}/>
                  <Stack.Screen name='QuestionDetails' component={QuestionDetails} options={{headerShown : false}} />
                  <Stack.Screen name='ResultsPage' component={ResultsPage} options={{headerShown : false}} />
                </>
              ): (
                <>
                  <Stack.Screen name='SignIn' component={SigninPage} options={{ presentation: 'fullScreenModal' , headerShown: false }} />
                  <Stack.Screen name='SignUp' component={SignupPage} options={{ presentation: 'fullScreenModal' , headerShown: false }} />
                </>
              )}
            </Stack.Navigator>
          </AuthContextProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});