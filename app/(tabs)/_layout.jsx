import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TaskProvider } from "../../context/TaskContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, SquareCheckBig } from "lucide-react-native";
import { Provider } from 'react-redux';
import { store } from "../../redux/store";

export default function TabsLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1E2F" }}>
                <Provider store={store}>
                    <TaskProvider>
                        <Tabs screenOptions={{
                            tabBarStyle: {
                                backgroundColor: "#1E1E2F",
                            },
                            tabBarActiveTintColor: "white",
                            tabBarInactiveTintColor: "grey",
                        }}>
                            <Tabs.Screen
                                name="HomeScreen"
                                options={{
                                    headerShown: false,
                                    tabBarLabel: "Home",
                                    tabBarIcon: ({color, size}) => {
                                        return (<Home color={color} size={size} />)
                                    },
                                }}
                            />
                            <Tabs.Screen
                                name="TaskScreen"
                                options={{
                                    headerShown: false,
                                    tabBarLabel: "Tasks",
                                    tabBarIcon: ({color, size}) => {
                                        return (<SquareCheckBig color={color} size={size} />)
                                    },
                                }}
                            />
                        </Tabs>
                    </TaskProvider>
                </Provider>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
