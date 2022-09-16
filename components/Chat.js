import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
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

export default class Chat extends Component {
	constructor() {
		super();
		this.state = {
			messages: [],
		};
	}
	componentDidMount() {
		this.setState({
			messages: [
				{
					_id: 1,
					text: 'Hello developer',
					createdAt: new Date(),
					user: {
						_id: 2,
						name: 'React Native',
						avatar: 'https://placeimg.com/140/140/any',
					},
				},
				{
					_id: 2,
					text: 'This is a system message',
					createdAt: new Date(),
					system: true,
				},
			],
		});
	}
	onSend(messages = []) {
		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}));
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
		let { name } = this.props.route.params;
		this.props.navigation.setOptions({ title: name });
		const { color } = this.props.route.params;

		return (
			<View style={[{ backgroundColor: color }, styles.container]}>
				<GiftedChat
					renderBubble={this.renderBubble.bind(this)}
					messages={this.state.messages}
					onSend={(messages) => this.onSend(messages)}
					user={{
						_id: 1,
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
