import React from 'react';
import {
	GiftedChat,
	Bubble,
	Send,
	SystemMessage,
	InputToolbar,
} from 'react-native-gifted-chat';
import {
	StyleSheet,
	ScrollView,
	View,
	Platform,
	KeyboardAvoidingView,
	Text,
	ImageBackground,
	TextInput,
	Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

//Firestore Database
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
	constructor() {
		super();
		this.state = {
			messages: [],
			uid: 0,
			user: {
				_id: '',
				name: '',
				avatar: '',
			},
			isConnected: false,
		};

		//connect to firebase Database
		const firebaseConfig = {
			apiKey: 'AIzaSyD2500-r-oe9EqPIAHRZbQJn_c22s6urTg',
			authDomain: 'chatapp-76013.firebaseapp.com',
			projectId: 'chatapp-76013',
			storageBucket: 'chatapp-76013.appspot.com',
			messagingSenderId: '24429586916',
			appId: '1:24429586916:web:6141faa923cca5fc4ebff1',
		};

		// initializes the Firestore app
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}

		//Stores and retrieves the chat messages users send
		this.referenceChatMessages = firebase.firestore().collection('messages');
		this.referenceUser = null;
	}

	componentDidMount() {
		let name = this.props.route.params.name;
		this.props.navigation.setOptions({ title: name });
		//check users connection
		NetInfo.fetch().then((connection) => {
			//if online
			if (connection.isConnected) {
				this.setState({ isConnected: true });

				console.log('online');

				//listening to authentication
				this.authUnsubscribe = firebase
					.auth()
					.onAuthStateChanged(async (user) => {
						if (!user) {
							return await firebase.auth().signInAnonymously();
						}

						this.setState({
							uid: user.uid,
							messages: [],
							user: {
								_id: user.uid,
								name: name,
								avatar: 'https://placeimg.com/140/140/any',
							},
						});

						//listens for updates
						this.unsubscribe = this.referenceChatMessages
							.orderBy('createdAt', 'desc')
							.onSnapshot(this.onCollectionUpdate);

						this.referenceUser = firebase
							.firestore()
							.collection('messages')
							.where('uid', '==', this.state.uid);
					});

				this.saveMessages();
			} else {
				console.log('offline');
				this.setState({ isConnected: false });
				this.getMessages();
			}
		});
	}

	onCollectionUpdate = (querySnapshot) => {
		const messages = [];
		//look through each doc
		querySnapshot.forEach((doc) => {
			//get query's data
			let data = doc.data();
			messages.push({
				_id: data._id,
				text: data.text,
				createdAt: data.createdAt.toDate(),
				user: {
					_id: data.user._id,
					name: data.user.name,
					avatar: 'https://placeimg.com/140/140/any',
				},
			});
		});

		this.setState({
			messages: messages,
		});
		this.saveMessages();
	};

	// save messages to local storage
	async getMessages() {
		let messages = '';
		try {
			messages = (await AsyncStorage.getItem('messages')) || [];
			this.setState({
				messages: JSON.parse(messages),
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	async saveMessages() {
		try {
			await AsyncStorage.setItem(
				'messages',
				JSON.stringify(this.state.messages)
			);
		} catch (error) {
			console.log(error.message);
		}
	}

	async deleteMessages() {
		try {
			await AsyncStorage.removeItem('messages');
			this.setState({
				messages: [],
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	componentWillUnmount() {
		NetInfo.fetch().then((connection) => {
			if (connection.isConnected) {
				//stop authentication
				this.authUnsubscribe();
				//stop changes
				this.unsubscribe();
			}
		});
	}

	// Adds messages to cloud storage
	addMessages() {
		const message = this.state.messages[0];
		this.referenceChatMessages.add({
			uid: this.state.uid,
			_id: message._id,
			text: message.text || '',
			createdAt: message.createdAt,
			user: message.user,
		});
	}

	onSend(messages = []) {
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}),
			() => {
				this.addMessages();
				this.saveMessages();
			}
		);
	}

	// When user is offline disable sending new messages
	renderInputToolbar(props) {
		if (this.state.isConnected == false) {
		} else {
			return <InputToolbar {...props} />;
		}
	}

	// Customize the color of the sender bubble
	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={styles.bubble}
				textStyle={styles.bubbleText}
			/>
		);
	}

	render() {
		const { color, name } = this.props.route.params;

		return (
			<View style={[{ backgroundColor: color }, styles.container]}>
				<GiftedChat
					messages={this.state.messages}
					renderBubble={this.renderBubble.bind(this)}
					renderInputToolbar={this.renderInputToolbar.bind(this)}
					onSend={(messages) => this.onSend(messages)}
					user={{
						_id: this.state.user._id,
						name: name,
						avatar: this.state.user.avatar,
					}}
				/>
				{/* Avoid keyboard to overlap text messages on older Andriod versions  */}
				{Platform.OS === 'android' ? (
					<KeyboardAvoidingView behavior="height" />
				) : null}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		color: '#fff',
		fontSize: 16,
	},
	bubble: {
		left: {
			backgroundColor: '#fff',
		},
		right: {
			backgroundColor: 'green',
		},
	},
	bubbleText: {
		left: {
			color: '#000',
		},
		right: {
			color: '#000',
		},
	},
});
