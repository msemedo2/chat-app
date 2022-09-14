import React, { Component } from 'react';
import BackgroundImage from '../assets/BackgroundImage.png';
import {
	View,
	Text,
	Button,
	TextInput,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
} from 'react-native';

export default class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: '', color: '' };
	}

	render() {
		return (
			<View style={styles.container}>
				<ImageBackground source={BackgroundImage} style={styles.image}>
					<Text style={styles.title}>Chat App</Text>
					<View style={styles.box}>
						<TextInput
							style={[styles.input, styles.text]}
							onChangeText={(name) => this.setState({ name })}
							value={this.state.name}
							placeholder="Your Name"
						/>
						<View style={styles.colorWrapper}>
							<Text style={[styles.text, styles.label]}>
								Choose Background Color
							</Text>
							<View style={styles.colors}>
								<TouchableOpacity
									style={[styles.color, styles.colorBlack]}
									onPress={() => this.setState({ color: '#090C08' })}
								/>
								<TouchableOpacity
									style={[styles.color, styles.colorPurple]}
									onPress={() => this.setState({ color: '#A491D3' })}
								/>
								<TouchableOpacity
									style={[styles.color, styles.colorBlue]}
									onPress={() => this.setState({ color: '#23B5D3' })}
								/>
								<TouchableOpacity
									style={[styles.color, styles.colorGreen]}
									onPress={() => this.setState({ color: '#3EC300' })}
								/>
								<TouchableOpacity
									style={[styles.color, styles.colorOrange]}
									onPress={() => this.setState({ color: '#F96E46' })}
								/>
							</View>
						</View>
						<View style={styles.buttonWrapper}>
							<TouchableOpacity
								style={styles.button}
								onPress={() =>
									this.props.navigation.navigate('Chat', {
										name: this.state.name,
										color: this.state.color,
									})
								}
							>
								<Text style={styles.buttonText}>Start Chatting</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		resizeMode: 'cover',
	},
	title: {
		fontSize: 45,
		fontWeight: '600',
		color: '#fff',
	},
	box: {
		backgroundColor: '#fff',
		width: '88%',
		alignItems: 'center',
		height: '44%',
		justifyContent: 'space-evenly',
		borderRadius: 15,
	},
	input: {
		height: 50,
		width: '88%',
		borderColor: 'gray',
		borderWidth: 2,
		borderRadius: 20,
		color: '#757083',
		fontSize: 16,
		fontWeight: '300',
		opacity: 50,
		marginTop: 20,
	},
	text: {
		color: '#757083',
		fontSize: 16,
		fontWeight: '300',
		textAlign: 'center',
	},
	colorWrapper: {
		width: '88%',
		height: '60%',
		justifyContent: 'center',
	},
	label: {
		marginBottom: '8%',
	},
	colors: {
		flexDirection: 'row',
		marginBottom: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	color: {
		borderRadius: 20,
		width: 40,
		height: 40,
	},
	colorBlack: {
		backgroundColor: '#090C08',
	},
	colorPurple: {
		backgroundColor: '#A491D3',
	},
	colorBlue: {
		backgroundColor: '#23B5D3',
	},
	colorGreen: {
		backgroundColor: '#3EC300',
	},
	colorOrange: {
		backgroundColor: '#F96E46',
	},
	buttonWrapper: {
		width: '88%',
		flex: 1,
		alignItems: 'center',
	},
	button: {
		height: 50,
		width: '50%',
		backgroundColor: '#383838',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
	},
	buttonText: {
		padding: 10,
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
