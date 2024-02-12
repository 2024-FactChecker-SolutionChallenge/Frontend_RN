import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, FlatList } from 'react-native';

const SignupScreen = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // 추가적인 상태 변수들 (예: 약관 동의 등)
    // ... 이전 상태 변수들

    const [isAgree, setIsAgree] = useState(false);

    // 스위치 상태를 변경하는 함수입니다.
    const toggleSwitch = () => setIsAgree(previousState => !previousState);

    const handleSignup = () => {
        // E-mail, Nickname, P/W, 약관 동의 여부 등의 유효성을 검사합니다.
        if (!email || !username || !password) {
            alert('E-mail, Nickname, P/W를 모두 입력해주세요.');
            return;
        }
        
        // if (!isAgree) {
        //     alert('약관에 동의해주세요.');
        //     return;
        // }
    
        // 회원가입 로직을 수행합니다.
        // 예: 서버에 회원가입 요청을 보냅니다.
        // fetch 또는 axios를 사용하여 서버에 요청을 보낼 수 있습니다.
        // 예: fetch('https://api.example.com/signup', {
        //            method: 'POST',
        //            body: JSON.stringify({ email, username, password }),
        //            headers: {
        //                'Content-Type': 'application/json'
        //            }
        //        })
        //        .then(response => response.json())
        //        .then(data => {
        //            console.log(data);
        //            // 회원가입 성공 또는 실패에 따라 적절한 처리를 수행합니다.
        //        })
        //        .catch(error => {
        //            console.error('Error:', error);
        //        });
    };

    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [selectedLearningLevel, setSelectedLearningLevel] = useState(null);
    const [selectedInterests, setSelectedInterests] = useState([]);

    const learningLevels = ['Beginner', 'Intermediate', 'Advanced'];
    const interests1 = ['Politics', 'Economy', 'Society'];
    const interests2 = ['Culture', 'World', 'IT/Science'];

    const handleSelectLearningLevel = (level) => {
    setSelectedLearningLevel(level);
    };

    const handleSelectInterest = (interest) => {
    setSelectedInterests(prevInterests => {
        if (prevInterests.includes(interest)) {
        return prevInterests.filter(i => i !== interest);
        } else {
        return [...prevInterests, interest];
        }
    });
    };

    // Render function for the interests FlatList
    const renderInterestItem = ({ item }) => (
        <View style = {styles.interestButtonBox}>
            <TouchableOpacity
                style={[
                styles.interestButton,
                selectedInterests.includes(item) && styles.selectedInterestButton
                ]}
                onPress={() => handleSelectInterest(item)}
                >  
                    <Text
                        style={[
                            styles.interestButtonText,
                            selectedInterests.includes(item) && styles.selectedInterestButtonText
                        ]}
                    >
                    {item}
                    </Text>
            </TouchableOpacity>
    </View>
    );
    

return (
    <View style={styles.container}>
        <View style={styles.wrapContainer}>
            <View style={styles.leftContainer}>
                <View style={styles.label}>
                    <Text style={[styles.labelText, {marginTop : "10%"}]}>Nickname</Text>    
                </View>
                <View style={styles.label}>
                    <Text style={[styles.labelText]}>E-mail</Text>    
                </View>
                <View style={styles.label}>
                    <Text style={[styles.labelText]}>P/W</Text>    
                </View>
                <View style={styles.label}>
                    <Text style={[styles.labelText]}>Confirm P/W</Text>    
                </View>
            </View>
            <View style={styles.rightContainer}>
                <TextInput
                    placeholder="Nickname"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <TextInput
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    placeholder="P/W"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    placeholder="P/W 확인"
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    secureTextEntry
                    style={styles.input}
                />
            </View>
        </View>
    <Text style = {styles.textGoal}>Weekly Goals</Text>
    <View style={styles.radioGroup}>
        {learningLevels.map(level => (
        <TouchableOpacity
            key={level}
            style={styles.radioButton}
            onPress={() => handleSelectLearningLevel(level)}
        >
            <Text style={styles.radioText}>{level}</Text>
            <View style={styles.outerCircle}>
            {selectedLearningLevel === level && <View style={styles.innerCircle} />}
            </View>
        </TouchableOpacity>
        ))}
    </View>
    <Text style = {styles.textInterest}>Interests</Text>
    <View style ={styles.interestContainer}>
            <FlatList
            data={interests1}
            style = {styles.interestBox}
            renderItem={renderInterestItem}
            keyExtractor={(item) => item}
            horizontal={true}
        />
        <FlatList
            data={interests2}
            style = {styles.interestBox}
            renderItem={renderInterestItem}
            keyExtractor={(item) => item}
            horizontal={true}
        />
    </View>
    

        {/* 회원가입 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        
        {/* 스위치 */}
        {/* <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>약관에 동의합니다</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isAgree ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isAgree}
            />
        </View> */}
    </View>
);
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection : 'column'
    },
    wrapContainer :{
        flexDirection: 'row',
        minWidth : "100%",
        height : 300
    },
    leftContainer :{
        flexDirection: 'column',
        left:0,
        minWidth : "20%",
    },
    rightContainer :{
        flexDirection: 'column',
        minWidth :'72%',
        left : "5%",
    },
    label: {
        width: '110%',
        justifyContent : 'center',
        alignItems : 'left',
        height: 40,
        marginTop: "17%",
        marginBottom : "20%",
        textAlign : 'left',
        left : "15%"
    },   
    labelText : {
        fontSize : 12
    }, 
    input: {
        width: '95%',
        justifyContent : 'center',
        alignItems : 'center',
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#55433B',
        marginVertical: "5%",
        left : "3%"
    },
    textGoal : {
        color : '#55433B',
        fontSize : 20,
        fontWeight : '500',
        textAlign : 'center',
        marginTop : 20,
    },
    textInterest : {
        color : '#55433B',
        fontSize : 20,
        fontWeight : '500',
        textAlign : 'center',
        marginTop : 20,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
    },
    radioButton: {
        flexDirection: 'row',
        justifyContent : 'center',
        alignItems: 'center',
        minWidth : "33%",
    },
    radioText: {
        marginRight: 8,
        color : '#55433B',
    },
    // 스위치와 관련된 스타일을 추가합니다.
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        marginRight: 10,
    },
    outerCircle: {
        // ... Styles for the outer circle of the radio button
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#55433B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    innerCircle: {
        // ... Styles for the inner circle of the radio button
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#55433B',
    },
    interestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight : 110,
    },
    interestBox: {
        flexGrow: 0,
        flexDirection: 'row',
    },
    interestButtonBox: {
        marginHorizontal: 10, // Space between items
        justifyContent: 'center',
        alignItems: 'center',
    },
    interestButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#55433B',
        borderRadius: 15,
        backgroundColor: 'transparent',
        marginVertical : 5,
    },
    selectedInterestButton: {
        backgroundColor: '#55433B',
    },
    interestButtonText: {
        color: '#55433B',
    },
    selectedInterestButtonText: {
        color: 'white',
    },
    button: {
        backgroundColor: '#55433B', // 버튼의 배경색
        padding: 10, // 버튼 안쪽의 여백
        borderRadius: 5, // 버튼의 모서리 둥글기
        alignItems: 'center', // 텍스트를 중앙에 정렬
        justifyContent : 'center',
        maxWidth : "50%",
        marginHorizontal : "25%",
        marginVertical : '10%'
    },
    buttonText: {
        color: 'white',
    },
        
});


export default SignupScreen;