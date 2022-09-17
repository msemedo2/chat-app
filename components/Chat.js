import React from 'react';
import {
	GiftedChat,
	Bubble,
	Send,
	SystemMessage,
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

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
	constructor() {
		super();
		this.state = {
			uid: 0,
			messages: [],
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

		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}

		//create reference to messages collection
		this.referenceMessages = firebase.firestore().collection('messages');
	}

	onCollectionUpdate = (querySnapshot) => {
		const messages = [];
		// go through each document
		querySnapshot.forEach((doc) => {
			// get the QueryDocumentSnapshot's data
			let data = doc.data();
			messages.push({
				_id: data._id,
				text: data.text,
				createdAt: data.createdAt.toDate(),
				user: data.user,
			});
		});
		this.setState({
			messages,
		});
	};

	addMessages() {
		const message = this.state.messages[0];
		this.referenceMessages.add({
			_id: message._id,
			text: message.text,
			createdAt: message.createdAt,
			user: message.user,
		});
	}

	componentDidMount() {
		let { name } = this.props.route.params;
		if (name === '') {
			//Set navigation title to 'Chat Screen' if there's no userinput
			name = 'Chat Screen';
		}
		this.props.navigation.setOptions({
			title: name,
		});

		this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				firebase.auth().signInAnonymously();
			}
			this.setState({
				uid: user.uid,
				messages: [],
			});

			this.referenceMessages = firebase.firestore().collection('messages');
			this.unsubscribe = this.referenceMessages
				.orderBy('createdAt', 'desc')
				.onSnapshot(this.onCollectionUpdate);
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
		this.authUnsubscribe();
	}

	onSend(messages = []) {
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}),
			() => {
				this.addMessages();
			}
		);
	}

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
		const { color } = this.props.route.params;

		return (
			<View style={[{ backgroundColor: color }, styles.container]}>
				<GiftedChat
					messages={this.state.messages}
					renderBubble={this.renderBubble.bind(this)}
					onSend={(messages) => this.onSend(messages)}
					user={{
						_id: this.state.uid,
					}}
				/>
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
